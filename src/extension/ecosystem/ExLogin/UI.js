import React from 'react';
import Ux from "ux";
import Ex from 'ex';

const jsx = {
    username: Ux.aiInput,
    password: Ux.aiInput
};

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExLogin")
    .form().raft(1).raft(jsx)
    .bind(Ex.Op)
    .to()
)
class Component extends React.PureComponent {

    render() {
        return Ex.yoRender(this, () =>
                Ux.aiForm(this),
            Ex.parserOfColor("ExEntry").form())
    }
}

export default Component;