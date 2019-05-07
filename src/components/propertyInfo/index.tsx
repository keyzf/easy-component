import React, {KeyboardEventHandler,ReactElement, ChangeEventHandler } from 'react';
import PropTypes from 'prop-types';
import {Collapse,Input,Select,Row,Col} from 'antd';
import {isFunction,isArray,isUndefined} from 'lodash';
import {VirtualDom} from '@/constant';
import noElement from '@/components/noElement';
import {findNodeById} from '@/components/virtualDomTree';

import './style.scss';
const Panel = Collapse.Panel;
const Option = Select.Option;
const unitsOptions = ['无','px','%','vh'];
const unitReg = /px|%|vh/ig;

interface PropertyInfoProps{
  activeId:string,
  virtualDomData:VirtualDom[],
  onChange(virtualDomData:VirtualDom[]):void
}
interface PropertyItemProps{
  type:'input'|'inputWithUnit'|'select',
  name:string,
  value:string,
  unit?:string,
  units?:string[],
  options?:[],
  onChange:any
}
const PropertyItem = (props:PropertyItemProps)=>{
  const {name,type,value,unit,units,options,onChange} = props;
  let content:ReactElement = null;
  if(type==='input'){
    content=<Input defaultValue={value}  onChange={onChange}/>
  }else if(type==='inputWithUnit'){
    let finalValue = value,finalUnit = unit;
    const handleInputChange:ChangeEventHandler<HTMLInputElement>=(e)=>{
      finalValue=e.target.value;
    }
    const handleSelectChange=(selectValue:string)=>{
      finalUnit=selectValue;
      callback();
    }
    const callback = ()=>{
      if(finalValue==='auto'&&finalUnit==='无'||finalValue!=='auto'&&finalUnit!=='无'){
        isFunction(onChange)&&onChange([finalValue,finalUnit]);
      }
    }
    content=<Input size="small" defaultValue={value} onChange={handleInputChange} onPressEnter={callback} addonAfter={
      <Select size="small" defaultValue={unit} onChange={handleSelectChange}>
        {
          units.map((item)=><Option key={item} value={item}>{item}</Option>)
        }
      </Select>
    }/>
  }else if(type==='select'){
    content= <Select defaultValue={value} onChange={onChange}>
    {
      options.map((item)=><Option key={item} value={item}>{item}</Option>)
    }
  </Select>
  }
  return <div className="property-item">
    <div className="label">{name}</div>
    <div className="content">
      {content}
    </div>
  </div>
}
let currentNode:VirtualDom;
class PropertyInfo extends React.PureComponent<PropertyInfoProps>{
  readonly state= {
    currentNode:{
      props:{
        style:{}
      }
    }
  }
  static propTypes = {
    activeId:PropTypes.string,
    virtualDomData:PropTypes.array,
    onChange:PropTypes.func
  }
  static getDerivedStateFromProps(nextProps:PropertyInfoProps):any{
    const {activeId,virtualDomData} = nextProps;
    currentNode=findNodeById(virtualDomData,activeId,false).node;
    return null;
  }
  handlePropertyChange=(name:string,value:string|string[])=>{
    const {onChange,virtualDomData} = this.props;
    if(isUndefined(currentNode.props)){
      currentNode.props={style:{}}
    }else if(isUndefined(currentNode.props.style)){
      currentNode.props.style={};
    }
    let finalStyle = currentNode.props.style;
    if(isArray(value)){
      if(value[0]==='auto'){
        delete finalStyle[name];
      }else{
        finalStyle={
          ...finalStyle,
         [name]:(value as string[]).join('')
        }
      }
      currentNode.props.style=finalStyle;
      isFunction(onChange)&&onChange([...virtualDomData]);
    }else{
      finalStyle[name]=value;
      currentNode.props.style=finalStyle;
      isFunction(onChange)&&onChange([...virtualDomData]);
    }
  }
  render(){
    const {props} = currentNode;
    const {style={}} = props;
    const {width,height} = style;
    return (<div className="component-property-info">
      <Collapse>
        <Panel header="综合" key="general">
          <p>1323</p>
        </Panel>
        <Panel header="排列" key="alignment">
          <p>1323</p>
        </Panel>
        <Panel header="尺寸" key="dimension">
          <Row gutter={10}>
            <Col span={12}>
              <PropertyItem
                type="inputWithUnit"
                name="width"
                unit={width?width.match(unitReg):'无'}
                units={unitsOptions}
                value={width?width.replace(unitReg,''):'auto'}
                onChange={this.handlePropertyChange.bind(this,'width')}/>
            </Col>
            <Col span={12}>
              <PropertyItem
                type="inputWithUnit"
                name="height"
                unit={height?height.match(unitReg):'无'}
                units={unitsOptions}
                value={height?height.replace(unitReg,''):'auto'}
                onChange={this.handlePropertyChange.bind(this,'height')}/>
            </Col>
          </Row>
        </Panel>
        <Panel header="排版" key="typography">
          <p>1323</p>
        </Panel>
        <Panel header="装饰" key="decoration">
        </Panel>
      </Collapse>
    </div>)
  }
}


export default noElement(PropertyInfo);