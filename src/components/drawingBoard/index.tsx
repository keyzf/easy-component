import React, {ReactElement,DragEvent} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {assign,isFunction,isArray,cloneDeep,isUndefined} from 'lodash';
import {drawingBoardClassName,prefixClassName,activeClassName,toolBarClassName,headerHeight} from '../../constant';
import ToolBar from '../toolBar';
import {ElementGroup,findElementById} from '../elementsPane';
import {VirtualDom,moveNode,findNodeById} from '../virtualDomTree';
import {createVirtualDomIdDeep} from '../../utils';
import {dropTarget} from '../dragDrop';
interface DrawingBoardProps{
  status:string,
  elements:ElementGroup[],
  virtualDomData:VirtualDom[],
  activeId:string,
  onChange(virtualDomData:VirtualDom[]):void,
  onActiveIdChange(activeId:string):void,
  onRemove():void,
  onCopy():void,
  onFindParent():void,
}
interface DrawingBoardState{
  hoverId:string
}
export default class DrawingBoard extends React.PureComponent<DrawingBoardProps,DrawingBoardState>{
  readonly state = {
    hoverId:''
  }
  static propTypes = {
    onActiveIdChange:PropTypes.func,
    onRemove:PropTypes.func,
    onCopy:PropTypes.func,
    onFindParent:PropTypes.func
  }
  ToolBar:any
  renderVirtualDom(data?:VirtualDom []|string):ReactElement[]|string{
    const {status,activeId,onActiveIdChange} = this.props;
    const {hoverId} = this.state;
    const isDevelopment = ['preview','no-border'].indexOf(status)<0;
    return Array.isArray(data)?data.map((item)=>{
      const {id,type,props={},style,_style,children,canDrop} = item;
      const newProps = {...props};

      if(!newProps.key){
        newProps.key=id;
      }
      newProps.style=assign({},isDevelopment?_style:{},newProps.style,style);
      newProps.className = classnames(newProps.className,{
        [activeClassName]:isDevelopment&&activeId===id,
        [`${prefixClassName}-outline`]:isDevelopment,
        [`${prefixClassName}-hover-outline`]:hoverId===id
      });
      newProps.onClick = (e:MouseEvent)=>{
        e.stopPropagation();
        onActiveIdChange(id);
      }
      const componentType=canDrop?dropTarget({
        onDrop:this.handleDrop,
        onDragOver:this.handleDragOver.bind(this,item)
      })(type):type;
      return React.createElement(componentType,newProps,this.renderVirtualDom(children));
    }):data;
  }
  handleDragStart=(e:DragEvent<HTMLLIElement>)=>{
    console.log('开始拖拽');
    e.dataTransfer.setData('operationType','move');
    this.ToolBar.hide();
  }
  handleDrop=(e:DragEvent<HTMLElement>)=>{
    e.preventDefault();
    e.stopPropagation();
    const {virtualDomData,activeId,onChange,elements} = this.props;
    const {hoverId} = this.state;
    const operationType = e.dataTransfer.getData('operationType');
    if(operationType==='move'){
      const newVirtualDomData = moveNode(virtualDomData,activeId,hoverId);
      isFunction(onChange)&&onChange(newVirtualDomData);
      this.ToolBar.show();
      this.setState({
        hoverId:''
      });
      console.log('放置');
    }else if(operationType==='add'){
      const insertNodeId = e.dataTransfer.getData('elementId');
      const {node} = findNodeById(virtualDomData,hoverId,false);
      const insertElement = cloneDeep(findElementById(elements,insertNodeId));
      if(!isArray(node.children)){
        node.children=[];
      }
      createVirtualDomIdDeep(insertElement.virtualDomData);
      (node.children as VirtualDom[]).push(insertElement.virtualDomData);
      this.setState({
        hoverId:''
      });
      isFunction(onChange)&&onChange([...virtualDomData]);
      console.log('放置');
    }
  }
  handleDragOver=(virtualDom:VirtualDom,e:DragEvent<HTMLElement>)=>{
    e.preventDefault();
    e.stopPropagation();
    const {id} = virtualDom;
    const {hoverId} = this.state;
    if(id!==hoverId){
      this.setState({
        hoverId:virtualDom.id
      });
    }
    console.log('移动中');
  }
  componentDidUpdate(){
    const {status} = this.props
    const activeComp:HTMLElement = document.querySelector(`.${activeClassName}`);
    const toolBarComp:HTMLElement = document.querySelector(`.${toolBarClassName}`);
    if(activeComp&&status!=='preview'){
      const activeDomRect = activeComp.getBoundingClientRect();
      const toolBarDomRect = toolBarComp.getBoundingClientRect();
      let toolBarLeft = activeDomRect.left+activeDomRect.width-toolBarDomRect.width;
      if(toolBarLeft<0) toolBarLeft = activeDomRect.left;
      let toolBarTop = activeDomRect.top-toolBarDomRect.height;
      if(toolBarTop<headerHeight) toolBarTop = activeDomRect.top;
      this.ToolBar.setLeftAndRight(toolBarTop-headerHeight,toolBarLeft);
    }else{
      this.ToolBar.setLeftAndRight(-1000,-1000);
    }
  }
  render(){
    const {virtualDomData,activeId,onRemove,onCopy,onFindParent} = this.props;
    const {node} = findNodeById(virtualDomData,activeId,false);
    const canDrag = activeId&&(node.canDrag||isUndefined(node.canDrag));
    return (<div className={drawingBoardClassName}>
      {
        React.createElement('div',{
          className:`${drawingBoardClassName}-main`,
          onDrop:()=>{
            activeId!==''&&this.ToolBar.show();
            this.setState({
              hoverId:''
            });
          },
          onDragOver:(e:DragEvent<HTMLElement>)=>{
            e.preventDefault();
            e.stopPropagation();
            this.setState({
              hoverId:''
            });
          }
        }, this.renderVirtualDom(virtualDomData))
      }
      <ToolBar
        ref={(comp)=>this.ToolBar=comp}
        canDrag={canDrag}
        onRemove={onRemove}
        onCopy={onCopy}
        onFindParent={onFindParent}
        onDragStart={this.handleDragStart}/>
    </div>);
  }
}
