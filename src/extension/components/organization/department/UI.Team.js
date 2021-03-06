import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExComplexList} from "ei";
import FormAdd from './team/UI.Add';
import FormEdit from './team/UI.Edit';
import FormFilter from './team/UI.Filter';
import Op from "../company/Op";


@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Team")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiList(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const config = Ux.fromHoc(this, "grid");
            const form = {
                FormAdd,
                FormEdit,
                FormFilter,
            };
            return (
                <ExComplexList {...Ex.yoAmbient(this)}
                               config={config} $form={form}/>
            )
        }, Ex.parserOfColor("PxTeamList").control());
    }
}

export default Component;