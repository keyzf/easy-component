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
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { prefixClassName, activeClassName, toolBarClassName, headerHeight } from '@/constant';
import ToolBar from '@/components/toolBar';
import './style.scss';
var ComponentDrawingBoard = /** @class */ (function (_super) {
    __extends(ComponentDrawingBoard, _super);
    function ComponentDrawingBoard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComponentDrawingBoard.prototype.renderVirtualDom = function (data) {
        var _this = this;
        var _a = this.props, activeId = _a.activeId, onActiveIdChange = _a.onActiveIdChange;
        return Array.isArray(data) ? data.map(function (item) {
            var _a;
            var id = item.id, type = item.type, _b = item.props, props = _b === void 0 ? {} : _b, children = item.children;
            var newProps = __assign({}, props);
            newProps['data-highlightab'] = '1';
            if (!newProps.key) {
                newProps.key = id;
            }
            newProps.className = classnames(newProps.className, (_a = {},
                _a[activeClassName] = activeId === id,
                _a));
            newProps.onClick = function (e) {
                e.stopPropagation();
                onActiveIdChange(id);
            };
            return React.createElement(type, newProps, _this.renderVirtualDom(children));
        }) : data;
    };
    ComponentDrawingBoard.prototype.componentDidUpdate = function () {
        var status = this.props.status;
        var activeComp = document.querySelector("." + activeClassName);
        var toolBarComp = document.querySelector("." + toolBarClassName);
        if (activeComp && status !== 'preview') {
            var activeDomRect = activeComp.getBoundingClientRect();
            var toolBarDomRect = toolBarComp.getBoundingClientRect();
            var toolBarLeft = activeDomRect.left + activeDomRect.width - toolBarDomRect.width;
            if (toolBarLeft < 0)
                toolBarLeft = activeDomRect.left;
            var toolBarTop = activeDomRect.top - toolBarDomRect.height;
            if (toolBarTop < headerHeight)
                toolBarTop = activeDomRect.top;
            this.ToolBar.setLeftAndRight(toolBarTop - headerHeight, toolBarLeft);
        }
        else {
            this.ToolBar.setLeftAndRight(-1000, -1000);
        }
    };
    ComponentDrawingBoard.prototype.render = function () {
        var _this = this;
        var _a = this.props, virtualDomData = _a.virtualDomData, onRemove = _a.onRemove, onCopy = _a.onCopy, onFindParent = _a.onFindParent;
        return (React.createElement("div", { className: prefixClassName + "-comp-drawing-board" },
            React.createElement("div", null, this.renderVirtualDom(virtualDomData)),
            React.createElement(ToolBar, { ref: function (comp) { return _this.ToolBar = comp; }, onRemove: onRemove, onCopy: onCopy, onFindParent: onFindParent })));
    };
    ComponentDrawingBoard.propTypes = {
        onActiveIdChange: PropTypes.func,
        onRemove: PropTypes.func,
        onCopy: PropTypes.func,
        onFindParent: PropTypes.func
    };
    return ComponentDrawingBoard;
}(React.PureComponent));
export default ComponentDrawingBoard;
