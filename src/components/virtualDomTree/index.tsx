import React from 'react';
import {Tree} from 'antd';
import PropTypes from 'prop-types';
import {isString,isFunction,isUndefined,isArray} from 'lodash';
import {VirtualDom,virtualDomTreeClassName} from '../../constant';
import {createID} from '../../utils';
import { AntTreeNodeDropEvent } from 'antd/lib/tree/Tree';
const { TreeNode} = Tree;

//为节点及其子节点从新生成id
export const recreateNodeId=(virtualNode:VirtualDom)=>{
  virtualNode.id=createID();
  const loop = function(data:VirtualDom[]){
    data.forEach((item)=>{
      item.id=createID();
      isArray(item.children)&&loop(item.children)
    })
  }
  isArray(virtualNode.children)&&loop(virtualNode.children)
  return virtualNode;
}
//移动节点
export const moveNode=(virtualDomData:VirtualDom[],nodeId:string,parentId:string,index?:number)=>{
  let parentNode:VirtualDom = null;
  let oldParentNode:VirtualDom = null;
  let node:VirtualDom = null;
  const loop = function(data:VirtualDom[],parent:VirtualDom){
    for(let i = 0;i<data.length;i++){
      const item = data[i];
      const {id,children} = item;
      if(id===nodeId){
        node = item;
        parent&&parent.id!==parentId&&(parent.children as VirtualDom[]).splice(i,1);
        oldParentNode=parent;
      }
      if(id===parentId){
        parentNode=item;
      }
      if(parentNode&&node) break;
      isArray(children)&&loop(children,item)
    }
  }
  loop(virtualDomData,{
    id:'root',
    type:'div',
    children:virtualDomData
  });
  if(parentNode&&oldParentNode.id!==parentId&&node){
    console.log(isUndefined(index));
    if(isUndefined(index)){
      if(isUndefined(parentNode.children)) parentNode.children=[];
      parentNode.children=[].concat(parentNode.children,node)
    }else{
      (parentNode.children as VirtualDom[]).splice(index,0,node)
    }
  }
  return [...virtualDomData]
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
        parent&&isArray(parent.children)&&isDelete&&parent.children.splice(i,1);
        isOk = true;
      }else{
        isArray(children)&&loop(children,matchId,item)
      }
      if(isOk) break;
    }
  }
  loop(virtualDomData,matchId,{
    id:'root',
    type:'div',
    children:virtualDomData
  });
  return {index,node,parentNode};
};
//找到指定节点的所有祖先节点
export const findParents = (virtualDomData:VirtualDom[],matchId:string)=>{
  const parents:string[] = [];
  let isOk = false;
  const idMapToParentId:{
    [propName:string]:string
  } = {};
  const loop = function(data:VirtualDom[],id:string,parentId:string){
    for(let i = 0;i<data.length;i++){
      const item = data[i];
      const {id,children} = item;
      idMapToParentId[id]=parentId;
      if(id===matchId){
        isOk = true;
      }else{
        isArray(children)&&loop(children,matchId,id);
      }
      if(isOk) break;
    }
  }
  loop(virtualDomData,matchId,'root');

  function findId(id:string){
    if(!isUndefined(idMapToParentId[id])){
      parents.push(idMapToParentId[id]);
      findId(idMapToParentId[id]);
    }
  }
  findId(matchId);
  return parents.filter((id)=>id!=='root');
}
interface VirtualDomTreeProps{
  virtualDomData:VirtualDom[],
  onChange(virtualDomData:VirtualDom[]):void
  onActiveIdChange(activeId:string):void,
  activeId:string
}
interface VirtualDomTreeState{
  expandedKeys:string[]
}
class VirtualDomTree extends React.PureComponent<VirtualDomTreeProps>{
  readonly state:VirtualDomTreeState = {
    expandedKeys:[]
  }
  static propTypes = {
    activeId:PropTypes.string,
    virtualDomData: PropTypes.array,
    onChange:PropTypes.func,
    onActiveIdChange:PropTypes.func
  }
  static getDerivedStateFromProps(nextProps:VirtualDomTreeProps, prevState:VirtualDomTreeState) {
    const {virtualDomData,activeId} = nextProps;
    const {expandedKeys} = prevState
    if(expandedKeys.length===0){
      return {
        expandedKeys:findParents(virtualDomData,activeId)
      };
    }
    return null;
  }
  renderTree(data:VirtualDom[]):any{
    return data.map((item)=>{
      const {id,type,children} = item;
      const title = isString(type)?type:Object(type).name;
    return <TreeNode title={<div><span className="color-primary">{title}</span>({id})</div>}key={id}>
        {isArray(children)&&this.renderTree(children)}
      </TreeNode>
    });
  }
  handleTreeDrop=(info:AntTreeNodeDropEvent)=>{
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

    // Find dropObject
    const dropNodeMatchedInfo = findNodeById(data,dropKey,false);
    const dropNodeIndex = dropNodeMatchedInfo.index;
    const dropNode = dropNodeMatchedInfo.node;
    const dropNodeParent = dropNodeMatchedInfo.parentNode;

    if (!info.dropToGap) {
      if(dropNode.children===undefined) dropNode.children = [];
      if(isArray(dropNode.children)){
        dropNode.children.push(dragNode)
      }else{
        isArray(drogNodeParent.children)&&drogNodeParent.children.splice(drogNodeIndex-1,0,dragNode);
      }
    } else {
      const nodeList = dropNodeParent.children;
      if (dropPosition === -1) {
        isArray(nodeList)&&nodeList.splice(dropNodeIndex, 0, dragNode);
      } else {
        isArray(nodeList)&&nodeList.splice(dropNodeIndex+1, 0, dragNode);
      }
    }
    isFunction(onChange)&&onChange([].concat(data));
  }
  handleTreeSelect=(selectedKeys:string[])=>{
    const {onActiveIdChange} = this.props;
    onActiveIdChange&&selectedKeys.length>0&&onActiveIdChange(selectedKeys[0]);
  }
  handleTreeExpand=(expandedKeys:string[])=>{
    this.setState({
      expandedKeys
    });
  }
  render() {
    const {activeId,virtualDomData} = this.props;
    const {expandedKeys} = this.state;
    return (
      <div className={virtualDomTreeClassName}>
        <Tree
          draggable
          blockNode
          expandedKeys={expandedKeys}
          selectedKeys={[activeId]}
          onExpand={this.handleTreeExpand}
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

export default VirtualDomTree;


