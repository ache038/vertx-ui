import AiLink from './AI.Link';
import AiLayout from './layout/AI.Layout';
import AiInput from './input/AI.Input';
import AiButton from './action/AI.Action';
import AiColumn from './column/AI.Column';
import AiChart from './AI.Chart';
import AiNormalize from './AI.Normalize';
import Calculator from './layout/AI.Layout.Calculator';
import AiString from './expr/AI.Expr.String';
import AiCriteria from './AI.Criteria';
import AiPure from './AI.Pure';
import RxAnt from './ant/AI.RxAnt';

export default {
    ...AiLink,
    ...AiLayout,
    ...AiInput,
    ...AiButton,
    ...AiColumn,
    ...AiChart,
    ...AiNormalize,
    ...AiString,
    ...AiCriteria,
    ...AiPure,
    RxAnt,      // 新添加Rx Ant部分
    aiLayoutItem: Calculator.calculateItem
};