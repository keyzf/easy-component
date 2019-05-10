import React,{MouseEvent,DragEvent} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import {toolBarClassName,OperationType} from '../../constant';

interface ToolBarState{
  visible:boolean,
  toolList:any[],
  top:number,
  left:number
}

interface ToolBarProps{
  onRemove():void,
  onCopy():void,
  onFindParent():void,
  onDragStart(e:DragEvent<HTMLLIElement>):void
}
export default class ToolBar extends React.PureComponent<ToolBarProps,ToolBarState> {
  readonly state ={
    visible:true,
    toolList:[{
      label:<Icon type="arrow-up" />,
      value:'findParent'
    },{
      label:<Icon type="drag"/>,
      value:'drag',
    },{
      label:<Icon type="copy" />,
      value:'copy'
    },{
      label:<Icon type="delete" />,
      value:'delete'
    }],
    left:-1000,
    top:-1000
  }
  static propTypes = {
    onRemove:PropTypes.func,
    onCopy:PropTypes.func,
    onFindParent:PropTypes.func
  }
  setLeftAndRight(top:number,left:number){
    this.setState({
      top,
      left
    });
  }
  hide(){
    this.setState({
      visible:false
    });
  }
  show(){
    this.setState({
      visible:true
    });
  }
  handleAction=(type:OperationType,e:MouseEvent<HTMLLIElement>)=>{
    e.stopPropagation();
    const {onRemove,onCopy,onFindParent} = this.props;
    switch(type){
      case 'delete':
        onRemove&&onRemove();
        break;
      case 'copy':
        onCopy&&onCopy();
        break;
      case 'findParent':
        onFindParent&&onFindParent();
        break;
      default:
        return;
    }
  }
  render() {
    const {visible,toolList,left,top} = this.state;
    const {onDragStart} = this.props;
    return (
      <div className={toolBarClassName} style={{
        left,
        top,
        opacity:Number(visible)
      }}>
        <ul className={`${toolBarClassName}-tool-list`}>
          {
            toolList.map((tool)=>{
              const toolProps:any= {
                key:tool.value,
                className:`${toolBarClassName}-tool-item`,
                onClick:this.handleAction.bind(this,tool.value)
              }
              if(tool.value==='drag'){
                toolProps.draggable=true;
                toolProps.onDragStart=onDragStart;
              }
              return <li {...toolProps}>{tool.label}</li>
            })
          }
        </ul>
      </div>
    )
  }
}
