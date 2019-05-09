import React, {useState,ReactElement, ChangeEventHandler} from 'react';
import {Input,Select,Dropdown,Slider,Radio,Icon} from 'antd';
import {isFunction} from 'lodash';
import { SketchPicker } from 'react-color';
import './style.scss';
import { nameMapToDefaultStyle,prefixClassName } from '@/constant';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
const Option = Select.Option;
interface PropertyItemProps{
  type:'input'|'inputWithUnit'|'select'|'colorPicker'|'slider'|'iconRadio',
  label:string,
  name?:string,
  value:string,
  unit?:string,
  units?:string[],
  options?:string[]|{label:string,value:string}[],
  allowClear?:boolean,
  onChange:any
}
export default React.memo((props:PropertyItemProps)=>{
  const {label,name,allowClear=false,type,value,unit='',units,options,onChange} = props;
  const [innerState,setInnerState] = useState({
    value,
    unit
  });
  const [colorPickerVisible,setColorPickerVisible]= useState(false);
  const handleInputChange:ChangeEventHandler<HTMLInputElement>=(e)=>{
    const value = e.target.value;
    let newInnerState = {
      ...innerState,
      value
    }
    setInnerState(newInnerState);
  }
  const handleChange=(fieldName:string,selectValue:string)=>{
    const newInnerState = {
      ...innerState,
      [fieldName]:selectValue
    };
    setInnerState(newInnerState);
    callback(newInnerState);
  }

  const handleColorChange=({hex}:any)=>{
    const newInnerState = {
      ...innerState,
      value:hex
    };
    setInnerState(newInnerState);
    setColorPickerVisible(false);
    callback(newInnerState);
  }
  const handleRadioChange=(e:RadioChangeEvent)=>{
    const value = e.target.value;
    let newInnerState = {
      ...innerState,
      value
    }
    setInnerState(newInnerState);
    callback(newInnerState);
  }
  const callback = ({value,unit}:{value:string,unit:string})=>{
    if(type==='inputWithUnit'&&isNaN(Number(value))){
      value=nameMapToDefaultStyle[name];
      unit='';
      setInnerState({
        value,
        unit
      });
    }
    isFunction(onChange)&&onChange([value,unit]);
  }
  let content:ReactElement;
  if(type==='input'){
    content=<Input size="small" value={innerState.value} onChange={handleInputChange}/>
  }else if(type==='inputWithUnit'){
    content=<Input size="small" value={innerState.value} onChange={handleInputChange} onBlur={()=>{callback(innerState)}} onPressEnter={()=>{callback(innerState)}} addonAfter={
      <Select size="small" value={innerState.unit} onChange={handleChange.bind(this,'unit')}>
        {
          units.map((item)=><Option key={item} value={item}>{item}</Option>)
        }
      </Select>
    }/>
  }else if(type==='select'){
    content=<Select size="small" style={{minWidth:'100%'}} placeholder="请选择" allowClear={allowClear} value={innerState.value} onChange={handleChange.bind(this,'value')}>
    {
      (options as string[]).map((item)=><Option key={item} value={item}>{item}</Option>)
    }
  </Select>
  }else if(type==='colorPicker'){
    content=<Input size="small" value={innerState.value} onChange={handleInputChange} addonAfter={
      <Dropdown visible={colorPickerVisible} overlay={<SketchPicker color={innerState.value} onChangeComplete={handleColorChange}/>}>
        <a href="javascript:void(0);" style={{display:'block',height:10,width:10,background:innerState.value}} onClick={()=>{setColorPickerVisible(true)}}></a>
      </Dropdown>
    }/>
  }else if(type==='slider'){
    content=<Slider min={0} max={1} step={0.1} onChange={handleChange.bind(this,'value')} value={Number(innerState.value)}/>
  }else if(type==="iconRadio"){
    content = <Radio.Group value={innerState.value} onChange={handleRadioChange}>
      {
        (options as {label:string,value:string}[]).map((option)=>{
          const {label,value} = option;
          return <Radio.Button key={value} value={value}><Icon type={label}/></Radio.Button>
        })
      }
    </Radio.Group>
  }
  return <div className={`${prefixClassName}-component-property-item`}>
    <div className="label">{label}</div>
    <div className="content">
      {content}
    </div>
  </div>
})
