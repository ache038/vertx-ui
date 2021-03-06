import U from 'underscore';
import Abs from '../abyss';
import Eng from '../engine';
import E from "../error";


/**
 * UNSAFE_componentWillReceiveProps(nextProps,context)
 * @param reference
 * @param nextProps
 */
const xtUnsafe = (reference, nextProps = {}) => {
    if ('value' in nextProps) {
        const value = nextProps.value;
        reference.setState(value);
    }
};

const xtGet = (reference, field, supplier) => {
    let state = (reference.state ? reference.state : {});
    if (U.isFunction(supplier)) {
        state[field] = supplier();
    } else {
        if (supplier) {
            state[field] = supplier;
        }
    }
    return Abs.clone(state);
};
const xtPrevious = (reference) => {
    const {value} = reference.props;
    if (value) {
        // $开头的变量会被过滤掉
        reference.setState({$value: value});
    }
};
/**
 * 将props中的Ant Design对应的Form引用挂载到父引用中的$_pointer中
 * @param ref
 * @param key
 */
const xtPointer = (ref, key) => {
    if (key) {
        // 当前组件属性props中的Ant Design的Form引用挂载到父状态的$_pointer中
        const {reference} = ref.props;
        const {$_pointer = {}} = reference.state;
        // 更新form引用需要
        $_pointer[key] = ref.props.form;
        reference.setState({$_pointer});
    } else {
        // 中间节点继续挂载
        const {$_pointer} = ref.state;
        if ($_pointer) {
            const parent = Eng.onReference(ref, 1);
            parent.setState({
                $_pointer, $_child: ref,
            });
        }
    }
};

const xtUpdateForm = (reference, prevProps, ...fields) => {
    const {form} = reference.props;
    if (form) {
        // 之前的值
        const $previous = prevProps.$inited ? prevProps.$inited : {};
        const {$inited = {}} = reference.props;
        // 初始值的变化
        const previous = Abs.slice.apply(this, [$previous].concat(fields));
        const inited = Abs.slice.apply(this, [$inited].concat(fields));
        if (Abs.isDiff(previous, inited)) {
            const values = Abs.clone(inited);
            form.setFieldsValue(values);
        }
    }
};
const xtToValue = (values = {}) => {
    const filteredValue = {};
    Object.keys(values)
        .filter(key => !key.startsWith("$"))
        .forEach(key => filteredValue[key] = values[key]);
    return filteredValue;
};
const IGNORE_KEYS = Abs.immutable(["reference", "fnOut"]);
const xtToProp = (reference = {}) => {
    E.fxTerminal(!reference, 10049, reference);
    const result = {};
    Object.keys(reference.props).filter(key => !IGNORE_KEYS.contains(key))
        .forEach(item => result[item] = reference.props[item]);
    return result;
};
export default {
    xtPointer,
    // 同一个界面几次挂载
    xtUnsafe,
    xtGet,
    // xtReset,
    // xtResetData,
    xtPrevious,
    xtUpdateForm,

    xtToValue,
    xtToProp
};