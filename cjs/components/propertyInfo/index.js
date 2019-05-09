"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var antd_1 = require("antd");
var lodash_1 = require("lodash");
var constant_1 = require("../../constant");
var noElement_1 = require("../noElement");
var virtualDomTree_1 = require("../virtualDomTree");
var propertyItem_1 = require("../propertyItem");
var Panel = antd_1.Collapse.Panel;
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
            var finalStyle = lodash_1.assign({}, currentNode.style);
            finalStyle = __assign({}, finalStyle, (_a = {}, _a[name] = value.join('') === constant_1.nameMapToDefaultStyle[name] ? undefined : value.join(''), _a));
            currentNode.style = finalStyle;
            lodash_1.isFunction(onChange) && onChange(virtualDomData.slice());
        };
        return _this;
    }
    PropertyInfo.getDerivedStateFromProps = function (nextProps, prevState) {
        var activeId = nextProps.activeId, virtualDomData = nextProps.virtualDomData;
        currentNode = virtualDomTree_1.findNodeById(virtualDomData, activeId, false).node;
        return null;
    };
    PropertyInfo.prototype.render = function () {
        var _this = this;
        var _a = currentNode.style, style = _a === void 0 ? {} : _a, id = currentNode.id;
        var position = style.position, _b = style.fontSize, fontSize = _b === void 0 ? constant_1.nameMapToDefaultStyle.fontSize : _b, _c = style.fontWeight, fontWeight = _c === void 0 ? constant_1.nameMapToDefaultStyle.fontWeight : _c, _d = style.color, color = _d === void 0 ? constant_1.nameMapToDefaultStyle.color : _d, _e = style.lineHeight, lineHeight = _e === void 0 ? constant_1.nameMapToDefaultStyle.lineHeight : _e, _f = style.textAlign, textAlign = _f === void 0 ? constant_1.nameMapToDefaultStyle.textAlign : _f, _g = style.borderWidth, borderWidth = _g === void 0 ? constant_1.nameMapToDefaultStyle.borderWidth : _g, _h = style.borderStyle, borderStyle = _h === void 0 ? constant_1.nameMapToDefaultStyle.borderStyle : _h, _j = style.borderColor, borderColor = _j === void 0 ? constant_1.nameMapToDefaultStyle.borderColor : _j, _k = style.opacity, opacity = _k === void 0 ? constant_1.nameMapToDefaultStyle.opacity : _k, _l = style.background, background = _l === void 0 ? constant_1.nameMapToDefaultStyle.background : _l;
        return (react_1.default.createElement("div", { className: constant_1.propertyInfoClassName },
            react_1.default.createElement(antd_1.Collapse, { defaultActiveKey: ["general"] },
                react_1.default.createElement(Panel, { header: "\u7EFC\u5408", key: "general" },
                    react_1.default.createElement(antd_1.Row, { gutter: 10 },
                        react_1.default.createElement(antd_1.Col, { span: 12 },
                            react_1.default.createElement(propertyItem_1.default, { type: "select", label: constant_1.nameMapToLabel.position, options: ['static', 'absolute', 'relative'], value: position ? position : constant_1.nameMapToDefaultStyle.position, onChange: this.handlePropertyChange.bind(this, 'position') }))),
                    react_1.default.createElement(antd_1.Row, { gutter: 10 }, ['top', 'right', 'bottom', 'left'].map(function (key) {
                        var value = lodash_1.isUndefined(style[key]) ? constant_1.nameMapToDefaultStyle[key] : style[key];
                        var unit = lodash_1.isNull(value.match(unitReg)) ? 'px' : value.match(unitReg)[0];
                        return react_1.default.createElement(antd_1.Col, { key: key, span: 12 },
                            react_1.default.createElement(propertyItem_1.default, { type: "inputWithUnit", label: constant_1.nameMapToLabel[key], unit: unit, units: unitOptions, value: value.replace(unitReg, ''), onChange: _this.handlePropertyChange.bind(_this, key) }));
                    }))),
                react_1.default.createElement(Panel, { header: "\u5C3A\u5BF8", key: "dimension" },
                    react_1.default.createElement(antd_1.Row, { gutter: 10 }, ['width', 'height'].map(function (key) {
                        var value = lodash_1.isUndefined(style[key]) ? constant_1.nameMapToDefaultStyle[key] : style[key];
                        var unit = lodash_1.isNull(value.match(unitReg)) ? '' : value.match(unitReg)[0];
                        return react_1.default.createElement(antd_1.Col, { key: key, span: 12 },
                            react_1.default.createElement(propertyItem_1.default, { type: "inputWithUnit", name: key, label: constant_1.nameMapToLabel[key], unit: unit, units: unitOptions, value: value.replace(unitReg, ''), onChange: _this.handlePropertyChange.bind(_this, key) }));
                    })),
                    react_1.default.createElement(antd_1.Divider, { className: "divider-title" }, "\u5916\u8FB9\u8DDD"),
                    react_1.default.createElement(antd_1.Row, { gutter: 10 }, ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].map(function (key) {
                        var value = lodash_1.isUndefined(style[key]) ? constant_1.nameMapToDefaultStyle[key] : style[key];
                        var unit = lodash_1.isNull(value.match(unitReg)) ? 'px' : value.match(unitReg)[0];
                        return react_1.default.createElement(antd_1.Col, { key: key, span: 12 },
                            react_1.default.createElement(propertyItem_1.default, { type: "inputWithUnit", label: constant_1.nameMapToLabel[key], unit: unit, units: unitOptions, value: value.replace(unitReg, ''), onChange: _this.handlePropertyChange.bind(_this, key) }));
                    })),
                    react_1.default.createElement(antd_1.Divider, { className: "divider-title" }, "\u5185\u8FB9\u8DDD"),
                    react_1.default.createElement(antd_1.Row, { gutter: 10 }, ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].map(function (key) {
                        var value = lodash_1.isUndefined(style[key]) ? constant_1.nameMapToDefaultStyle[key] : style[key];
                        var unit = lodash_1.isNull(value.match(unitReg)) ? 'px' : value.match(unitReg)[0];
                        return react_1.default.createElement(antd_1.Col, { key: key, span: 12 },
                            react_1.default.createElement(propertyItem_1.default, { type: "inputWithUnit", label: constant_1.nameMapToLabel[key], unit: unit, units: unitOptions, value: value.replace(unitReg, ''), onChange: _this.handlePropertyChange.bind(_this, key) }));
                    }))),
                react_1.default.createElement(Panel, { header: "\u6392\u7248", key: "typography" },
                    react_1.default.createElement(antd_1.Row, { gutter: 10 },
                        react_1.default.createElement(antd_1.Col, { span: 12 },
                            react_1.default.createElement(propertyItem_1.default, { type: "inputWithUnit", label: constant_1.nameMapToLabel.fontSize, name: "fontSize", unit: lodash_1.isNull(fontSize.match(fontSizeUnitReg)) ? '' : fontSize.match(fontSizeUnitReg)[0], units: fontSizeUnitOptions, value: (fontSize).replace(fontSizeUnitReg, ''), onChange: this.handlePropertyChange.bind(this, 'fontSize') })),
                        react_1.default.createElement(antd_1.Col, { span: 12 },
                            react_1.default.createElement(propertyItem_1.default, { type: "select", label: constant_1.nameMapToLabel.fontWeight, name: "fontWeight", options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], value: fontWeight, onChange: this.handlePropertyChange.bind(this, 'fontWeight') }))),
                    react_1.default.createElement(antd_1.Row, { gutter: 10 },
                        react_1.default.createElement(antd_1.Col, { span: 12 },
                            react_1.default.createElement(propertyItem_1.default, { type: "inputWithUnit", label: constant_1.nameMapToLabel.lineHeight, name: "lineHeight", unit: lodash_1.isNull(lineHeight.match(fontSizeUnitReg)) ? '' : lineHeight.match(fontSizeUnitReg)[0], units: fontSizeUnitOptions, value: (lineHeight).replace(fontSizeUnitReg, ''), onChange: this.handlePropertyChange.bind(this, 'lineHeight') }))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(propertyItem_1.default, { type: "colorPicker", label: constant_1.nameMapToLabel.color, value: color, onChange: this.handlePropertyChange.bind(this, 'color') })),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(propertyItem_1.default, { type: "iconRadio", label: constant_1.nameMapToLabel.textAlign, value: textAlign, options: [{
                                    label: 'align-left',
                                    value: 'left'
                                }, {
                                    label: 'align-center',
                                    value: 'center'
                                }, {
                                    label: 'align-right',
                                    value: 'right'
                                }], onChange: this.handlePropertyChange.bind(this, 'textAlign') }))),
                react_1.default.createElement(Panel, { header: "\u88C5\u9970", key: "decoration" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(propertyItem_1.default, { type: "slider", label: constant_1.nameMapToLabel.opacity, value: opacity, onChange: this.handlePropertyChange.bind(this, 'opacity') })),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(propertyItem_1.default, { type: "colorPicker", label: constant_1.nameMapToLabel.background, value: background, onChange: this.handlePropertyChange.bind(this, 'background') })),
                    react_1.default.createElement(antd_1.Divider, { className: "divider-title" }, "\u8FB9\u6846"),
                    react_1.default.createElement(antd_1.Row, { gutter: 10 },
                        react_1.default.createElement(antd_1.Col, { span: 12 },
                            react_1.default.createElement(propertyItem_1.default, { type: "inputWithUnit", label: constant_1.nameMapToLabel.borderWidth, unit: lodash_1.isNull(borderWidth.match(unitReg)) ? 'px' : borderWidth.match(unitReg)[0], units: ['px', 'em'], value: (borderWidth).replace(unitReg, ''), onChange: this.handlePropertyChange.bind(this, 'borderWidth') })),
                        react_1.default.createElement(antd_1.Col, { span: 12 },
                            react_1.default.createElement(propertyItem_1.default, { type: "select", label: constant_1.nameMapToLabel.borderStyle, options: ['solid', 'dotted', 'double', 'dashed'], allowClear: true, value: borderStyle, onChange: this.handlePropertyChange.bind(this, 'borderStyle') }))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(propertyItem_1.default, { type: "colorPicker", label: constant_1.nameMapToLabel.borderColor, value: borderColor, onChange: this.handlePropertyChange.bind(this, 'borderColor') })),
                    react_1.default.createElement(antd_1.Divider, { className: "divider-title" }, "\u8FB9\u6846\u5706\u89D2"),
                    react_1.default.createElement(antd_1.Row, { gutter: 10 }, ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].map(function (key) {
                        var value = lodash_1.isUndefined(style[key]) ? constant_1.nameMapToDefaultStyle[key] : style[key];
                        var unit = lodash_1.isNull(value.match(unitReg)) ? 'px' : value.match(unitReg)[0];
                        return react_1.default.createElement(antd_1.Col, { key: key, span: 12 },
                            react_1.default.createElement(propertyItem_1.default, { type: "inputWithUnit", label: constant_1.nameMapToLabel[key], unit: unit, units: unitOptions.filter(function (unit) { return unit !== 'vh'; }), value: value.replace(unitReg, ''), onChange: _this.handlePropertyChange.bind(_this, key) }));
                    }))))));
    };
    PropertyInfo.propTypes = {
        activeId: prop_types_1.default.string,
        virtualDomData: prop_types_1.default.array,
        onChange: prop_types_1.default.func
    };
    return PropertyInfo;
}(react_1.default.PureComponent));
exports.default = noElement_1.default(PropertyInfo);
