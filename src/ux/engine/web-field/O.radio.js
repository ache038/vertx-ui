import {Radio} from "antd";
import React from "react";
import R from '../expression';
import normalizeAttribute from './I.fn.uniform';
/*
 // 处理onChange，解决rest为 {}时引起的参数Bug
    const rest = Aid.fixAttrs(jsx);
    // onChange处理
    R.Ant.onChange(rest, onChange);
    // ReadOnly处理，第二参用于处理disabled的情况，非input使用
    R.Ant.onReadOnly(rest, true, reference);
 */
const aiRadio = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
        ...jsx,
        eventDisabled: true,         // 只读时候需要禁用
    }, onChange);
    // 处理 Radio 相关
    const {config = {}} = jsx;
    const options = R.Ant.toOptions(reference, config);
    // Radio的另外一种模式开启
    const {type = "RADIO"} = config;
    const Component = "RADIO" === type ? Radio : Radio.Button;
    return (
        <Radio.Group {...rest}>
            {options.map(item => (
                <Component key={item.key} style={item.style ? item.style : {}}
                           value={item.hasOwnProperty('value') ? item.value : item.key}>
                    {item.label}
                </Component>
            ))}
        </Radio.Group>
    );
};

const ai2Radio = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiRadio(reference, jsx, fnChange);
};
export default {
    aiRadio,
    ai2Radio,
}