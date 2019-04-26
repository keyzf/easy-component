import React from 'react';
import classnames from 'classnames';
import { Tabs,Button,Row,Col,Icon} from 'antd';
import {prefixClassName} from '@/constant';
import {createID} from '@/utils';
import ComponentDrawingBoard from '@/components/componentDrawingBoard';
import PropertyInfo from '@/components/propertyInfo';
import VirtualDomTree,{VirtualDom} from '@/components/virtualDomTree';
import ElementsPane from '@/components/elementsPane';
import '@/scss/main.scss';
const TabPane = Tabs.TabPane;

export default class EasyComponent extends React.PureComponent{
  state={
    virtualDomData:[{
      id:createID(),
      type:'div',
      props:{
        className:'table-wrapper',
        style:{
          color:'red'
        }
      },
      children:[{
        id:createID(),
        type:Button,
        children:'点击'
      },{
        id:createID(),
        type:Button,
        props:{
          style:{
            marginLeft:10
          }
        },
        children:'hello'
      }]
    },{
      id:createID(),
      type:Row,
      props:{
        style:{}
      },
      children:[{
        id:createID(),
        type:Col,
        props:{
          style:{},
          span:4
        },
        children:[{
          id:createID(),
          type:Icon,
          props:{
            type:'caret-left'
          }
        }]
      }]
    }]
  }
  handleVirtualDomTreeChange=(newVirtualDomData:VirtualDom[])=>{
    this.setState({
      virtualDomData:newVirtualDomData
    });
  }
  render() {
    const {virtualDomData} = this.state;
    return (<div className="easy-component">
      <div className="left">
        <header className="header">头部</header>
        <main className="main">
          <ComponentDrawingBoard virtualDomData={virtualDomData}/>
        </main>
      </div>
      <div className="right">
        <Tabs>
          <TabPane tab="元素" key="1"> <ElementsPane/></TabPane>
          <TabPane tab="结构" key="2"> <VirtualDomTree virtualDomData={virtualDomData} onChange={this.handleVirtualDomTreeChange}/></TabPane>
          <TabPane tab="属性" key="3"><PropertyInfo/></TabPane>
        </Tabs>
      </div>
    </div>);
  }
}
