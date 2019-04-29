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
import { Tree } from 'antd';
import PropTypes from 'prop-types';
import { createID } from '@/utils';
import { isString, isFunction } from 'lodash';
var TreeNode = Tree.TreeNode;
//为节点及其子节点从新生成id
export var recreateNodeId = function (virtualNode) {
    virtualNode.id = createID();
    var loop = function (data) {
        data.forEach(function (item) {
            item.id = createID();
            Array.isArray(item.children) && loop(item.children);
        });
    };
    Array.isArray(virtualNode.children) && loop(virtualNode.children);
    return virtualNode;
};
//根据id找到节点
export var findNodeById = function (virtualDomData, matchId, isDelete) {
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
                parent && Array.isArray(parent.children) && isDelete && parent.children.splice(i, 1);
                isOk = true;
            }
            else {
                Array.isArray(children) && loop(children, matchId, item);
            }
            if (isOk)
                break;
        }
    };
    loop(virtualDomData, matchId, {
        id: 'root',
        type: 'root',
        children: virtualDomData
    });
    return { index: index, node: node, parentNode: parentNode };
};
var VirtualDomTree = /** @class */ (function (_super) {
    __extends(VirtualDomTree, _super);
    function VirtualDomTree() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleTreeEnter = function (info) {
            // console.log(info);
        };
        _this.handleTreeDrop = function (info) {
            var _a = _this.props, onChange = _a.onChange, virtualDomData = _a.virtualDomData;
            var dropKey = info.node.props.eventKey;
            var dragKey = info.dragNode.props.eventKey;
            var dropPos = info.node.props.pos.split('-');
            var dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
            var data = virtualDomData.slice();
            // Find dragObject
            var dragNodeMatchedInfo = findNodeById(data, dragKey, true);
            var drogNodeIndex = dragNodeMatchedInfo.index;
            var dragNode = dragNodeMatchedInfo.node;
            var drogNodeParent = dragNodeMatchedInfo.parentNode;
            var dropNodeMatchedInfo = findNodeById(data, dropKey, false);
            var dropNodeIndex = dropNodeMatchedInfo.index;
            var dropNode = dropNodeMatchedInfo.node;
            var dropNodeParent = dropNodeMatchedInfo.parentNode;
            if (!info.dropToGap) {
                if (dropNode.children === undefined)
                    dropNode.children = [];
                if (Array.isArray(dropNode.children)) {
                    dropNode.children.push(dragNode);
                }
                else {
                    Array.isArray(drogNodeParent.children) && drogNodeParent.children.splice(drogNodeIndex - 1, 0, dragNode);
                }
            }
            else {
                var nodeList = dropNodeParent.children;
                if (dropPosition === -1) {
                    Array.isArray(nodeList) && nodeList.splice(dropNodeIndex, 0, dragNode);
                }
                else {
                    Array.isArray(nodeList) && nodeList.splice(dropNodeIndex + 1, 0, dragNode);
                }
            }
            isFunction(onChange) && onChange([].concat(data));
        };
        _this.handleTreeSelect = function (selectedKeys) {
            var onActiveIdChange = _this.props.onActiveIdChange;
            onActiveIdChange && selectedKeys.length > 0 && onActiveIdChange(selectedKeys[0]);
        };
        return _this;
    }
    VirtualDomTree.prototype.renderTree = function (data) {
        var _this = this;
        return data.map(function (item) {
            var id = item.id, type = item.type, children = item.children;
            var title = isString(type) ? type : Object(type).name;
            return React.createElement(TreeNode, { title: React.createElement("div", null,
                    React.createElement("span", { className: "color-primary" }, title),
                    "-",
                    id), key: id }, Array.isArray(children) && _this.renderTree(children));
        });
    };
    VirtualDomTree.prototype.render = function () {
        var _a = this.props, activeId = _a.activeId, virtualDomData = _a.virtualDomData;
        return (React.createElement("div", { className: "component-virtual-dom-tree" },
            React.createElement(Tree, { draggable: true, blockNode: true, selectedKeys: [activeId], onDragEnter: this.handleTreeEnter, onDrop: this.handleTreeDrop, onSelect: this.handleTreeSelect }, this.renderTree(virtualDomData))));
    };
    VirtualDomTree.propTypes = {
        activeId: PropTypes.string,
        virtualDomData: PropTypes.array,
        onChange: PropTypes.func,
        onActiveIdChange: PropTypes.func
    };
    return VirtualDomTree;
}(React.PureComponent));
export default VirtualDomTree;
