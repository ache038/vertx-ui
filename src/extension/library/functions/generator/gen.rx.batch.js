import G from '../global';
import Fn from './gen.runtime.status';
import Ux from 'ux';
/*
 * 这里的 reference 是当前 ExComplexList
 */
const rxBatchDelete = (reference) => (event) => {
    Ux.prevent(event);
    const {$selected = [], options = {}} = reference.state;
    if (0 < $selected.length) {
        /* 当前组件中的状态设置成 $loading = true */
        Fn.rsLoading(reference)();
        const uri = options[G.Opt.AJAX_BATCH_DELETE_URI];
        /*
         * 参数提取
         */
        const message = options[G.Opt.MESSAGE_BATCH_DELETE];
        const {$selected = []} = reference.state;
        return Ux.ajaxDelete(uri, $selected)
            .then(Ux.ajax2True(() => Fn.rsLoading(reference, false)({
                    $dirty: true
                }), message)
            ).then(() => {
                    //删除后从选中项中清除
                    $selected.splice(0, $selected.length);
                    //修改状态
                    reference.setState({$selected: []});
                }
            );
    } else {
        throw new Error("[ Ex ] 选择项丢失！rxBatchDelete.");
    }
};
const rxBatchEdit = (reference) => (params = []) => {
    const {$selected = [], options = {}} = reference.state;
    if (0 < $selected.length) {
        /* 当前组件中状态设置成提交 */
        const uri = options[G.Opt.AJAX_BATCH_UPDATE_URI];
        return Ux.ajaxPut(uri, params)
            .then(Ux.ajax2True(() => Fn.rsLoading(reference, false)({
                    $dirty: true,
                    $submitting: false,
                }))
            );
    } else {
        throw new Error("[ Ex ] 选择项丢失！rxBatchEdit.");
    }
};
export default {
    rxBatchDelete,
    rxBatchEdit,
}