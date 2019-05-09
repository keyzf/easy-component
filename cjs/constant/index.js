"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixClassName = 'es';
exports.activeClassName = exports.prefixClassName + "-selected-comp";
//组件类名
exports.mainClassName = 'easy-component';
exports.toolBarClassName = exports.prefixClassName + "-comp-toolbar";
exports.propertyItemClassName = exports.prefixClassName + "-comp-property-item";
exports.propertyInfoClassName = exports.prefixClassName + "-comp-property-info";
exports.drawingBoardClassName = exports.prefixClassName + "-comp-drawing-board";
exports.elementsPaneClassName = exports.prefixClassName + "-comp-elements-pane";
exports.virtualDomTreeClassName = exports.prefixClassName + "-comp-virtual-dom-tree";
exports.headerHeight = 45;
exports.nameMapToDefaultStyle = {
    position: undefined,
    width: '',
    height: '',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
    marginTop: '0px',
    marginRight: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    paddingTop: '0px',
    paddingRight: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
    fontSize: '',
    fontWeight: '',
    color: '',
    lineHeight: '',
    textAlign: 'left',
    opacity: '1',
    background: '',
    borderWidth: '0px',
    borderStyle: '',
    borderColor: '',
    borderTopLeftRadius: '0px',
    borderTopRightRadius: '0px',
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px'
};
exports.nameMapToLabel = {
    position: '定位',
    width: '宽度',
    height: '高度',
    top: '上',
    right: '右',
    bottom: '下',
    left: '左',
    marginTop: '上',
    marginRight: '右',
    marginBottom: '下',
    marginLeft: '左',
    paddingTop: '上',
    paddingRight: '右',
    paddingBottom: '下',
    paddingLeft: '左',
    fontSize: '字体大小',
    fontWeight: '字体粗细',
    color: '字体颜色',
    lineHeight: '行高',
    textAlign: '排列',
    opacity: '透明度',
    background: '背景色',
    borderWidth: '粗细',
    borderStyle: '样式',
    borderColor: '颜色',
    borderTopLeftRadius: '上左',
    borderTopRightRadius: '上右',
    borderBottomLeftRadius: '下左',
    borderBottomRightRadius: '下右',
};
exports.redoRecordList = [];
exports.undoRecordList = [];
