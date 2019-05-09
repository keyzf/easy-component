"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var noElement_1 = require("../noElement");
var constant_1 = require("../../constant");
var ElementsPane = /** @class */ (function (_super) {
    __extends(ElementsPane, _super);
    function ElementsPane() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElementsPane.prototype.render = function () {
        var activeId = this.props.activeId;
        return (react_1.default.createElement("div", { className: constant_1.elementsPaneClassName }, "\u5143\u7D20"));
    };
    ElementsPane.propTypes = {
        activeId: prop_types_1.default.string
    };
    return ElementsPane;
}(react_1.default.PureComponent));
exports.default = noElement_1.default(ElementsPane);
