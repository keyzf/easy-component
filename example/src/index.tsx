import React from 'react';
import { render } from 'react-dom';
import {Button,Row,Col,Icon, message} from 'antd';
import {EasyComponent,createID} from '../../src';
import '../../src/less/index.less';
// import '../../es/less/index.less';
// import '../../dist/index.css';
const defaultVirtualDomData = [{
  id:createID(),
  type:'div',
  isDrop:true,
  style:{
    padding:'10px'
  },
  children:[{
    id:createID(),
    type:'div',
    isDrop:true,
    props:{
      className:'table-wrapper',
    },
    style:{
      color:'red',
      padding:'10px'
    },
    children:[{
      id:createID(),
      type:Button,
      props:{
        type:'primary',
        icon:'search'
      },
      children:'点击'
    },{
      id:createID(),
      type:Button,
      style:{
        marginLeft:'10px'
      },
      children:'hello'
    }]
  },{
    id:createID(),
    type:Row,
    style:{
      paddingTop:'10px',
      paddingRight:'20px',
      paddingBottom:'10px',
      paddingLeft:'10px'
    },
    children:[{
      id:createID(),
      type:Col,
      isDrop:true,
      props:{
        span:4
      },
      style:{
        padding:'10px'
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
}]
render(<EasyComponent defaultVirtualDomData={defaultVirtualDomData} onSave={()=>{message.success('保存成功')}}/>, document.getElementById('root'))
