import React,{MouseEvent} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import {toolBarClassName,OperationType} from '@/constant';
import './style.scss';

interface ToolBarState{
  toolList:any[],
  top:number,
  left:number
}

interface ToolBarProps{
  onRemove():void,
  onCopy():void,
  onFindParent():void,
}
export default class ToolBar extends React.PureComponent<ToolBarProps,ToolBarState> {
  readonly state ={
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
    const {toolList,left,top} = this.state;
    return (
      <div className={toolBarClassName} style={{
        left,
        top
      }}>
        <ul className="tool-list">
          {
            toolList.map((tool)=><li key={tool.value} className="tool-item" onClick={this.handleAction.bind(this,tool.value)}>{tool.label}</li>)
          }
        </ul>
      </div>
    )
  }
}
