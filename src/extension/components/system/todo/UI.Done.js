import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import Op from './Op';

import FormFilter from './form/UI.Filter';
import renderJsx from './Web';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Done")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const grid = Ux.fromHoc(this, "grid");
            const form = {
                FormFilter
            };
            /*
             * category data
             */
            const category = Ux.onDatum(this, "data.done");
            return renderJsx(this, {grid, form, category});
        }, Ex.parserOfColor("PxDone").control())
    }
}

export default Component;