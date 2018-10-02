import React from 'react'
import Ux from 'ux';
import Op from './Op';
import {PageCard} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo")
    .bind(Op)
    .raft(4)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <PageCard reference={this}>
                {Ux.uiFieldForm(this, {}, 4)}
            </PageCard>
        )
    }
}

export default Component