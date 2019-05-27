import Ux from 'ux';
import U from 'underscore';
import Fx from '../Fx';
import Assist from './Op.Assist';
import Mount from './Op.Mount';

const isDynamic = (reference) => {
    const {$options = {}} = reference.props;
    return $options['column.dynamic'];
};

const initColumns = (reference, table = {}) => {
    const {$columns = []} = reference.props;
    const {columns = []} = table;
    const source = Ux.clone(columns).concat($columns);
    /*
     * 不造成多次改动，这里只进行列数量过滤
     * 动态列处理
     */
    table.columns = Ux.uiTableColumn(reference, source, {
        rxEdit: Fx.rxEdit,
        rxDelete: Fx.rxDelete,
    });
    table.columns = Fx.mapColumns(reference, table.columns);
};

const initTable = (reference, options = {}, table = {}) => {
    table = Ux.clone(table);
    // 扩展行外置处理
    const {rxExpandRow} = reference.props;
    if (U.isFunction(rxExpandRow)) {
        table.expandedRowRender = rxExpandRow;
    }
    // 静态处理
    table.columns = Ux.uiTableColumn(reference, table.columns, {
        rxEdit: Fx.rxEdit,
        rxDelete: Fx.rxDelete,
    });

    if (Fx.testBatch(options)) {
        table.rowSelection = Assist.initSelection(reference);
    }
    const onRow = Assist.initRow(reference, table.row);
    if (U.isFunction(onRow)) {
        table.onRow = onRow;
    }
    // onChange事件
    table.onChange = Fx.rxChange(reference);
    return table;
};
const initMocker = (ref, options = {}) => {
    const state = {};
    /*
     * 初始化 $mocker
     */
    const $mocker = Fx.Mock.mockInit(ref, options);
    if ($mocker) {
        state.$mocker = $mocker;
    }
    ref.setState(state);
};
const init = (ref) => {
    const {$options = {}, $table = {}} = ref.props;
    /* 初始化Mocker */
    initMocker(ref, $options);

    // 初始化状态
    const state = {};
    state.$table = initTable(ref, $options, $table);
    // 加载数据专用，第一次加载
    const {$query = {}} = ref.props;
    Fx.rxSearch(ref, $query, state);

    // 挂载反向函数
    Mount.mountPointer(ref);
};
const update = (ref, previous = {}) => {
    if (Fx.testQuery(ref, previous)) {
        /*
         * 1. 分页会触发
         */
        Fx.rxRefresh(ref);
    }
};
const configTable = (reference, options = {}, table = {}) => {
    const {$loading = true} = reference.state;
    const $table = Ux.clone(table);
    $table.loading = $loading;

    if (isDynamic(reference)) {
        initColumns(reference, $table);
    }
    // 分页处理
    $table.pagination = Assist.initPager(reference);
    return $table;
};

export default {
    init,
    update,
    configTable,
};