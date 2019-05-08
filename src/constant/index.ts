import {ComponentType} from 'react';
export const prefixClassName:string = 'es';
export const activeClassName:string = `${prefixClassName}-selected-comp`;
export const toolBarClassName:string = `${prefixClassName}-comp-toolbar`;
export const headerHeight:number = 45;

export type OperationType = 'delete' | 'copy' | 'findParent';



export const nameMapToDefaultStyle:{
  [propName:string]:string
} = {
  position:'static',
  width:'auto',
  height:'auto',
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
  fontSize:'inherit',
  fontWeight:'400',
  color:'',
  lineHeight:'normal',
  textAlign:'left',
  opacity:'1',
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
  borderWidth:'粗细',
  borderStyle:'样式',
  borderColor:'颜色',
  borderTopLeftRadius:'上左',
  borderTopRightRadius:'上右',
  borderBottomLeftRadius:'下左',
  borderBottomRightRadius:'下右',
}
export interface VirtualDom {
  id:string,
  type:ComponentType|string,
  props?:{
    [propName:string]:any
  },
  style?:{
    [propName:string]:string
  },
  children?:VirtualDom [] | string
}

export const redoRecordList:{
  activeId:string,
  virtualDomData:VirtualDom[]
}[]=[];

export const undoRecordList:{
  activeId:string,
  virtualDomData:VirtualDom[]
}[]=[];
