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
import { Icon } from 'antd';
import { toolBarClassName } from '../../constant';
var ToolBar = /** @class */ (function (_super) {
    __extends(ToolBar, _super);
    function ToolBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            visible: true,
            toolList: [{
                    label: React.createElement(Icon, { type: "arrow-up" }),
                    value: 'findParent'
                }, {
                    label: React.createElement(Icon, { type: "drag" }),
                    value: 'drag',
                }, {
                    label: React.createElement(Icon, { type: "copy" }),
                    value: 'copy'
                }, {
                    label: React.createElement(Icon, { type: "delete" }),
                    value: 'delete'
                }],
            left: -1000,
            top: -1000
        };
        _this.handleAction = function (type, e) {
            e.stopPropagation();
            var _a = _this.props, onRemove = _a.onRemove, onCopy = _a.onCopy, onFindParent = _a.onFindParent;
            switch (type) {
                case 'delete':
                    onRemove && onRemove();
                    break;
                case 'copy':
                    onCopy && onCopy();
                    break;
                case 'findParent':
                    onFindParent && onFindParent();
                    break;
                default:
                    return;
            }
        };
        return _this;
    }
    ToolBar.prototype.setLeftAndRight = function (top, left) {
        this.setState({
            top: top,
            left: left
        });
    };
    ToolBar.prototype.hide = function () {
        this.setState({
            visible: false
        });
    };
    ToolBar.prototype.show = function () {
        this.setState({
            visible: true
        });
    };
    ToolBar.prototype.render = function () {
        var _this = this;
        var _a = this.state, visible = _a.visible, toolList = _a.toolList, left = _a.left, top = _a.top;
        var onDragStart = this.props.onDragStart;
        return (React.createElement("div", { className: toolBarClassName, style: {
                left: left,
                top: top,
                opacity: Number(visible)
            } },
            React.createElement("ul", { className: toolBarClassName + "-tool-list" }, toolList.map(function (tool) {
                var toolProps = {
                    key: tool.value,
                    className: toolBarClassName + "-tool-item",
                    onClick: _this.handleAction.bind(_this, tool.value)
                };
                if (tool.value === 'drag') {
                    toolProps.draggable = true;
                    toolProps.onDragStart = onDragStart;
                }
                return React.createElement("li", __assign({}, toolProps), tool.label);
            }))));
    };
    ToolBar.propTypes = {
        onRemove: PropTypes.func,
        onCopy: PropTypes.func,
        onFindParent: PropTypes.func
    };
    return ToolBar;
}(React.PureComponent));
export default ToolBar;
