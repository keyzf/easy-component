import React, {ReactElement, ReactComponentElement} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {prefixClassName,activeClassName,toolBarClassName,headerHeight,VirtualDom} from '@/constant';
import ToolBar from '@/components/toolBar';
import './style.scss';
interface ComponentDrawingBoardProps{
  status:string,
  virtualDomData:VirtualDom[],
  activeId:string,
  onActiveIdChange(activeId:string):void,
  onRemove():void,
  onCopy():void,
  onFindParent():void,
}
export default class ComponentDrawingBoard extends React.PureComponent<ComponentDrawingBoardProps>{
  static propTypes = {
    onActiveIdChange:PropTypes.func,
    onRemove:PropTypes.func,
    onCopy:PropTypes.func,
    onFindParent:PropTypes.func
  }
  ToolBar:any
  renderVirtualDom(data?:VirtualDom []|string):ReactElement[]|string{
    const {activeId,onActiveIdChange} = this.props;
    return Array.isArray(data)?data.map((item)=>{
      const {id,type,props={},children} = item;
      const newProps = {...props};
      newProps['data-highlightab']='1';

      if(!newProps.key){
        newProps.key=id;
      }
      newProps.className = classnames(newProps.className,{
        [activeClassName]:activeId===id
      });
      newProps.onClick = (e:MouseEvent)=>{
        e.stopPropagation();
        onActiveIdChange(id);
      }
      return React.createElement(type,newProps,this.renderVirtualDom(children));
    }):data;
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
    const {virtualDomData,onRemove,onCopy,onFindParent} = this.props;
    return (<div className={`${prefixClassName}-comp-drawing-board`}>
      <div>
        {
          this.renderVirtualDom(virtualDomData)
        }
      </div>
      <ToolBar
        ref={(comp)=>this.ToolBar=comp}
        onRemove={onRemove}
        onCopy={onCopy}
        onFindParent={onFindParent}/>
    </div>);
  }
}
