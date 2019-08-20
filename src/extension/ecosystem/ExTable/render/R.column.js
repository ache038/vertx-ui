import Ux from 'ux';
import Ex from 'ex';
import STD_ACTION from '../event';

export default (reference, columns = []) => {
    const source = Ux.clone(columns);
    /*
     * 先处理配置
     */
    let resultColumns = [];
    source.forEach(column => {
        const normalized = Ux.valueLadder(column);
        resultColumns.push(normalized);
    });
    /*
     * 先使用 projection 过滤
     */
    const {$projection = []} = Ex.state(reference);
    if (0 < $projection.length) {
        const filtered = Ux.immutable($projection);
        resultColumns = resultColumns.filter(column => !filtered.contains(column.dataIndex));
    }
    /*
     * 核心处理 Action 节点
     */
    const executor = Ex.executor(reference, STD_ACTION);

    resultColumns = Ux.uiTableColumn(reference, resultColumns, executor);
    return resultColumns;
};