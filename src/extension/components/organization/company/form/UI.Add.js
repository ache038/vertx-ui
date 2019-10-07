import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Add")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$record} = this.props;
        const $inited = {};
        if ($record) {
            /*
             * 父子结构
             */
            $inited.companyId = $record.key;
        }
        const form = Ex.yoForm(this, null, $inited);
        
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Op.actions}/>
        );
    }
}

export default Component;