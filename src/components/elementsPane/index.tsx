import React,{DragEvent} from 'react';
import PropTypes from 'prop-types';
import {Collapse,Row,Col} from 'antd';
import {dragSource} from '../dragDrop';
import {elementsPaneClassName} from '../../constant';
import {VirtualDom} from '../virtualDomTree';
const Panel = Collapse.Panel;
interface ElementsPaneProps{
  activeId:string,
  elements:ElementGroup[]
}

interface Element{
  id:string,
  name:string,
  image:string,
  virtualDomData:VirtualDom
}
export interface ElementGroup{
  groupName:string,
  elements:Element[]
}

export const findElementById=(elementGroups:ElementGroup[],id:string):Element=>{
  const elements:Element[] = elementGroups.map((group:ElementGroup)=>group.elements).reduce((current,elements)=>current.concat(elements),[]);
  let matchedElement:Element = null;
  let isOk = false;
  const loop = function(elements:Element[]){
    for(let i=0;i<elements.length;i++){
      if(!isOk){
        const element:Element = elements[i];
        if(element.id===id){
          matchedElement = element;
        }
      }else{
        break;
      }
    }
  }
  loop(elements);
  return matchedElement;
}
class ElementsPane extends React.PureComponent<ElementsPaneProps> {
  static propTypes = {
    activeId:PropTypes.string
  }
  handleDragStart=(id:string,e:DragEvent<HTMLElement>)=>{
    e.dataTransfer.setData('operationType','add');
    e.dataTransfer.setData("elementId",id);
  }
  render() {
    const {elements} = this.props;
    return (
      <div className={elementsPaneClassName}>
        <Collapse>
          {
            elements.map((group:ElementGroup)=>{
              const {groupName,elements} = group;
              return <Panel key={groupName} header={groupName}>
                <Row gutter={10}>
                  {
                    elements.map((element:Element)=>{
                      const {id,name,image,virtualDomData} = element;
                      const DragSourceComponent = dragSource({
                        onDragStart:this.handleDragStart.bind(this,id)
                      })('img');
                      const props = {src:image}
                      return (<Col key={name} span={12} style={{textAlign:'center'}}>
                        <div>{React.createElement(DragSourceComponent,props)}</div>
                        <div>{name}</div>
                      </Col>)
                    })
                  }
                </Row>
              </Panel>
            })
          }
        </Collapse>
      </div>
    )
  }
}

export default ElementsPane
