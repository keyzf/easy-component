var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Row, Col, Divider } from 'antd';
import { isFunction, assign, isUndefined, isNull } from 'lodash';
import { nameMapToDefaultStyle, nameMapToLabel, prefixClassName } from '@/constant';
import noElement from '@/components/noElement';
import { findNodeById } from '@/components/virtualDomTree';
import PropertyItem from '@/components/propertyItem';
import './style.scss';
var Panel = Collapse.Panel;
var unitOptions = ['px', '%', 'vh'];
var fontSizeUnitOptions = ['px', 'em', 'rem', '%'];
var unitReg = /px|%|vh/i;
var fontSizeUnitReg = /px|em|rem|%/i;
var currentNode;
var PropertyInfo = /** @class */ (function (_super) {
    __extends(PropertyInfo, _super);
    function PropertyInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {};
        _this.firstLoad = true;
        _this.handlePropertyChange = function (name, value) {
            var _a;
            var _b = _this.props, onChange = _b.onChange, virtualDomData = _b.virtualDomData;
            var finalStyle = assign({}, currentNode.style);
            finalStyle = __assign({}, finalStyle, (_a = {}, _a[name] = value.join('') === nameMapToDefaultStyle[name] ? undefined : value.join(''), _a));
            currentNode.style = finalStyle;
            isFunction(onChange) && onChange(virtualDomData.slice());
        };
        return _this;
    }
    PropertyInfo.getDerivedStateFromProps = function (nextProps, prevState) {
        var activeId = nextProps.activeId, virtualDomData = nextProps.virtualDomData;
        currentNode = findNodeById(virtualDomData, activeId, false).node;
        return null;
    };
    PropertyInfo.prototype.render = function () {
        var _this = this;
        var _a = currentNode.style, style = _a === void 0 ? {} : _a, id = currentNode.id;
        var position = style.position, _b = style.fontSize, fontSize = _b === void 0 ? nameMapToDefaultStyle.fontSize : _b, _c = style.fontWeight, fontWeight = _c === void 0 ? nameMapToDefaultStyle.fontWeight : _c, _d = style.color, color = _d === void 0 ? nameMapToDefaultStyle.color : _d, _e = style.lineHeight, lineHeight = _e === void 0 ? nameMapToDefaultStyle.lineHeight : _e, _f = style.textAlign, textAlign = _f === void 0 ? nameMapToDefaultStyle.textAlign : _f, _g = style.borderWidth, borderWidth = _g === void 0 ? nameMapToDefaultStyle.borderWidth : _g, _h = style.borderStyle, borderStyle = _h === void 0 ? nameMapToDefaultStyle.borderStyle : _h, _j = style.borderColor, borderColor = _j === void 0 ? nameMapToDefaultStyle.borderColor : _j, _k = style.opacity, opacity = _k === void 0 ? nameMapToDefaultStyle.opacity : _k, _l = style.background, background = _l === void 0 ? nameMapToDefaultStyle.background : _l;
        return (React.createElement("div", { className: prefixClassName + "-component-property-info" },
            React.createElement(Collapse, { key: "property-info-" + id, defaultActiveKey: ["general"] },
                React.createElement(Panel, { header: "\u7EFC\u5408", key: "general" },
                    React.createElement(Row, { gutter: 10 },
                        React.createElement(Col, { span: 12 },
                            React.createElement(PropertyItem, { type: "select", label: nameMapToLabel.position, options: ['static', 'absolute', 'relative'], value: position ? position : nameMapToDefaultStyle.position, onChange: this.handlePropertyChange.bind(this, 'position') }))),
                    React.createElement(Row, { gutter: 10 }, ['top', 'right', 'bottom', 'left'].map(function (key) {
                        var value = isUndefined(style[key]) ? nameMapToDefaultStyle[key] : style[key];
                        var unit = isNull(value.match(unitReg)) ? 'px' : value.match(unitReg)[0];
                        return React.createElement(Col, { key: key, span: 12 },
                            React.createElement(PropertyItem, { type: "inputWithUnit", label: nameMapToLabel[key], unit: unit, units: unitOptions, value: value.replace(unitReg, ''), onChange: _this.handlePropertyChange.bind(_this, key) }));
                    }))),
                React.createElement(Panel, { header: "\u5C3A\u5BF8", key: "dimension" },
                    React.createElement(Row, { gutter: 10 }, ['width', 'height'].map(function (key) {
                        var value = isUndefined(style[key]) ? nameMapToDefaultStyle[key] : style[key];
                        var unit = isNull(value.match(unitReg)) ? '' : value.match(unitReg)[0];
                        return React.createElement(Col, { key: key, span: 12 },
                            React.createElement(PropertyItem, { type: "inputWithUnit", name: key, label: nameMapToLabel[key], unit: unit, units: unitOptions, value: value.replace(unitReg, ''), onChange: _this.handlePropertyChange.bind(_this, key) }));
                    })),
                    React.createElement(Divider, { className: "divider-title" }, "\u5916\u8FB9\u8DDD"),
                    React.createElement(Row, { gutter: 10 }, ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].map(function (key) {
                        var value = isUndefined(style[key]) ? nameMapToDefaultStyle[key] : style[key];
                        var unit = isNull(value.match(unitReg)) ? 'px' : value.match(unitReg)[0];
                        return React.createElement(Col, { key: key, span: 12 },
                            React.createElement(PropertyItem, { type: "inputWithUnit", label: nameMapToLabel[key], unit: unit, units: unitOptions, value: value.replace(unitReg, ''), onChange: _this.handlePropertyChange.bind(_this, key) }));
                    })),
                    React.createElement(Divider, { className: "divider-title" }, "\u5185\u8FB9\u8DDD"),
                    React.createElement(Row, { gutter: 10 }, ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].map(function (key) {
                        var value = isUndefined(style[key]) ? nameMapToDefaultStyle[key] : style[key];
                        var unit = isNull(value.match(unitReg)) ? 'px' : value.match(unitReg)[0];
                        return React.createElement(Col, { key: key, span: 12 },
                            React.createElement(PropertyItem, { type: "inputWithUnit", label: nameMapToLabel[key], unit: unit, units: unitOptions, value: value.replace(unitReg, ''), onChange: _this.handlePropertyChange.bind(_this, key) }));
                    }))),
                React.createElement(Panel, { header: "\u6392\u7248", key: "typography" },
                    React.createElement(Row, { gutter: 10 },
                        React.createElement(Col, { span: 12 },
                            React.createElement(PropertyItem, { type: "inputWithUnit", label: nameMapToLabel.fontSize, name: "fontSize", unit: isNull(fontSize.match(fontSizeUnitReg)) ? '' : fontSize.match(fontSizeUnitReg)[0], units: fontSizeUnitOptions, value: (fontSize).replace(fontSizeUnitReg, ''), onChange: this.handlePropertyChange.bind(this, 'fontSize') })),
                        React.createElement(Col, { span: 12 },
                            React.createElement(PropertyItem, { type: "select", label: nameMapToLabel.fontWeight, name: "fontWeight", options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], value: fontWeight, onChange: this.handlePropertyChange.bind(this, 'fontWeight') }))),
                    React.createElement(Row, { gutter: 10 },
                        React.createElement(Col, { span: 12 },
                            React.createElement(PropertyItem, { type: "inputWithUnit", label: nameMapToLabel.lineHeight, name: "lineHeight", unit: isNull(lineHeight.match(fontSizeUnitReg)) ? '' : lineHeight.match(fontSizeUnitReg)[0], units: fontSizeUnitOptions, value: (lineHeight).replace(fontSizeUnitReg, ''), onChange: this.handlePropertyChange.bind(this, 'lineHeight') }))),
                    React.createElement("div", null,
                        React.createElement(PropertyItem, { type: "colorPicker", label: nameMapToLabel.color, value: color, onChange: this.handlePropertyChange.bind(this, 'color') })),
                    React.createElement("div", null,
                        React.createElement(PropertyItem, { type: "iconRadio", label: nameMapToLabel.textAlign, value: textAlign, options: [{
                                    label: 'align-left',
                                    value: 'left'
                                }, {
                                    label: 'align-center',
                                    value: 'center'
                                }, {
                                    label: 'align-right',
                                    value: 'right'
                                }], onChange: this.handlePropertyChange.bind(this, 'textAlign') }))),
                React.createElement(Panel, { header: "\u88C5\u9970", key: "decoration" },
                    React.createElement("div", null,
                        React.createElement(PropertyItem, { type: "slider", label: nameMapToLabel.opacity, value: opacity, onChange: this.handlePropertyChange.bind(this, 'opacity') })),
                    React.createElement("div", null,
                        React.createElement(PropertyItem, { type: "colorPicker", label: nameMapToLabel.background, value: background, onChange: this.handlePropertyChange.bind(this, 'background') })),
                    React.createElement(Divider, { className: "divider-title" }, "\u8FB9\u6846"),
                    React.createElement(Row, { gutter: 10 },
                        React.createElement(Col, { span: 12 },
                            React.createElement(PropertyItem, { type: "inputWithUnit", label: nameMapToLabel.borderWidth, unit: isNull(borderWidth.match(unitReg)) ? 'px' : borderWidth.match(unitReg)[0], units: ['px', 'em'], value: (borderWidth).replace(unitReg, ''), onChange: this.handlePropertyChange.bind(this, 'borderWidth') })),
                        React.createElement(Col, { span: 12 },
                            React.createElement(PropertyItem, { type: "select", label: nameMapToLabel.borderStyle, options: ['solid', 'dotted', 'double', 'dashed'], allowClear: true, value: borderStyle, onChange: this.handlePropertyChange.bind(this, 'borderStyle') }))),
                    React.createElement("div", null,
                        React.createElement(PropertyItem, { type: "colorPicker", label: nameMapToLabel.borderColor, value: borderColor, onChange: this.handlePropertyChange.bind(this, 'borderColor') })),
                    React.createElement(Divider, { className: "divider-title" }, "\u8FB9\u6846\u5706\u89D2"),
                    React.createElement(Row, { gutter: 10 }, ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].map(function (key) {
                        var value = isUndefined(style[key]) ? nameMapToDefaultStyle[key] : style[key];
                        var unit = isNull(value.match(unitReg)) ? 'px' : value.match(unitReg)[0];
                        return React.createElement(Col, { key: key, span: 12 },
                            React.createElement(PropertyItem, { type: "inputWithUnit", label: nameMapToLabel[key], unit: unit, units: unitOptions.filter(function (unit) { return unit !== 'vh'; }), value: value.replace(unitReg, ''), onChange: _this.handlePropertyChange.bind(_this, key) }));
                    }))))));
    };
    PropertyInfo.propTypes = {
        activeId: PropTypes.string,
        virtualDomData: PropTypes.array,
        onChange: PropTypes.func
    };
    return PropertyInfo;
}(React.PureComponent));
export default noElement(PropertyInfo);
