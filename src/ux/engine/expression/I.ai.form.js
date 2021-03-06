import Parser from "./I.parser.up";
import Value from "../../element";
import Abs from "../../abyss";
import {v4} from "uuid";
import Apply from "./O.apply";

import aiAjax from './I.ai.ajax';

const applyField = (item = {}) => {
    // field删除key信息，有field代替
    if (item.hasOwnProperty('key')) {
        delete item.key;
    }
    // span的数值处理
    if (item.span) {
        item.span = Value.valueInt(item.span);
    }
    // 验证规则处理
    if (item.optionConfig && item.optionConfig.rules) {
        item.optionConfig.rules = Apply.applyRules(item.optionConfig.rules);
    }
    // Filter专用字段语法，防止逗号冲突
    if (0 < item.field.indexOf('`')) {
        // Filter专用语法解析
        item.field = item.field.replace('`', ',');
    }
    // 按钮专用处理
    if (item.optionJsx) {
        item.optionJsx = Parser.parseAction(item.optionJsx);
    }
    // 解析ajax属性，ListSelector专用
    const ajaxConfig = item.optionJsx && item.optionJsx.config ? item.optionJsx.config : {};
    if (ajaxConfig && ajaxConfig.hasOwnProperty("ajax")) {
        ajaxConfig.ajax = aiAjax.aiExprAjax(ajaxConfig.ajax);
    }
    return item;
};

const aiExprTitle = (item) => {
    // title专用解析器
    if ("string" === typeof item
        && 0 <= item.indexOf("title")
        && 0 > item.indexOf(",")    // 防止出现title字段
    ) {
        const kv = item.split("=");
        const result = {};
        // Ant-Design Form必须
        result.field = v4();
        // 解析特殊标题
        if ("string" === typeof kv[1]) {
            if (0 < kv[1].indexOf(",")) {
                const title = kv[1].split(",")[0];
                const className = kv[1].split(",")[1];
                result.title = title;
                result.className = className;
            } else {
                result[kv[0]] = kv[1];
            }
        }
        item = result;
    }
    return item;
};
/**
 * 顺序：field, optionItem.label, span, optionJsx.style.width, render, $KV$
 */
const aiExprField = (literal = "") => applyField(Parser.parseItem(literal, "field"));
/**
 * 如果是Object：只有metadata，然后包含各种options
 */
const aiExprFieldEx = (item = {}) => {
    if (item.metadata) {
        const {metadata, ...rest} = item;
        const basic = Parser.parseItem(metadata, "field");
        const options = Value.valueLadder(rest);
        // 属性追加（不覆盖）
        const result = Abs.assign(basic, options, 1);
        applyField(result);
        item = result;
    } else if (item.field) {
        // 没有副作用的解析，让result也支持
        const result = Value.valueLadder(item);
        applyField(result);
        item = result;
    }
    return item;
};

export default {
    aiExprField,
    aiExprFieldEx,
    aiExprTitle
}