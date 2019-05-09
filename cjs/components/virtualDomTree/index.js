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
var antd_1 = require("antd");
var prop_types_1 = require("prop-types");
var lodash_1 = require("lodash");
var constant_1 = require("../../constant");
var utils_1 = require("../../utils");
var TreeNode = antd_1.Tree.TreeNode;
//为节点及其子节点从新生成id
exports.recreateNodeId = function (virtualNode) {
    virtualNode.id = utils_1.createID();
    var loop = function (data) {
        data.forEach(function (item) {
            item.id = utils_1.createID();
            lodash_1.isArray(item.children) && loop(item.children);
        });
    };
    lodash_1.isArray(virtualNode.children) && loop(virtualNode.children);
    return virtualNode;
};
//移动节点
exports.moveNode = function (virtualDomData, nodeId, parentId, index) {
    var parentNode = null;
    var node = null;
    var loop = function (data, parent) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var id = item.id, children = item.children;
            if (id === nodeId) {
                node = item;
                parent && parent.id !== parentId && parent.children.splice(i, 1);
            }
            if (id === parentId) {
                parentNode = item;
            }
            if (parentNode && node)
                break;
            lodash_1.isArray(children) && loop(children, item);
        }
    };
    loop(virtualDomData, {
        id: 'root',
        type: 'div',
        children: virtualDomData
    });
    if (parentNode && parentNode.id !== parentId && node) {
        if (lodash_1.isUndefined(index)) {
            parentNode.children = [].concat(parentNode.children, node);
        }
        else {
            parentNode.children.splice(index, 0, node);
        }
    }
    return virtualDomData.slice();
};
//根据id找到节点
exports.findNodeById = function (virtualDomData, matchId, isDelete) {
    var parentNode = null;
    var node = null;
    var isOk = false;
    var index = 0;
    var loop = function (data, id, parent) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var id_1 = item.id, children = item.children;
            if (id_1 === matchId) {
                node = item;
                parentNode = parent;
                index = i;
                parent && lodash_1.isArray(parent.children) && isDelete && parent.children.splice(i, 1);
                isOk = true;
            }
            else {
                lodash_1.isArray(children) && loop(children, matchId, item);
            }
            if (isOk)
                break;
        }
    };
    loop(virtualDomData, matchId, {
        id: 'root',
        type: 'div',
        children: virtualDomData
    });
    return { index: index, node: node, parentNode: parentNode };
};
//找到指定节点的所有祖先节点
exports.findParents = function (virtualDomData, matchId) {
    var parents = [];
    var isOk = false;
    var idMapToParentId = {};
    var loop = function (data, id, parentId) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var id_2 = item.id, children = item.children;
            idMapToParentId[id_2] = parentId;
            if (id_2 === matchId) {
                isOk = true;
            }
            else {
                lodash_1.isArray(children) && loop(children, matchId, id_2);
            }
            if (isOk)
                break;
        }
    };
    loop(virtualDomData, matchId, 'root');
    function findId(id) {
        if (!lodash_1.isUndefined(idMapToParentId[id])) {
            parents.push(idMapToParentId[id]);
            findId(idMapToParentId[id]);
        }
    }
    findId(matchId);
    return parents.filter(function (id) { return id !== 'root'; });
};
var VirtualDomTree = /** @class */ (function (_super) {
    __extends(VirtualDomTree, _super);
    function VirtualDomTree() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            expandedKeys: []
        };
        _this.handleTreeDrop = function (info) {
            var _a = _this.props, onChange = _a.onChange, virtualDomData = _a.virtualDomData;
            var dropKey = info.node.props.eventKey;
            var dragKey = info.dragNode.props.eventKey;
            var dropPos = info.node.props.pos.split('-');
            var dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
            var data = virtualDomData.slice();
            // Find dragObject
            var dragNodeMatchedInfo = exports.findNodeById(data, dragKey, true);
            var drogNodeIndex = dragNodeMatchedInfo.index;
            var dragNode = dragNodeMatchedInfo.node;
            var drogNodeParent = dragNodeMatchedInfo.parentNode;
            // Find dropObject
            var dropNodeMatchedInfo = exports.findNodeById(data, dropKey, false);
            var dropNodeIndex = dropNodeMatchedInfo.index;
            var dropNode = dropNodeMatchedInfo.node;
            var dropNodeParent = dropNodeMatchedInfo.parentNode;
            if (!info.dropToGap) {
                if (dropNode.children === undefined)
                    dropNode.children = [];
                if (lodash_1.isArray(dropNode.children)) {
                    dropNode.children.push(dragNode);
                }
                else {
                    lodash_1.isArray(drogNodeParent.children) && drogNodeParent.children.splice(drogNodeIndex - 1, 0, dragNode);
                }
            }
            else {
                var nodeList = dropNodeParent.children;
                if (dropPosition === -1) {
                    lodash_1.isArray(nodeList) && nodeList.splice(dropNodeIndex, 0, dragNode);
                }
                else {
                    lodash_1.isArray(nodeList) && nodeList.splice(dropNodeIndex + 1, 0, dragNode);
                }
            }
            lodash_1.isFunction(onChange) && onChange([].concat(data));
        };
        _this.handleTreeSelect = function (selectedKeys) {
            var onActiveIdChange = _this.props.onActiveIdChange;
            onActiveIdChange && selectedKeys.length > 0 && onActiveIdChange(selectedKeys[0]);
        };
        _this.handleTreeExpand = function (expandedKeys) {
            _this.setState({
                expandedKeys: expandedKeys
            });
        };
        return _this;
    }
    VirtualDomTree.getDerivedStateFromProps = function (nextProps, prevState) {
        var virtualDomData = nextProps.virtualDomData, activeId = nextProps.activeId;
        var expandedKeys = prevState.expandedKeys;
        if (expandedKeys.length === 0) {
            return {
                expandedKeys: exports.findParents(virtualDomData, activeId)
            };
        }
        return null;
    };
    VirtualDomTree.prototype.renderTree = function (data) {
        var _this = this;
        return data.map(function (item) {
            var id = item.id, type = item.type, children = item.children;
            var title = lodash_1.isString(type) ? type : Object(type).name;
            return react_1.default.createElement(TreeNode, { title: react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "color-primary" }, title),
                    "-",
                    id), key: id }, lodash_1.isArray(children) && _this.renderTree(children));
        });
    };
    VirtualDomTree.prototype.render = function () {
        var _a = this.props, activeId = _a.activeId, virtualDomData = _a.virtualDomData;
        var expandedKeys = this.state.expandedKeys;
        return (react_1.default.createElement("div", { className: constant_1.virtualDomTreeClassName },
            react_1.default.createElement(antd_1.Tree, { draggable: true, blockNode: true, expandedKeys: expandedKeys, selectedKeys: [activeId], onExpand: this.handleTreeExpand, onDrop: this.handleTreeDrop, onSelect: this.handleTreeSelect }, this.renderTree(virtualDomData))));
    };
    VirtualDomTree.propTypes = {
        activeId: prop_types_1.default.string,
        virtualDomData: prop_types_1.default.array,
        onChange: prop_types_1.default.func,
        onActiveIdChange: prop_types_1.default.func
    };
    return VirtualDomTree;
}(react_1.default.PureComponent));
exports.default = VirtualDomTree;
