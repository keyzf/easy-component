import React from 'react';
import classnames from 'classnames';
import { Tabs } from 'antd';
import {prefixClassName} from '@/constant';
import VirtualDomTree from '@/components/virtualDomTree';
import ComponentCanvas from '@/components/componentCanvas';
import PropertyInfo from '@/components/propertyInfo';
import '@/scss/main.scss';
const TabPane = Tabs.TabPane;

export default class EasyComponent extends React.PureComponent<any, any> {
  render() {
    return (<div className="easy-component">
      <div className="left">
        <header className="header">头部</header>
        <main className="main">
          <ComponentCanvas/>
        </main>
      </div>
      <div className="right">
        <Tabs>
          <TabPane tab="结构" key="1"> <VirtualDomTree/></TabPane>
          <TabPane tab="属性" key="2"><PropertyInfo/></TabPane>
        </Tabs>
      </div>
    </div>);
  }
}
