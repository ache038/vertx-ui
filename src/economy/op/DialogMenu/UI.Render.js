import React from 'react'
import {Drawer, Icon} from 'antd'
import DynamicDialog from '../../dialog/DynamicDialog/UI';
import Ux from "ux";

const _calcInit = (inited = {}) => {
    const values = {};
    Object.keys(inited).filter(key => key.startsWith("_"))
        .forEach(key => values[key] = inited[key]);
    return values;
};

const getChildren = (reference, item = {}) => {
    const {$components = {}, $inited} = reference.props;
    const componentKey = item.component;
    const Component = $components[componentKey];
    // 初始化数据专用
    const {init = true} = item;
    if (Component) {
        return (
            <Component fnClose={() => {
                const state = Ux.clone(reference.state);
                state.visible[item.key] = false;
                reference.setState(state);
            }} {...Ux.toUniform(reference.props)}
                       $inited={init ? $inited : _calcInit($inited)}/>
        )
    } else return false;
};

const renderItem = (reference, item = {}) => () => {
    const {text, icon} = item.button;
    return (
        <span>
            {icon ? <Icon type={icon}/> : false}&nbsp;&nbsp;
            {text ? text : ""}
        </span>
    );
};

const renderDialog = (reference, item) => () => {
    const {visible = {}} = reference.state;
    const $visible = visible[item.key];
    const jsx = getChildren(reference, item);
    return (
        <DynamicDialog key={item.key}
                       $dialog={item.dialog}
                       $visible={$visible}>
            {jsx}
        </DynamicDialog>
    );
};
const renderDrawer = (reference, item) => () => {
    const {visible = {}} = reference.state;
    const $visible = visible[item.key];
    const jsx = getChildren(reference, item);
    return (
        <Drawer key={item.key}
                {...item.dialog} visible={$visible}>
            {jsx}
        </Drawer>
    );
};
export default {
    renderItem,
    DIALOG: renderDialog,
    DRAWER: renderDrawer,
}