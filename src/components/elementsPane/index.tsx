import React from 'react';
import PropTypes from 'prop-types';
import noElement from '../noElement';
import {elementsPaneClassName} from '../../constant'

interface ElementsPaneProps{
  activeId:string
}
class ElementsPane extends React.PureComponent<ElementsPaneProps> {
  static propTypes = {
    activeId:PropTypes.string
  }
  render() {
    const {activeId} = this.props;
    return (
      <div className={elementsPaneClassName}>
        元素
      </div>
    )
  }
}

export default noElement(ElementsPane)
