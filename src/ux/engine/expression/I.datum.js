import U from "underscore";
// 文件导入
import Ele from '../../element';
import E from "../../error";
import Expr from "./O.ai";
import Datum from '../datum';
import T from './I.tool';
import Pr from '../parser';
import Ut from '../../unity';

const _parseData = (reference, config = {}) => {
    // 源头
    let value = null;
    if ("form" === config.source) {
        value = Ut.formGet(reference, config.field);
    } else {
        // TODO: 其他读取数据方式
    }
    if ("integer" === config.type) {
        value = Ele.valueInt(value);
    } else if ("decimal" === config.type) {
        value = Ele.valueFloat(value);
    }
    return value;
};

const parseFilter = (reference, filter = () => true) => {
    let filters;
    if (U.isFunction(filter)) {
        // 直接返回过滤函数
        filters = filter;
    } else if ("string" === typeof filter) {
        // 通过过滤条件进行过滤
        filters = {};
        const processed = Expr.aiExprFilter(filter);
        if (!processed.type) processed.type = "string";
        if (processed.field) {
            if (!processed.cond) processed.cond = processed.field;
            delete processed.key;
            const value = _parseData(reference, processed);
            if (undefined !== value) {
                filters[processed.cond] = value;
            }
        }
    }
    return filters;
};

const parseExpr = (expr = "") => {
    const item = expr.replace(/ /g, '');
    const kv = item.split(',');
    const attr = {};
    kv.forEach(keyValue => {
        const key = keyValue.split('=')[0];
        attr[key] = keyValue.split('=')[1];
    });
    if (!attr.hasOwnProperty('key')) {
        attr.key = Ut.randomString(12);
    }
    return attr;
};

const parseDatum = (config = {}) => {
    let meta = config.datum;
    if ("string" === typeof config.datum) {
        meta = parseExpr(config.datum);
    }
    return meta;
};

/**
 * 过滤器处理
 * @param reference
 * @param config 配置信息
 * @param filter
 */
const getDatum = (reference, config = {}, filter = () => true) => {
    let options = [];
    // 如果存在datum节点，则从Assist/Tabular数据源中读取
    const $config = parseDatum(config);
    const {source} = $config;
    if (source && "string" === typeof source) {
        let data = [];
        const processed = parseFilter(reference, filter);
        E.fxTerminal(!U.isArray(data), 10043, source);
        if (U.isFunction(processed)) {
            data = Datum.elementFindDatum(reference, source, {});
            data = data.filter(processed);
        } else {
            let filterData = {};
            if (processed && 0 < Object.keys(processed).length) {
                // 包含了Filter信息
                Object.assign(filterData, processed);
            }
            data = Datum.elementFindDatum(reference, source,
                0 < Object.keys(filterData).length ? filterData : {});
        }
        // 将data赋值给options
        options = data;
    } else {
        E.fxTerminal(true, 10044, source);
    }
    /*
     * 解决 value / label 无法解析的问题
     */
    const {value, label} = $config;
    if (value && label) {
        options.forEach(option => {
            option.value = option[value];
            option.label = option[label];
        })
    }
    return options;
};
/*
 * 读取 filter 的函数信息
 */
const getFilter = (reference, config = {}) => {
    let fnCascade = (nil) => true;    // 默认不做任何过滤
    // let fnFilter = (nil) => true;     // 默认不做任何过滤
    if (config['cascade']) {
        /*
         * 联动下拉处理 fnCascade
         * 特殊情况处理，等价于 filter 中的 target = FORM:field
         */
        const cascade = config['cascade'];
        const expr = cascade.target;
        const value = Pr.parseValue(expr, reference);
        fnCascade = item => {
            if (value) {
                /*
                 * Cascade 计算
                 * 有值的时候很好处理，直接针对值进行 cascade 的过滤
                 * */
                return value === item[cascade.source];
            } else {
                /*
                 * 无值的时候分为两种情况
                 * 1）如果 NULL == expr，那么直接使用 ! 进行过滤
                 * 2）否则什么都不筛选，直接返回 false
                 */
                if ("NULL" === expr) {
                    return !item[cascade.source];
                } else {
                    return false;
                }
            }
        }
        // const value = Ut.formGet(reference, field);
        // fnCascade = item => value === item[cascade.source];
    }
    return fnCascade; // 双函数合并 && fnFilter(item)
};

const getSource = (reference, config, filter = {}) => {
    let options = [];
    if (config.items) {
        /*
         * 直接配置 config.items
         * 1）这种情况不存在 filter
         * 2）这种情况同样不存在 cascade
         * 这种方式解析出来的 options 就是下拉的所有值，因为值是常量，所以可以固定处理
         * 在设置 initial 的时候可以直接根据常量处理成 FIX:xxx 的方式得到最终的初始值
         * 所以在这种情况下 filter 和 cascade 没有任何作用，也就是说如果使用 items 则
         * 不能启用 filter / cascade
         */
        options = Expr.aiExprOption(config.items);
    } else if (config.datum) {
        /*
         * 如果存在datum节点，则从assist/tabular数据源中读取
         * 1）这种情况下主要用于在 assist / tabular 数据源中执行计算
         * 2）filter / cascade 是互斥的，不可同时操作，如果启用了 filter 那么就不执行联动过滤，如果启用了 cascade 就已经执行了初始过滤了
         * -- 后续考虑是否合并，目前没有场景
         * 3）解析 config.filter / config.cascade
         */
        options = getDatum(reference, config, getFilter(reference, config));
        const datum = parseDatum(config);
        // 处理config中核心的expr节点
        options.forEach(each => T.applyItem(each, datum, config.expr));
    }
    // 执行value的处理：value = key：如果key存在而value不存在
    T.applyValue(options);
    // 统一抽取expr表达式
    return options;
};
const parseOrigin = (items = [], config = {}) => {
    const {expr, ...rest} = config;
    const options = [];
    items.forEach(item => {
        const option = T.applyItem(item, rest, expr);
        options.push(option);
    });
    return options;
};
export default {
    parseExpr,
    parseDatum: getDatum,
    parseOrigin,
    getSource,
};