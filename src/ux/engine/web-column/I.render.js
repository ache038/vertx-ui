import EXECUTOR from './I.fn.cell.executor';
import PURE from './I.fn.cell.pure';
import DATE from './I.fn.cell.date';
import CURRENCY from './I.fn.cell.currency';
import DATUM from './I.fn.cell.datum';
import DOWNLOAD from './I.fn.cell.download';
import HYPERLINK from './I.fn.cell.hyperlink';
import LOGICAL from './I.fn.cell.logical';
import MAPPING from './I.fn.cell.mapping';
import PERCENT from './I.fn.cell.percent';
import TEXT from './I.fn.cell.text';
import USER from './I.fn.cell.user';
import DICT from './I.fn.cell.dict';

export default {
    CURRENCY,
    DATE,
    DATUM,
    DICT,
    DOWNLOAD,
    /*
     * {
            "$render": "EXECUTOR",
            "$option": [
                {
                    "text": "编辑",
                    "executor": "fnEdit"
                },
                "divider",
                {
                    "text": "删除",
                    "executor": "fnDelete",
                    "confirm": "确认删除选择的用户组记录？"
                }
            ]
     * }
     * executor / 使用 ops 来实现注入动作（第三参）
     */
    EXECUTOR,
    HYPERLINK,
    LOGICAL,
    MAPPING,
    PERCENT,
    /*
     * {
     *
     * }
     */
    PURE,
    TEXT,
    USER,
    supports: [
        "TEXT",
        "PURE",
        "LOGICAL",
        "MAPPING"
    ]
};