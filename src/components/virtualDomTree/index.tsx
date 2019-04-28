import React,{ FunctionComponent, ComponentClass} from 'react';
import {Tree} from 'antd';
import PropTypes from 'prop-types';
import {VirtualDom} from '@/constant';
import {createID} from '@/utils';
import {isString,isFunction} from 'lodash';
const { TreeNode} = Tree;
interface VirtualDomTreeProps{
  virtualDomData:VirtualDom[],
  onChange:Function,
  onActiveIdChange:Function,
  activeId:string
}

//为节点及其子节点从新生成id
export const recreateNodeId=(virtualNode:VirtualDom)=>{
  virtualNode.id=createID();
  const loop = function(data:VirtualDom[]){
    data.forEach((item)=>{
      item.id=createID();
      Array.isArray(item.children)&&loop(item.children)
    })
  }
  Array.isArray(virtualNode.children)&&loop(virtualNode.children)
  return virtualNode;
} 

//根据id找到节点
export const findNodeById = (virtualDomData:VirtualDom[],matchId:string,isDelete:boolean):{index:number,parentNode:VirtualDom,node:VirtualDom}=>{
  let parentNode = null;
  let node = null;
  let isOk = false;
  let index = 0;
  const loop = function(data:VirtualDom[],id:string,parent:VirtualDom){
    for(let i = 0;i<data.length;i++){
      const item = data[i];
      const {id,children} = item;
      if(id===matchId){
        node = item;
        parentNode = parent;
        index = i;
        parent&&Array.isArray(parent.children)&&isDelete&&parent.children.splice(i,1);
        isOk = true;
      }else{
        Array.isArray(children)&&loop(children,matchId,item)
      }
      if(isOk) break;
    }
  }
  loop(virtualDomData,matchId,{
    id:'root',
    type:'root',
    children:virtualDomData
  });
  return {index,node,parentNode};
};

export default class VirtualDomTree extends React.PureComponent<VirtualDomTreeProps>{
  static propTypes = {
    activeId:PropTypes.string,
    virtualDomData: PropTypes.array,
    onChange:PropTypes.func,
    onActiveIdChange:PropTypes.func
  }
  renderTree(data:VirtualDom[]):any{
    return data.map((item)=>{
      const {id,type,children} = item;
      const title = isString(type)?type:Object(type).name;
    return <TreeNode title={<div><span className="color-primary">{title}</span>-{id}</div>}key={id}>
        {Array.isArray(children)&&this.renderTree(children)}
      </TreeNode>
    });
  }
  handleTreeEnter=(info:object)=>{
    // console.log(info);
  }
  handleTreeDrop=(info:any)=>{
    const {onChange,virtualDomData} = this.props;
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const data = [...virtualDomData];
    // Find dragObject
    const dragNodeMatchedInfo = findNodeById(data,dragKey,true);
    const drogNodeIndex = dragNodeMatchedInfo.index;
    const dragNode = dragNodeMatchedInfo.node;
    const drogNodeParent = dragNodeMatchedInfo.parentNode;



    const dropNodeMatchedInfo = findNodeById(data,dropKey,false);
    const dropNodeIndex = dropNodeMatchedInfo.index;
    const dropNode = dropNodeMatchedInfo.node;
    const dropNodeParent = dropNodeMatchedInfo.parentNode;
  

    if (!info.dropToGap) {
      if(dropNode.children===undefined) dropNode.children = [];
      if(Array.isArray(dropNode.children)){
        dropNode.children.push(dragNode)
      }else{
        Array.isArray(drogNodeParent.children)&&drogNodeParent.children.splice(drogNodeIndex-1,0,dragNode);
      }
    } else {
      const nodeList = dropNodeParent.children;
      if (dropPosition === -1) {
        Array.isArray(nodeList)&&nodeList.splice(dropNodeIndex, 0, dragNode);
      } else {
        Array.isArray(nodeList)&&nodeList.splice(dropNodeIndex+1, 0, dragNode);
      }
    }
    isFunction(onChange)&&onChange([].concat(data));
  }
  handleTreeSelect=(selectedKeys:string[])=>{
    const {onActiveIdChange} = this.props;
    onActiveIdChange&&selectedKeys.length>0&&onActiveIdChange(selectedKeys[0]);
  }
  render() {
    const {activeId,virtualDomData} = this.props;
    return (
      <div className="component-virtual-dom-tree">
        <Tree
          draggable
          blockNode
          selectedKeys={[activeId]}
          onDragEnter={this.handleTreeEnter}
          onDrop={this.handleTreeDrop}
          onSelect={this.handleTreeSelect}>
          {
            this.renderTree(virtualDomData)
          }
        </Tree>
      </div>
    );
  }
}


