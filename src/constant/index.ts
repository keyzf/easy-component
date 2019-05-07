import {ComponentType} from 'react';
export const prefixClassName:string = 'es';
export const activeClassName:string = `${prefixClassName}-selected-comp`;
export const toolBarClassName:string = `${prefixClassName}-comp-toolbar`;
export const headerHeight:number = 45;

export type OperationType = 'delete' | 'copy' | 'findParent';

export interface VirtualDom {
  id:string,
  type:ComponentType|string,
  props?:any,
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