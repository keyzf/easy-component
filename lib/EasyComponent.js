System.register(["react"], function (exports_1, context_1) {
    "use strict";
    var react_1, EasyComponent;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (react_1_1) {
                react_1 = react_1_1;
            }
        ],
        execute: function () {
            EasyComponent = class EasyComponent extends react_1.default.PureComponent {
                render() {
                    return (react_1.default.createElement("div", null, "1233"));
                }
            };
            exports_1("default", EasyComponent);
        }
    };
});
