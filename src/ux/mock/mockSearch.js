import AiStream from '../stream/Ai.Stream';
import Value from '../Ux.Value';
import Ux from "ux";

export default (mockData, query = {}) => {
    // 必须要拷贝
    mockData = Ux.clone(mockData);
    query = Ux.clone(query);
    if (mockData.mock) {
        const mockIr = new AiStream().mock();
        const data = Value.clone(mockData.data.list);
        /* 先过滤 */
        let source = mockIr.bind(data).filter(query).to();
        Ux.dgDebug({
            source,
            criteria: query.criteria,
        }, "[Ex] 模拟数据过滤后");
        /* 再分页 */
        const {pager = {}} = query;
        const {page = 1, size = 10} = pager;
        // 计算开始索引
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size - 1;
        /* 构造新数据 */
        source = source.filter((item, index) => startIndex <= index && index <= endIndex);
        /* 列过滤 */
        const {projection = []} = query;
        if (0 < projection) {
            const $columns = Ux.immutable(projection);
            source.forEach(each => Ux.itObject(each, (field) => {
                // 主键需要保留
                if (!$columns.contains(field) && "key" !== field) {
                    delete each[field];
                }
            }))
        }
        /* 列排序 */
        const {sorter = []} = query;
        if (0 < sorter.length) {
            const sorterLiteral = sorter[0];
            const sorterItem = sorterLiteral.split(',');
            const field = sorterItem[0];
            const isAsc = "ASC" === sorterItem[1];
            source = isAsc ? source.sort(Ux.sorterAscFn(field)) :
                source.sort(Ux.sorterDescFn(field));
        }
        /* 重新构造数据 */
        const $data = {};
        $data.count = mockData.data.count;  // 数量
        $data.list = source;                // 列表
        mockData.data = $data;
    }
    return mockData;
};