import {prefixClassName} from '../constant';
import {VirtualDom} from '../components/virtualDomTree';
import {isArray} from 'lodash';

//创建唯一id
function createID():string{
  return Math.random()
  .toString(36)
  .substring(2,9);
}

//创建虚拟树id
export function createVirtualDomId():string{
  return `${prefixClassName}_vdom_${createID()}`;
}

//创建元素id
export function createElementId():string{
  return `${prefixClassName}_el_${createID()}`;
}


export function createVirtualDomIdDeep(virtualDom:VirtualDom){
  const {children} = virtualDom;
  function loop(data:VirtualDom[]){
    data.forEach((item)=>{
      const {children} = item;
      item.id=createVirtualDomId();
      isArray(children)&&loop(children);
    });
  }
  virtualDom.id=createVirtualDomId();
  isArray(children)&&loop(children);
}