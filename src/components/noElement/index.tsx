import React,{ComponentType, ComponentClass, FunctionComponent} from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

interface BasicProps{
  activeId:string
}
function noElement<NoElementProps extends BasicProps>(UnwrappedComponent:ComponentType<NoElementProps>){
  const NoElement = hoistNonReactStatics(class extends React.PureComponent<NoElementProps>{
    render(){
      const {activeId} = this.props;
      return activeId===''?<div
      style={{
        textAlign:"center"
      }}>
        请先选择一个元素
      </div>:<UnwrappedComponent {...this.props}/>
    }
  },UnwrappedComponent);
  return NoElement;
}

export default noElement;
