import React from 'react';
import PropTypes from 'prop-types';
import noElement from '@/components/noElement';

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
      <div className="comp-elements-pane">
        元素
      </div>
    )
  }
}

export default noElement(ElementsPane)