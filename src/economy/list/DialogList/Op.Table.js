import Op from './Op.Init';
import Act from './Op.Action';
import Ux from 'ux'

const _initColumns = (reference, columns = []) => {
    const props = reference.props;
    const op = {
        rxEdit: Act.rxEdit,
        rxDelete: Act.rxDelete
    };
    columns = Ux.uiTableColumn({
        props: {
            // 当前引用对应的props,
            ...props,
            ...op,
            $self: reference
        }
    }, columns);
    return columns;
};

const initTable = (reference) => {
    const table = Op.readTable(reference);
    if (table.columns) {
        table.columns = _initColumns(reference, table.columns);
    }
    // 数据读取
    const {$items, $inited} = reference.props;
    let data = [];
    if ($inited) {
        const dataArray = $items.$($inited.key);
        if (dataArray && dataArray.is()) {
            data = dataArray.to();
        }
    } else {
        // 添加模式，key = undefined
        const dataObject = $items.to();
        if (dataObject) {
            data = dataObject[undefined];
            if (!data) data = [];
        }
    }
    return {table, data}
};

const initDialog = (reference) => {
    const {connectKey} = reference.state;
    let window = {};
    if (connectKey) {
        window = Op.readWindow(reference, connectKey);
        if (window) {
            window.onCancel = Act.rxClose(reference);
        }
        Ux.connectDialog(window);
    }
    return window;
};
export default {
    initTable,
    initDialog
}