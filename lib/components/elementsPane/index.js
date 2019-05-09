var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from 'react';
import PropTypes from 'prop-types';
import noElement from '@/components/noElement';
var ElementsPane = /** @class */ (function (_super) {
    __extends(ElementsPane, _super);
    function ElementsPane() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElementsPane.prototype.render = function () {
        var activeId = this.props.activeId;
        return (React.createElement("div", { className: "comp-elements-pane" }, "\u5143\u7D20"));
    };
    ElementsPane.propTypes = {
        activeId: PropTypes.string
    };
    return ElementsPane;
}(React.PureComponent));
export default noElement(ElementsPane);
