"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var antd_1 = require("antd");
var lodash_1 = require("lodash");
var react_color_1 = require("react-color");
var constant_1 = require("../../constant");
var Option = antd_1.Select.Option;
exports.default = react_1.default.memo(function (props) {
    var label = props.label, name = props.name, _a = props.allowClear, allowClear = _a === void 0 ? false : _a, type = props.type, value = props.value, _b = props.unit, unit = _b === void 0 ? '' : _b, units = props.units, options = props.options, onChange = props.onChange;
    var _c = react_1.useState({
        value: value,
        unit: unit
    }), innerState = _c[0], setInnerState = _c[1];
    var _d = react_1.useState(false), colorPickerVisible = _d[0], setColorPickerVisible = _d[1];
    var handleInputChange = function (e) {
        var value = e.target.value;
        var newInnerState = __assign({}, innerState, { value: value });
        setInnerState(newInnerState);
    };
    var handleChange = function (fieldName, selectValue) {
        var _a;
        var newInnerState = __assign({}, innerState, (_a = {}, _a[fieldName] = selectValue, _a));
        setInnerState(newInnerState);
        callback(newInnerState);
    };
    var handleColorChange = function (_a) {
        var hex = _a.hex;
        var newInnerState = __assign({}, innerState, { value: hex });
        setInnerState(newInnerState);
        setColorPickerVisible(false);
        callback(newInnerState);
    };
    var handleRadioChange = function (e) {
        var value = e.target.value;
        var newInnerState = __assign({}, innerState, { value: value });
        setInnerState(newInnerState);
        callback(newInnerState);
    };
    var callback = function (_a) {
        var value = _a.value, unit = _a.unit;
        if (type === 'inputWithUnit' && isNaN(Number(value))) {
            value = constant_1.nameMapToDefaultStyle[name];
            unit = '';
            setInnerState({
                value: value,
                unit: unit
            });
        }
        lodash_1.isFunction(onChange) && onChange([value, unit]);
    };
    var content;
    if (type === 'input') {
        content = react_1.default.createElement(antd_1.Input, { size: "small", placeholder: "\u8BF7\u8F93\u5165", value: innerState.value, onChange: handleInputChange });
    }
    else if (type === 'inputWithUnit') {
        content = react_1.default.createElement(antd_1.Input, { size: "small", placeholder: "\u8BF7\u8F93\u5165", value: innerState.value, onChange: handleInputChange, onBlur: function () { callback(innerState); }, onPressEnter: function () { callback(innerState); }, addonAfter: react_1.default.createElement(antd_1.Select, { size: "small", value: innerState.unit, onChange: handleChange.bind(_this, 'unit') }, units.map(function (item) { return react_1.default.createElement(Option, { key: item, value: item }, item); })) });
    }
    else if (type === 'select') {
        content = react_1.default.createElement(antd_1.Select, { size: "small", style: { minWidth: '100%' }, placeholder: "\u8BF7\u9009\u62E9", allowClear: allowClear, value: innerState.value === '' ? undefined : innerState.value, onChange: handleChange.bind(_this, 'value') }, options.map(function (item) { return react_1.default.createElement(Option, { key: item, value: item }, item); }));
    }
    else if (type === 'colorPicker') {
        content = react_1.default.createElement(antd_1.Input, { size: "small", placeholder: "\u8BF7\u8F93\u5165", value: innerState.value, onChange: handleInputChange, addonAfter: react_1.default.createElement(antd_1.Dropdown, { visible: colorPickerVisible, overlay: react_1.default.createElement(react_color_1.SketchPicker, { color: innerState.value, onChangeComplete: handleColorChange }) },
                react_1.default.createElement("a", { href: "javascript:void(0);", style: { display: 'block', height: 10, width: 10, background: innerState.value }, onClick: function () { setColorPickerVisible(true); } })) });
    }
    else if (type === 'slider') {
        content = react_1.default.createElement(antd_1.Slider, { min: 0, max: 1, step: 0.1, onChange: handleChange.bind(_this, 'value'), value: Number(innerState.value) });
    }
    else if (type === "iconRadio") {
        content = react_1.default.createElement(antd_1.Radio.Group, { value: innerState.value, onChange: handleRadioChange }, options.map(function (option) {
            var label = option.label, value = option.value;
            return react_1.default.createElement(antd_1.Radio.Button, { key: value, value: value },
                react_1.default.createElement(antd_1.Icon, { type: label }));
        }));
    }
    return react_1.default.createElement("div", { className: constant_1.propertyItemClassName },
        react_1.default.createElement("div", { className: "label" }, label),
        react_1.default.createElement("div", { className: "content" }, content));
});
