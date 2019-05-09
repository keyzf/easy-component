import React from 'react';
import PropTypes from 'prop-types';
import {Collapse,Row,Col,Divider} from 'antd';
import {isFunction,assign,isUndefined,isNull} from 'lodash';
import {VirtualDom,nameMapToDefaultStyle,nameMapToLabel,prefixClassName} from '@/constant';
import noElement from '@/components/noElement';
import {findNodeById} from '@/components/virtualDomTree';
import PropertyItem from '@/components/propertyItem'

import './style.scss';
const Panel = Collapse.Panel;
const unitOptions = ['px','%','vh'];
const fontSizeUnitOptions = ['px','em','rem','%'];
const unitReg = /px|%|vh/i;
const fontSizeUnitReg = /px|em|rem|%/i;

interface PropertyInfoProps{
  activeId:string,
  virtualDomData:VirtualDom[],
  onChange(virtualDomData:VirtualDom[]):void
}
interface PropertyInfoState{
}
let currentNode:VirtualDom;
class PropertyInfo extends React.PureComponent<PropertyInfoProps,PropertyInfoState>{
  readonly state = {}
  static propTypes = {
    activeId:PropTypes.string,
    virtualDomData:PropTypes.array,
    onChange:PropTypes.func
  }
  firstLoad:boolean=true
  static getDerivedStateFromProps(nextProps:PropertyInfoProps,prevState:PropertyInfoState):any{
    const {activeId,virtualDomData} = nextProps;
    currentNode=findNodeById(virtualDomData,activeId,false).node;
    return null;
  }
  handlePropertyChange=(name:string,value:string[])=>{
    const {onChange,virtualDomData} = this.props;
    let finalStyle = assign({},currentNode.style);
    finalStyle={
      ...finalStyle,
     [name]:value.join('')===nameMapToDefaultStyle[name]?undefined:(value as string[]).join('')
    }
    currentNode.style=finalStyle;
    isFunction(onChange)&&onChange([...virtualDomData]);
  }
  render(){
    const {style={},id} = currentNode;
    const {
      position,
      fontSize=nameMapToDefaultStyle.fontSize,
      fontWeight=nameMapToDefaultStyle.fontWeight,
      color=nameMapToDefaultStyle.color,
      lineHeight=nameMapToDefaultStyle.lineHeight,
      textAlign=nameMapToDefaultStyle.textAlign,
      borderWidth=nameMapToDefaultStyle.borderWidth,
      borderStyle=nameMapToDefaultStyle.borderStyle,
      borderColor=nameMapToDefaultStyle.borderColor,
      opacity=nameMapToDefaultStyle.opacity,
      background=nameMapToDefaultStyle.background
    } = style;
    return (<div className={`${prefixClassName}-component-property-info`}>
      <Collapse key={`property-info-${id}`} defaultActiveKey={["general"]}>
        <Panel header="综合" key="general">
          <Row gutter={10}>
            <Col span={12}>
              <PropertyItem
                type="select"
                label={nameMapToLabel.position}
                options={['static','absolute','relative']}
                value={position?position:nameMapToDefaultStyle.position}
                onChange={this.handlePropertyChange.bind(this,'position')}/>
            </Col>
          </Row>
          <Row gutter={10}>
            {
              ['top','right','bottom','left'].map((key)=>{
                const value:string = isUndefined(style[key])?nameMapToDefaultStyle[key]:style[key];
                const unit = isNull(value.match(unitReg))?'px':value.match(unitReg)[0];
                return  <Col key={key} span={12}>
                  <PropertyItem
                  type="inputWithUnit"
                  label={nameMapToLabel[key]}
                  unit={unit}
                  units={unitOptions}
                  value={value.replace(unitReg,'')}
                  onChange={this.handlePropertyChange.bind(this,key)}/>
                </Col>
              })
            }
          </Row>
        </Panel>
        <Panel header="尺寸" key="dimension">
          <Row gutter={10}>
            {
              ['width','height'].map((key)=>{
                const value:string = isUndefined(style[key])?nameMapToDefaultStyle[key]:style[key];
                const unit = isNull(value.match(unitReg))?'':value.match(unitReg)[0];
                return  <Col key={key} span={12}>
                <PropertyItem
                  type="inputWithUnit"
                  name={key}
                  label={nameMapToLabel[key]}
                  unit={unit}
                  units={unitOptions}
                  value={value.replace(unitReg,'')}
                  onChange={this.handlePropertyChange.bind(this,key)}/>
              </Col>
              })
            }
          </Row>
          <Divider className="divider-title">外边距</Divider>
          <Row gutter={10}>
            {
              ['marginTop','marginRight','marginBottom','marginLeft'].map((key)=>{
                const value:string = isUndefined(style[key])?nameMapToDefaultStyle[key]:style[key];
                const unit = isNull(value.match(unitReg))?'px':value.match(unitReg)[0];
                return  <Col key={key} span={12}>
                <PropertyItem
                  type="inputWithUnit"
                  label={nameMapToLabel[key]}
                  unit={unit}
                  units={unitOptions}
                  value={value.replace(unitReg,'')}
                  onChange={this.handlePropertyChange.bind(this,key)}/>
              </Col>
              })
            }
          </Row>
          <Divider className="divider-title">内边距</Divider>
          <Row gutter={10}>
            {
              ['paddingTop','paddingRight','paddingBottom','paddingLeft'].map((key)=>{
                const value:string = isUndefined(style[key])?nameMapToDefaultStyle[key]:style[key];
                const unit = isNull(value.match(unitReg))?'px':value.match(unitReg)[0];
                return  <Col key={key} span={12}>
                <PropertyItem
                  type="inputWithUnit"
                  label={nameMapToLabel[key]}
                  unit={unit}
                  units={unitOptions}
                  value={value.replace(unitReg,'')}
                  onChange={this.handlePropertyChange.bind(this,key)}/>
              </Col>
              })
            }
          </Row>
        </Panel>
        <Panel header="排版" key="typography">
          <Row gutter={10}>
            <Col span={12}>
              <PropertyItem
                type="inputWithUnit"
                label={nameMapToLabel.fontSize}
                name="fontSize"
                unit={isNull(fontSize.match(fontSizeUnitReg))?'':fontSize.match(fontSizeUnitReg)[0]}
                units={fontSizeUnitOptions}
                value={(fontSize).replace(fontSizeUnitReg,'')}
                onChange={this.handlePropertyChange.bind(this,'fontSize')}/>
            </Col>
            <Col span={12}>
              <PropertyItem
                type="select"
                label={nameMapToLabel.fontWeight}
                name="fontWeight"
                options={['100','200','300','400','500','600','700','800','900']}
                value={fontWeight}
                onChange={this.handlePropertyChange.bind(this,'fontWeight')}/>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <PropertyItem
                type="inputWithUnit"
                label={nameMapToLabel.lineHeight}
                name="lineHeight"
                unit={isNull(lineHeight.match(fontSizeUnitReg))?'':lineHeight.match(fontSizeUnitReg)[0]}
                units={fontSizeUnitOptions}
                value={(lineHeight).replace(fontSizeUnitReg,'')}
                onChange={this.handlePropertyChange.bind(this,'lineHeight')}/>
            </Col>
          </Row>
          <div>
            <PropertyItem
              type="colorPicker"
              label={nameMapToLabel.color}
              value={color}
              onChange={this.handlePropertyChange.bind(this,'color')}/>
          </div>
          <div>
            <PropertyItem
              type="iconRadio"
              label={nameMapToLabel.textAlign}
              value={textAlign}
              options={[{
                label:'align-left',
                value:'left'
              },{
                label:'align-center',
                value:'center'
              },{
                label:'align-right',
                value:'right'
              }]}
              onChange={this.handlePropertyChange.bind(this,'textAlign')}/>
          </div>
        </Panel>
        <Panel header="装饰" key="decoration">
           <div>
              <PropertyItem
                type="slider"
                label={nameMapToLabel.opacity}
                value={opacity}
                onChange={this.handlePropertyChange.bind(this,'opacity')}/>
          </div>
          <div>
            <PropertyItem
              type="colorPicker"
              label={nameMapToLabel.background}
              value={background}
              onChange={this.handlePropertyChange.bind(this,'background')}/>
          </div>
          <Divider className="divider-title">边框</Divider>
          <Row gutter={10}>
            <Col span={12}>
              <PropertyItem
                type="inputWithUnit"
                label={nameMapToLabel.borderWidth}
                unit={isNull(borderWidth.match(unitReg))?'px':borderWidth.match(unitReg)[0]}
                units={['px','em']}
                value={(borderWidth).replace(unitReg,'')}
                onChange={this.handlePropertyChange.bind(this,'borderWidth')}/>
            </Col>
            <Col span={12}>
              <PropertyItem
                type="select"
                label={nameMapToLabel.borderStyle}
                options={['solid','dotted','double','dashed']}
                allowClear={true}
                value={borderStyle}
                onChange={this.handlePropertyChange.bind(this,'borderStyle')}/>
            </Col>
          </Row>
          <div>
            <PropertyItem
              type="colorPicker"
              label={nameMapToLabel.borderColor}
              value={borderColor}
              onChange={this.handlePropertyChange.bind(this,'borderColor')}/>
          </div>
          <Divider className="divider-title">边框圆角</Divider>
          <Row gutter={10}>
          {
              ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius'].map((key)=>{
                const value:string = isUndefined(style[key])?nameMapToDefaultStyle[key]:style[key];
                const unit = isNull(value.match(unitReg))?'px':value.match(unitReg)[0];
                return  <Col key={key} span={12}>
                <PropertyItem
                  type="inputWithUnit"
                  label={nameMapToLabel[key]}
                  unit={unit}
                  units={unitOptions.filter((unit)=>unit!=='vh')}
                  value={value.replace(unitReg,'')}
                  onChange={this.handlePropertyChange.bind(this,key)}/>
              </Col>
              })
            }
          </Row>
        </Panel>
      </Collapse>
    </div>)
  }
}


export default noElement(PropertyInfo);
