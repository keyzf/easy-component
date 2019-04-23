import React from 'react';
import classnames from 'classnames';
import {prefixClassName} from '@/constant';
import '@/scss/main.scss';
export default class EasyComponent extends React.PureComponent<any, any> {
  render() {
    return (<div className="easy-component">
      <header className="header">头部</header>    
      <main className="main">
        <div className="left"></div>
        <div className="middle"></div>
        <div className="right"></div>
      </main>
    </div>);
  }
}
