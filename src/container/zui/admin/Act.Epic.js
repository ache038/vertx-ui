import Ux from 'ux';
import Types from './Act.Types'
import {Ajax} from 'app'

export default {
    fnInited: Ux.rxFlow(Types.fnInited)
        .bind(Ajax)
        .mount(
            'app',
            'app.menus'
        )
        .to()
}