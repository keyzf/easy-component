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
import { assign, isFunction } from 'lodash';
import { drawingBoardClassName, prefixClassName, activeClassName, toolBarClassName, headerHeight } from '../../constant';
import ToolBar from '../toolBar';
import { moveNode } from '../virtualDomTree';
import { dropTarget } from '../dragDrop';
var DrawingBoard = /** @class */ (function (_super) {
    __extends(DrawingBoard, _super);
    function DrawingBoard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hoverId: ''
        };
        _this.handleDragStart = function (e) {
            console.log('开始拖拽');
            _this.ToolBar.hide();
        };
        _this.handleDrop = function (e) {
            var _a = _this.props, virtualDomData = _a.virtualDomData, activeId = _a.activeId, onChange = _a.onChange;
            var hoverId = _this.state.hoverId;
            _this.ToolBar.show();
            _this.setState({
                hoverId: ''
            });
            var newVirtualDomData = moveNode(virtualDomData, activeId, hoverId);
            isFunction(onChange) && onChange(newVirtualDomData);
            console.log('放置');
        };
        _this.handleDragOver = function (virtualDom, e) {
            e.preventDefault();
            e.stopPropagation();
            var id = virtualDom.id, isDrop = virtualDom.isDrop;
            var hoverId = _this.state.hoverId;
            if (id !== hoverId && isDrop) {
                _this.setState({
                    hoverId: virtualDom.id
                });
            }
            console.log('移动中');
        };
        return _this;
    }
    DrawingBoard.prototype.renderVirtualDom = function (data) {
        var _this = this;
        var _a = this.props, status = _a.status, activeId = _a.activeId, onActiveIdChange = _a.onActiveIdChange;
        var hoverId = this.state.hoverId;
        return Array.isArray(data) ? data.map(function (item) {
            var _a;
            var id = item.id, type = item.type, _b = item.props, props = _b === void 0 ? {} : _b, style = item.style, children = item.children;
            var newProps = __assign({}, props);
            if (!newProps.key) {
                newProps.key = id;
            }
            newProps.style = assign({}, newProps.style, style);
            newProps.className = classnames(newProps.className, (_a = {},
                _a[activeClassName] = activeId === id,
                _a[prefixClassName + "-outline"] = ['preview', 'no-border'].indexOf(status) < 0,
                _a[prefixClassName + "-hover-outline"] = hoverId === id,
                _a));
            newProps.onClick = function (e) {
                e.stopPropagation();
                onActiveIdChange(id);
            };
            var componentType = dropTarget({
                onDrop: _this.handleDrop,
                onDragOver: _this.handleDragOver.bind(_this, item)
            })(type);
            return React.createElement(componentType, newProps, _this.renderVirtualDom(children));
        }) : data;
    };
    DrawingBoard.prototype.componentDidUpdate = function () {
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
    DrawingBoard.prototype.render = function () {
        var _this = this;
        var _a = this.props, virtualDomData = _a.virtualDomData, activeId = _a.activeId, onRemove = _a.onRemove, onCopy = _a.onCopy, onFindParent = _a.onFindParent;
        return (React.createElement("div", { className: drawingBoardClassName },
            React.createElement('div', {
                className: drawingBoardClassName + "-main",
                onDrop: function () {
                    activeId !== '' && _this.ToolBar.show();
                    _this.setState({
                        hoverId: ''
                    });
                },
                onDragOver: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _this.setState({
                        hoverId: ''
                    });
                }
            }, this.renderVirtualDom(virtualDomData)),
            React.createElement(ToolBar, { ref: function (comp) { return _this.ToolBar = comp; }, onRemove: onRemove, onCopy: onCopy, onFindParent: onFindParent, onDragStart: this.handleDragStart })));
    };
    DrawingBoard.propTypes = {
        onActiveIdChange: PropTypes.func,
        onRemove: PropTypes.func,
        onCopy: PropTypes.func,
        onFindParent: PropTypes.func
    };
    return DrawingBoard;
}(React.PureComponent));
export default DrawingBoard;
