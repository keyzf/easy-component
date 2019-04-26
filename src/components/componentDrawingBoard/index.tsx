import React from 'react';
import {VirtualDom} from '@/components/virtualDomTree';

import './style.scss';


interface ComponentDrawingBoardProps{
  virtualDomData:VirtualDom[] 
}
export default class ComponentDrawingBoard extends React.PureComponent<ComponentDrawingBoardProps>{
  renderVirtualDom(data?:VirtualDom []|string):any{
    return Array.isArray(data)?data.map((item)=>{
      const {id,type,props={},children} = item;
      if(!props.key){
        props.key=id;
      }
      return React.createElement(type,props,this.renderVirtualDom(children));
    }):data;
  }
  render(){
    const {virtualDomData} = this.props;
    return (<div className="component-drawing-board">
      {
        this.renderVirtualDom(virtualDomData)
      }
    </div>);
  }
}
