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
import React from 'react';
import classnames from 'classnames';
import { LocaleProvider, Tabs, Button, Row, Col, Icon, Tooltip, Modal } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { undoRecordList, redoRecordList } from '@/constant';
import { createID } from '@/utils';
import ComponentDrawingBoard from '@/components/componentDrawingBoard';
import PropertyInfo from '@/components/propertyInfo';
import VirtualDomTree, { findNodeById, recreateNodeId } from '@/components/virtualDomTree';
import ElementsPane from '@/components/elementsPane';
import { cloneDeep, isUndefined } from 'lodash';
import '@/scss/main.scss';
var TabPane = Tabs.TabPane;
var confirm = Modal.confirm;
var EasyComponent = /** @class */ (function (_super) {
    __extends(EasyComponent, _super);
    function EasyComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            activeId: '',
            activeTab: 'virtualDomTree',
            actionButtonList: [{
                    title: '边框',
                    key: 'border',
                    icon: 'border',
                    status: 'normal'
                }, {
                    title: '无边框',
                    key: 'no-border',
                    icon: 'border',
                    status: 'no-border',
                    style: {
                        color: 'rgba(170,170,170,0.7)'
                    }
                }, {
                    title: '预览',
                    key: 'preview',
                    icon: 'eye'
                }, {
                    title: '撤销',
                    key: 'undo',
                    icon: 'undo'
                }, {
                    title: '重做',
                    key: 'redo',
                    icon: 'redo'
                }, {
                    title: '清空画布',
                    key: 'delete',
                    icon: 'delete'
                }],
            status: 'normal',
            virtualDomData: [{
                    id: createID(),
                    type: 'div',
                    style: {
                        padding: '10px'
                    },
                    children: [{
                            id: createID(),
                            type: 'div',
                            props: {
                                className: 'table-wrapper',
                            },
                            style: {
                                color: 'red',
                                padding: '10px'
                            },
                            children: [{
                                    id: createID(),
                                    type: Button,
                                    props: {
                                        type: 'primary',
                                        icon: 'search'
                                    },
                                    children: '点击'
                                }, {
                                    id: createID(),
                                    type: Button,
                                    style: {
                                        marginLeft: '10px'
                                    },
                                    children: 'hello'
                                }]
                        }, {
                            id: createID(),
                            type: Row,
                            style: {
                                paddingTop: '10px',
                                paddingRight: '20px',
                                paddingBottom: '10px',
                                paddingLeft: '10px'
                            },
                            children: [{
                                    id: createID(),
                                    type: Col,
                                    props: {
                                        span: 4
                                    },
                                    style: {
                                        padding: '10px'
                                    },
                                    children: [{
                                            id: createID(),
                                            type: Icon,
                                            props: {
                                                type: 'caret-left'
                                            }
                                        }]
                                }]
                        }]
                }]
        };
        _this.handleVirtualDomTreeChange = function (newVirtualDomData) {
            var activeId = _this.state.activeId;
            _this.setState({
                virtualDomData: newVirtualDomData
            });
            undoRecordList.unshift({
                activeId: activeId,
                virtualDomData: newVirtualDomData
            });
        };
        _this.handleActiveIdChange = function (activeId) {
            var virtualDomData = _this.state.virtualDomData;
            _this.setState({
                activeId: activeId
            });
            undoRecordList.unshift({
                activeId: activeId,
                virtualDomData: virtualDomData
            });
        };
        _this.handleComponentDrawingBoardAction = function (type) {
            var _a = _this.state, activeId = _a.activeId, virtualDomData = _a.virtualDomData;
            var data = virtualDomData.slice();
            if (type === 'delete') {
                findNodeById(data, activeId, true);
                _this.setState({
                    activeId: '',
                    virtualDomData: data
                });
                undoRecordList.unshift({
                    activeId: activeId,
                    virtualDomData: data
                });
            }
            else if (type === 'copy') {
                var _b = findNodeById(data, activeId, false), parentNode = _b.parentNode, index = _b.index, node = _b.node;
                var copyNode = recreateNodeId(cloneDeep(node));
                Array.isArray(parentNode.children) && parentNode.children.splice(index + 1, 0, copyNode);
                _this.setState({
                    virtualDomData: data
                });
                undoRecordList.unshift({
                    activeId: activeId,
                    virtualDomData: virtualDomData
                });
            }
            else if (type === 'findParent') {
                var parentNode = findNodeById(data, activeId, false).parentNode;
                var newActiveId = parentNode.id === 'root' ? '' : parentNode.id;
                _this.setState({
                    activeId: parentNode.id === 'root' ? '' : parentNode.id
                });
                undoRecordList.unshift({
                    activeId: newActiveId,
                    virtualDomData: virtualDomData
                });
            }
            else {
                return;
            }
        };
        _this.handleActionButtonClick = function (type) {
            var _a = _this.state, activeId = _a.activeId, virtualDomData = _a.virtualDomData;
            if (type === 'delete') {
                confirm({
                    title: '确认操作',
                    content: '确认是否清空画布？',
                    onOk: function () {
                        var newVirtualDomData = [];
                        undoRecordList.unshift({
                            activeId: activeId,
                            virtualDomData: newVirtualDomData
                        });
                        _this.setState({
                            virtualDomData: newVirtualDomData
                        });
                    }
                });
            }
            else if (type === 'preview') {
                _this.setState({
                    status: 'preview'
                });
            }
            else if (type === 'border') {
                _this.setState({
                    status: 'no-border'
                });
            }
            else if (type === 'no-border') {
                _this.setState({
                    status: 'normal'
                });
            }
            else if (type === 'undo' && undoRecordList.length > 1) {
                var _b = undoRecordList[1], activeId_1 = _b.activeId, virtualDomData_1 = _b.virtualDomData;
                redoRecordList.unshift(undoRecordList[0]);
                undoRecordList.shift();
                _this.setState({
                    activeId: activeId_1,
                    virtualDomData: virtualDomData_1
                });
            }
            else if (type === 'redo' && redoRecordList.length > 0) {
                var _c = redoRecordList[0], activeId_2 = _c.activeId, virtualDomData_2 = _c.virtualDomData;
                undoRecordList.unshift(redoRecordList[0]);
                redoRecordList.shift();
                _this.setState({
                    activeId: activeId_2,
                    virtualDomData: virtualDomData_2
                });
            }
        };
        _this.handleTabChange = function (key) {
            _this.setState({
                activeTab: key
            });
        };
        return _this;
    }
    EasyComponent.prototype.componentDidMount = function () {
        var _a = this.state, activeId = _a.activeId, virtualDomData = _a.virtualDomData;
        undoRecordList.push({
            activeId: activeId,
            virtualDomData: virtualDomData
        });
    };
    EasyComponent.prototype.render = function () {
        var _this = this;
        var _a = this.state, virtualDomData = _a.virtualDomData, activeId = _a.activeId, activeTab = _a.activeTab, actionButtonList = _a.actionButtonList, status = _a.status;
        return (React.createElement(LocaleProvider, { locale: zhCN },
            React.createElement("div", { className: classnames("easy-component", {
                    "preview": status === 'preview'
                }) },
                React.createElement("a", { className: "btn-exit-preview", href: "javascript:void(0);", onClick: function () { return _this.setState({ status: 'normal' }); } },
                    React.createElement(Icon, { type: "eye-invisible" })),
                React.createElement("div", { className: "left" },
                    React.createElement("header", { className: "header" }, actionButtonList.filter(function (actionButton) { return isUndefined(actionButton.status) || actionButton.status === status; }).map(function (actionButton) {
                        var title = actionButton.title, icon = actionButton.icon, key = actionButton.key, style = actionButton.style;
                        var wrappedContent = React.createElement("a", { className: "btn-action", href: "javascript:void(0);", onClick: _this.handleActionButtonClick.bind(_this, key) },
                            React.createElement(Icon, { style: style, type: icon }));
                        return React.createElement(Tooltip, { key: key, title: title }, wrappedContent);
                    })),
                    React.createElement("main", { className: "main" },
                        React.createElement(ComponentDrawingBoard, { status: status, activeId: activeId, virtualDomData: virtualDomData, onRemove: this.handleComponentDrawingBoardAction.bind(this, 'delete'), onCopy: this.handleComponentDrawingBoardAction.bind(this, 'copy'), onFindParent: this.handleComponentDrawingBoardAction.bind(this, 'findParent'), onActiveIdChange: this.handleActiveIdChange }))),
                React.createElement("div", { className: "right" },
                    React.createElement(Tabs, { onChange: this.handleTabChange, activeKey: activeTab },
                        React.createElement(TabPane, { tab: "\u5143\u7D20", key: "elementsPane" }),
                        React.createElement(TabPane, { tab: "\u7ED3\u6784", key: "virtualDomTree" }),
                        React.createElement(TabPane, { tab: "\u5C5E\u6027", key: "propertyInfo" })),
                    activeTab === 'elementsPane' && React.createElement(ElementsPane, { activeId: activeId }),
                    activeTab === 'virtualDomTree' && React.createElement(VirtualDomTree, { activeId: activeId, virtualDomData: virtualDomData, onChange: this.handleVirtualDomTreeChange, onActiveIdChange: this.handleActiveIdChange }),
                    activeTab === 'propertyInfo' && React.createElement(PropertyInfo, { activeId: activeId, virtualDomData: virtualDomData, onChange: this.handleVirtualDomTreeChange })))));
    };
    return EasyComponent;
}(React.PureComponent));
export default EasyComponent;
