import React, {ReactElement,DragEvent} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {assign,isFunction} from 'lodash';
import {drawingBoardClassName,prefixClassName,activeClassName,toolBarClassName,headerHeight,VirtualDom} from '../../constant';
import ToolBar from '../toolBar';
import {moveNode} from '../virtualDomTree';
import {dropTarget} from '../dragDrop';
interface DrawingBoardProps{
  status:string,
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
    return Array.isArray(data)?data.map((item)=>{
      const {id,type,props={},style,children} = item;
      const newProps = {...props};

      if(!newProps.key){
        newProps.key=id;
      }
      newProps.style=assign({},newProps.style,style);
      newProps.className = classnames(newProps.className,{
        [activeClassName]:activeId===id,
        [`${prefixClassName}-outline`]:['preview','no-border'].indexOf(status)<0,
        [`${prefixClassName}-hover-outline`]:hoverId===id
      });
      newProps.onClick = (e:MouseEvent)=>{
        e.stopPropagation();
        onActiveIdChange(id);
      }
      const componentType=dropTarget({
        onDrop:this.handleDrop,
        onDragOver:this.handleDragOver.bind(this,item)
      })(type)
      return React.createElement(componentType,newProps,this.renderVirtualDom(children));
    }):data;
  }
  handleDragStart=(e:DragEvent<HTMLLIElement>)=>{
    console.log('开始拖拽');
    this.ToolBar.hide();
  }
  handleDrop=(e:DragEvent<HTMLElement>)=>{
    const {virtualDomData,activeId,onChange} = this.props;
    const {hoverId} = this.state;
    this.ToolBar.show();
    this.setState({
      hoverId:''
    });
    const newVirtualDomData = moveNode(virtualDomData,activeId,hoverId);
    isFunction(onChange)&&onChange(newVirtualDomData);
    console.log('放置');
  }
  handleDragOver=(virtualDom:VirtualDom,e:DragEvent<HTMLElement>)=>{
    e.preventDefault();
    e.stopPropagation();
    const {id,isDrop} = virtualDom;
    const {hoverId} = this.state;
    if(id!==hoverId&&isDrop){
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
        onRemove={onRemove}
        onCopy={onCopy}
        onFindParent={onFindParent}
        onDragStart={this.handleDragStart}/>
    </div>);
  }
}
