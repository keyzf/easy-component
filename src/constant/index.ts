import {VirtualDom} from '../components/virtualDomTree';
export const prefixClassName:string = 'es';
export const activeClassName:string = `${prefixClassName}-selected-comp`;

//组件类名
export const mainClassName:string = 'easy-component';
export const toolBarClassName:string = `${prefixClassName}-comp-toolbar`;
export const propertyItemClassName:string = `${prefixClassName}-comp-property-item`;
export const propertyInfoClassName:string = `${prefixClassName}-comp-property-info`;
export const drawingBoardClassName:string = `${prefixClassName}-comp-drawing-board`;
export const elementsPaneClassName:string =  `${prefixClassName}-comp-elements-pane`;
export const virtualDomTreeClassName:string = `${prefixClassName}-comp-virtual-dom-tree`;


export const headerHeight:number = 45;
export type OperationType = 'delete' | 'copy' | 'findParent';
export const nameMapToDefaultStyle:{
  [propName:string]:string|undefined
} = {
  position:undefined,
  width:'',
  height:'',
  top:'0px',
  right:'0px',
  bottom:'0px',
  left:'0px',
  marginTop:'0px',
  marginRight:'0px',
  marginBottom:'0px',
  marginLeft:'0px',
  paddingTop:'0px',
  paddingRight:'0px',
  paddingBottom:'0px',
  paddingLeft:'0px',
  fontSize:'',
  fontWeight:'',
  color:'',
  lineHeight:'',
  textAlign:'left',
  opacity:'1',
  background:'',
  borderWidth:'0px',
  borderStyle:'',
  borderColor:'',
  borderTopLeftRadius:'0px',
  borderTopRightRadius:'0px',
  borderBottomLeftRadius:'0px',
  borderBottomRightRadius:'0px'
}


export const nameMapToLabel:{
  [propName:string]:string
} = {
  position:'定位',
  width:'宽度',
  height:'高度',
  top:'上',
  right:'右',
  bottom:'下',
  left:'左',
  marginTop:'上',
  marginRight:'右',
  marginBottom:'下',
  marginLeft:'左',
  paddingTop:'上',
  paddingRight:'右',
  paddingBottom:'下',
  paddingLeft:'左',
  fontSize:'字体大小',
  fontWeight:'字体粗细',
  color:'字体颜色',
  lineHeight:'行高',
  textAlign:'排列',
  opacity:'透明度',
  background:'背景色',
  borderWidth:'粗细',
  borderStyle:'样式',
  borderColor:'颜色',
  borderTopLeftRadius:'上左',
  borderTopRightRadius:'上右',
  borderBottomLeftRadius:'下左',
  borderBottomRightRadius:'下右',
}

export const redoRecordList:{
  activeId:string,
  virtualDomData:VirtualDom[]
}[]=[];

export const undoRecordList:{
  activeId:string,
  virtualDomData:VirtualDom[]
}[]=[];
