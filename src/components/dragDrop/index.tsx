import React, {ComponentType,DragEvent} from 'react';

export const dropTarget=(plainObject:{
  onDrop(e:DragEvent<HTMLElement>):void,
  onDragOver(e:DragEvent<HTMLElement>):void
})=>{
  return function(UnwrappedComponent:ComponentType|string):ComponentType{
    return class extends React.PureComponent{
      render(){
        const newProps = {...this.props,...plainObject}
        return <UnwrappedComponent {...newProps}/>
      }
    }
  }
};