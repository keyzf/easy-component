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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var classnames_1 = require("classnames");
var antd_1 = require("antd");
var zh_CN_1 = require("antd/lib/locale-provider/zh_CN");
var constant_1 = require("./constant");
var utils_1 = require("./utils");
var drawingBoard_1 = require("./components/drawingBoard");
var propertyInfo_1 = require("./components/propertyInfo");
var virtualDomTree_1 = require("./components/virtualDomTree");
var elementsPane_1 = require("./components/elementsPane");
var lodash_1 = require("lodash");
var TabPane = antd_1.Tabs.TabPane;
var confirm = antd_1.Modal.confirm;
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
                    id: utils_1.createID(),
                    type: 'div',
                    isDrop: true,
                    style: {
                        padding: '10px'
                    },
                    children: [{
                            id: utils_1.createID(),
                            type: 'div',
                            isDrop: true,
                            props: {
                                className: 'table-wrapper',
                            },
                            style: {
                                color: 'red',
                                padding: '10px'
                            },
                            children: [{
                                    id: utils_1.createID(),
                                    type: antd_1.Button,
                                    props: {
                                        type: 'primary',
                                        icon: 'search'
                                    },
                                    children: '点击'
                                }, {
                                    id: utils_1.createID(),
                                    type: antd_1.Button,
                                    style: {
                                        marginLeft: '10px'
                                    },
                                    children: 'hello'
                                }]
                        }, {
                            id: utils_1.createID(),
                            type: antd_1.Row,
                            style: {
                                paddingTop: '10px',
                                paddingRight: '20px',
                                paddingBottom: '10px',
                                paddingLeft: '10px'
                            },
                            children: [{
                                    id: utils_1.createID(),
                                    type: antd_1.Col,
                                    isDrop: true,
                                    props: {
                                        span: 4
                                    },
                                    style: {
                                        padding: '10px'
                                    },
                                    children: [{
                                            id: utils_1.createID(),
                                            type: antd_1.Icon,
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
            constant_1.undoRecordList.unshift({
                activeId: activeId,
                virtualDomData: newVirtualDomData
            });
        };
        _this.handleActiveIdChange = function (activeId) {
            var virtualDomData = _this.state.virtualDomData;
            _this.setState({
                activeId: activeId
            });
            constant_1.undoRecordList.unshift({
                activeId: activeId,
                virtualDomData: virtualDomData
            });
        };
        _this.handleComponentDrawingBoardAction = function (type) {
            var _a = _this.state, activeId = _a.activeId, virtualDomData = _a.virtualDomData;
            var data = virtualDomData.slice();
            if (type === 'delete') {
                virtualDomTree_1.findNodeById(data, activeId, true);
                _this.setState({
                    activeId: '',
                    virtualDomData: data
                });
                constant_1.undoRecordList.unshift({
                    activeId: activeId,
                    virtualDomData: data
                });
            }
            else if (type === 'copy') {
                var _b = virtualDomTree_1.findNodeById(data, activeId, false), parentNode = _b.parentNode, index = _b.index, node = _b.node;
                var copyNode = virtualDomTree_1.recreateNodeId(lodash_1.cloneDeep(node));
                Array.isArray(parentNode.children) && parentNode.children.splice(index + 1, 0, copyNode);
                _this.setState({
                    virtualDomData: data
                });
                constant_1.undoRecordList.unshift({
                    activeId: activeId,
                    virtualDomData: virtualDomData
                });
            }
            else if (type === 'findParent') {
                var parentNode = virtualDomTree_1.findNodeById(data, activeId, false).parentNode;
                var newActiveId = parentNode.id === 'root' ? '' : parentNode.id;
                _this.setState({
                    activeId: parentNode.id === 'root' ? '' : parentNode.id
                });
                constant_1.undoRecordList.unshift({
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
                        constant_1.undoRecordList.unshift({
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
            else if (type === 'undo' && constant_1.undoRecordList.length > 1) {
                var _b = constant_1.undoRecordList[1], activeId_1 = _b.activeId, virtualDomData_1 = _b.virtualDomData;
                constant_1.redoRecordList.unshift(constant_1.undoRecordList[0]);
                constant_1.undoRecordList.shift();
                _this.setState({
                    activeId: activeId_1,
                    virtualDomData: virtualDomData_1
                });
            }
            else if (type === 'redo' && constant_1.redoRecordList.length > 0) {
                var _c = constant_1.redoRecordList[0], activeId_2 = _c.activeId, virtualDomData_2 = _c.virtualDomData;
                constant_1.undoRecordList.unshift(constant_1.redoRecordList[0]);
                constant_1.redoRecordList.shift();
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
        constant_1.undoRecordList.push({
            activeId: activeId,
            virtualDomData: virtualDomData
        });
    };
    EasyComponent.prototype.render = function () {
        var _this = this;
        var _a = this.state, virtualDomData = _a.virtualDomData, activeId = _a.activeId, activeTab = _a.activeTab, actionButtonList = _a.actionButtonList, status = _a.status;
        return (react_1.default.createElement(antd_1.LocaleProvider, { locale: zh_CN_1.default },
            react_1.default.createElement("div", { className: classnames_1.default(constant_1.mainClassName, {
                    "preview": status === 'preview'
                }) },
                react_1.default.createElement("a", { className: constant_1.prefixClassName + "-btn-exit-preview", href: "javascript:void(0);", onClick: function () { return _this.setState({ status: 'normal' }); } },
                    react_1.default.createElement(antd_1.Icon, { type: "eye-invisible" })),
                react_1.default.createElement("div", { className: constant_1.mainClassName + "-left" },
                    react_1.default.createElement("header", { className: constant_1.mainClassName + "-header" }, actionButtonList.filter(function (actionButton) { return lodash_1.isUndefined(actionButton.status) || actionButton.status === status; }).map(function (actionButton) {
                        var title = actionButton.title, icon = actionButton.icon, key = actionButton.key, style = actionButton.style;
                        var wrappedContent = react_1.default.createElement("a", { className: "btn-action", href: "javascript:void(0);", onClick: _this.handleActionButtonClick.bind(_this, key) },
                            react_1.default.createElement(antd_1.Icon, { style: style, type: icon }));
                        return react_1.default.createElement(antd_1.Tooltip, { key: key, title: title }, wrappedContent);
                    })),
                    react_1.default.createElement("main", { className: constant_1.mainClassName + "-main" },
                        react_1.default.createElement(drawingBoard_1.default, { status: status, activeId: activeId, virtualDomData: virtualDomData, onChange: this.handleVirtualDomTreeChange, onRemove: this.handleComponentDrawingBoardAction.bind(this, 'delete'), onCopy: this.handleComponentDrawingBoardAction.bind(this, 'copy'), onFindParent: this.handleComponentDrawingBoardAction.bind(this, 'findParent'), onActiveIdChange: this.handleActiveIdChange }))),
                react_1.default.createElement("div", { className: constant_1.mainClassName + "-right" },
                    react_1.default.createElement(antd_1.Tabs, { onChange: this.handleTabChange, activeKey: activeTab },
                        react_1.default.createElement(TabPane, { tab: "\u5143\u7D20", key: "elementsPane" }),
                        react_1.default.createElement(TabPane, { tab: "\u7ED3\u6784", key: "virtualDomTree" }),
                        react_1.default.createElement(TabPane, { tab: "\u5C5E\u6027", key: "propertyInfo" })),
                    activeTab === 'elementsPane' && react_1.default.createElement(elementsPane_1.default, { key: "ElementsPane-" + activeId, activeId: activeId }),
                    activeTab === 'virtualDomTree' && react_1.default.createElement(virtualDomTree_1.default, { key: "VirtualDomTree-" + activeId, activeId: activeId, virtualDomData: virtualDomData, onChange: this.handleVirtualDomTreeChange, onActiveIdChange: this.handleActiveIdChange }),
                    activeTab === 'propertyInfo' && react_1.default.createElement(propertyInfo_1.default, { key: "PropertyInfo-" + activeId, activeId: activeId, virtualDomData: virtualDomData, onChange: this.handleVirtualDomTreeChange })))));
    };
    return EasyComponent;
}(react_1.default.PureComponent));
exports.default = EasyComponent;
