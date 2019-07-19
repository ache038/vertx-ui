const fs = require("fs");
const Immutable = require("immutable");
const separator = "/";

const collect = dirPath => {
    const dirs = fs.readdirSync(dirPath);
    const results = [];
    for (let idx = 0; idx < dirs.length; idx++) {
        const folder = dirs[idx];
        const hit = dirPath + separator + folder;
        if (!hit.startsWith("\\.")) {
            const item = fs.lstatSync(hit);
            if (item.isDirectory()) {
                const subFolder = fs.readdirSync(hit);
                for (let jdx = 0; jdx < subFolder.length; jdx++) {
                    const subHit = subFolder[jdx];
                    const subFile = "\./" + folder + separator + subHit;
                    const subItem = hit + separator + subHit;
                    if (!subHit.startsWith("\\.")) {
                        const jitem = fs.lstatSync(subItem);
                        if (jitem.isDirectory()) {
                            // 二级目录处理
                            results.push(subFile);
                        }
                    }
                }
            }
        }
    }
    return results;
};

const generateRoute = (Component = [], Config) => {
    const routes = [];
    Component.forEach(item => {
        // 计算该页面的模板
        const special = Config.special;
        const tpl = !special ? Config.defined : (() => {
            let pageTpl = Config.defined;
            for (const specTpl in Config.special) {
                if (Config.special.hasOwnProperty(specTpl)) {
                    const pages = Config.special[specTpl];
                    const $pages = Immutable.fromJS(pages);
                    if ($pages.contains(item)) {
                        pageTpl = specTpl;
                        break;
                    }
                }
            }
            return pageTpl;
        })();
        const route = {};
        route.layout = tpl;
        route.page = item;
        route.uri = item.replace(/_/g, "/").replace(/\$/g, '-');
        routes.push(route);
    });
    return routes;
};

const layoutDir = collect('./src/container');
// index.js for container
let line = [];
const layouts = [];
layoutDir.forEach(layout => {
    const key = layout.replace(/\./g, '').replace(/-/g, '$').replace(/\//g, '_');
    line.push(`import ${key} from '${layout}/UI';`);
    layouts.push(key);
});
line.push('\nexport default {');
layouts.forEach(variable => {
    line.push(`\t${variable},`)
});
line.push('}\n');
let content = line.join("\n");
fs.writeFile("src/container/index.js", content, () => {
    console.log("[SUC] Successfully to write data to src/container/index.js");
});
// index.js for components
const pageDir = collect('./src/components');
line = [];
const variables = [];
pageDir.forEach(layout => {
    const key = layout.replace(/\./g, '').replace(/-/g, '$').replace(/\//g, '_');
    line.push(`import ${key} from '${layout}/UI';`);
    variables.push(key);
});

// Extension Dir for Zero Modules
const extensionDir = collect('./src/extension/components');
const extensionVariables = [];
let extensionLine = [];
extensionDir.forEach(page => {
    const key = page.replace(/\./g, '').replace(/-/g, '$').replace(/\//g, '_');
    extensionLine.push(`import ${key} from '${page}/UI';`);
    extensionVariables.push(key);
});

line.push(`import _extension from '../extension/components';`);
line.push('\nexport default {');
variables.forEach(variable => {
    line.push(`\t${variable},`)
});
line.push(`\t..._extension,`);
line.push('}\n');
content = line.join("\n");
// Extension
extensionLine.push('\nexport default {');
extensionVariables.forEach(variable => {
    extensionLine.push(`\t${variable},`)
});
extensionLine.push('}\n');
fs.writeFileSync("src/extension/components/index.js", extensionLine.join("\n"));

fs.writeFile("src/components/index.js", content, () => {
    console.log("[SUC] Successfully to write data to src/components/index.js");
    // 1.读取路由模板，生成静态路由
    const routeConfig = JSON.parse(fs.readFileSync("src/route.json"));
    // 2.计算路由关联关系
    const routes = generateRoute(variables.concat(extensionVariables), routeConfig);
    // 3.根据路由规则计算生成片段
    const lines = [];
    routes.forEach(route => {
        if ("/module/page" === route.uri) {
            // 特殊页面，动态加载用，Origin X专用页
            lines.push(`{connect("/dp/:module/:page",Container["${route.layout}"],Component["${route.page}"])}`);
        } else {
            lines.push(`{connect("${route.uri}",Container["${route.layout}"],Component["${route.page}"])}`);
        }
    });
    // 4.代码块
    let codeBlock = "";
    lines.forEach(line => codeBlock += "\t\t" + line + "\n");
    // 5.读取文本数据
    const tpl = fs.readFileSync("shell/tpl/route/routes.zt", "utf-8");
    const codes = tpl.replace(/#{ROUTE}#/g, codeBlock);
    // 6.写入路径
    fs.writeFile("src/environment/routes.js", codes, () => {
        console.info("「Zero」 Routes have been updated successfully! > src/environment/routes.js");
    })
});
