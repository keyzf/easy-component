import React from 'react';
import {Button} from 'antd';

export default class SearchButton extends React.PureComponent {
  render() {
    return (
      <Button {...this.props} type="primary" icon="search">{this.props.children}</Button>
    )
  }
}
