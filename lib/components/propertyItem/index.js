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
import React, { useState } from 'react';
import { Input, Select, Dropdown, Slider, Radio, Icon } from 'antd';
import { isFunction } from 'lodash';
import { SketchPicker } from 'react-color';
import './style.scss';
import { nameMapToDefaultStyle, prefixClassName } from '@/constant';
var Option = Select.Option;
export default React.memo(function (props) {
    var label = props.label, name = props.name, _a = props.allowClear, allowClear = _a === void 0 ? false : _a, type = props.type, value = props.value, _b = props.unit, unit = _b === void 0 ? '' : _b, units = props.units, options = props.options, onChange = props.onChange;
    var _c = useState({
        value: value,
        unit: unit
    }), innerState = _c[0], setInnerState = _c[1];
    var _d = useState(false), colorPickerVisible = _d[0], setColorPickerVisible = _d[1];
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
            value = nameMapToDefaultStyle[name];
            unit = '';
            setInnerState({
                value: value,
                unit: unit
            });
        }
        isFunction(onChange) && onChange([value, unit]);
    };
    var content;
    if (type === 'input') {
        content = React.createElement(Input, { size: "small", value: innerState.value, onChange: handleInputChange });
    }
    else if (type === 'inputWithUnit') {
        content = React.createElement(Input, { size: "small", value: innerState.value, onChange: handleInputChange, onBlur: function () { callback(innerState); }, onPressEnter: function () { callback(innerState); }, addonAfter: React.createElement(Select, { size: "small", value: innerState.unit, onChange: handleChange.bind(_this, 'unit') }, units.map(function (item) { return React.createElement(Option, { key: item, value: item }, item); })) });
    }
    else if (type === 'select') {
        content = React.createElement(Select, { size: "small", style: { minWidth: '100%' }, placeholder: "\u8BF7\u9009\u62E9", allowClear: allowClear, value: innerState.value, onChange: handleChange.bind(_this, 'value') }, options.map(function (item) { return React.createElement(Option, { key: item, value: item }, item); }));
    }
    else if (type === 'colorPicker') {
        content = React.createElement(Input, { size: "small", value: innerState.value, onChange: handleInputChange, addonAfter: React.createElement(Dropdown, { visible: colorPickerVisible, overlay: React.createElement(SketchPicker, { color: innerState.value, onChangeComplete: handleColorChange }) },
                React.createElement("a", { href: "javascript:void(0);", style: { display: 'block', height: 10, width: 10, background: innerState.value }, onClick: function () { setColorPickerVisible(true); } })) });
    }
    else if (type === 'slider') {
        content = React.createElement(Slider, { min: 0, max: 1, step: 0.1, onChange: handleChange.bind(_this, 'value'), value: Number(innerState.value) });
    }
    else if (type === "iconRadio") {
        content = React.createElement(Radio.Group, { value: innerState.value, onChange: handleRadioChange }, options.map(function (option) {
            var label = option.label, value = option.value;
            return React.createElement(Radio.Button, { key: value, value: value },
                React.createElement(Icon, { type: label }));
        }));
    }
    return React.createElement("div", { className: prefixClassName + "-component-property-item" },
        React.createElement("div", { className: "label" }, label),
        React.createElement("div", { className: "content" }, content));
});
