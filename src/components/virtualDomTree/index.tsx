import React,{ FunctionComponent, ComponentClass} from 'react';
import {Tree,Tooltip} from 'antd';
import PropTypes from 'prop-types';
import {isString,isFunction} from '@/utils';
const { TreeNode} = Tree;
export interface VirtualDom {
  id:string,
  type:FunctionComponent|ComponentClass|string,
  props?:any,
  children?:VirtualDom [] | string
}
interface VirtualDomTreeProps{
  virtualDomData:VirtualDom[],
  onChange:Function
}
interface NodeInfo {
  props?:{
    eventKey?:string,
    pos?:string,
    children?:NodeInfo[],
    expanded?:boolean
  }
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

//根据子节点id找到父节点
export const findParentNodeByChildId = (virtualDomData:VirtualDom[],matchId:string):VirtualDom=>{
  let parentNode = null;
  let isOk = false;
  const loop = function(data:VirtualDom[],id:string,parent:VirtualDom){
    for(let i = 0;i<data.length;i++){
      const item = data[i];
      const {id,children} = item;
      if(id===matchId){
        parentNode = parent;
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
  return parentNode;
}

export default class VirtualDomTree extends React.PureComponent<VirtualDomTreeProps>{
  static propTypes = {
    virtualDomData: PropTypes.array,
    onChange:PropTypes.func
  }
  renderTree(data:VirtualDom[]):any{
    return data.map((item)=>{
      const {id,type,children} = item;
      const title = isString(type)?type:Object(type).name;
      return <TreeNode title={`${title}-${id}`} key={id}>
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
    } else if (
      (info.node.props.children || []).length > 0 // Has children
      && info.node.props.expanded // Is expanded
      && dropPosition === 1 // On the bottom gap
    ) {
      if(dropNode.children===undefined) dropNode.children = [];
      if(Array.isArray(dropNode.children)){
        dropNode.children.unshift(dragNode);
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

   
    console.log(data);
    isFunction(onChange)&&onChange([].concat(data));

  }
  render() {
    const {virtualDomData} = this.props;
    console.log(virtualDomData);
    return (
      <div className="component-virtual-dom-tree">
        <Tree
          draggable
          blockNode
          onDragEnter={this.handleTreeEnter}
          onDrop={this.handleTreeDrop}>
          {
            this.renderTree(virtualDomData)
          }
        </Tree>
      </div>
    );
  }
}


