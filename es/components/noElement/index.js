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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
function noElement(UnwrappedComponent) {
    var NoElement = hoistNonReactStatics(/** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.render = function () {
            var activeId = this.props.activeId;
            return activeId === '' ? React.createElement("div", { style: {
                    textAlign: "center"
                } }, "\u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u5143\u7D20") : React.createElement(UnwrappedComponent, __assign({}, this.props));
        };
        return class_1;
    }(React.PureComponent)), UnwrappedComponent);
    return NoElement;
}
export default noElement;
