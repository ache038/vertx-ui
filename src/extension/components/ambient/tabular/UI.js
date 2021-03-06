import React from 'react';
import Ex from 'ex';

import FormAdd from "./form/UI.Add";
import FormEdit from "./form/UI.Edit";
import FormFilter from "./form/UI.Filter";

import {ExComplexList} from "ei";

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Ex.yiStandard(this);
    }

    componentDidUpdate(props, state, snapshot) {
        Ex.yuRouter(this, {props, state}, () => {
            Ex.yiStandard(this);
        });
    }

    render() {
        return Ex.ylDynamic(this, () => {
            const attrs = Ex.yoPolymorphism(this, {
                form: {
                    FormAdd,    // 添加表单
                    FormEdit,   // 更新表单
                    FormFilter  // 搜索表单
                }
            });
            return (
                <ExComplexList {...attrs}/>
            );
        }, Ex.parserOfColor("PxTabularType").type());
    }
}

export default Component;