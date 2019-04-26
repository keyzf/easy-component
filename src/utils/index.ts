//创建唯一id
export function createID():string{
  return  Math.random()
  .toString(36)
  .substring(7)
  .split('')
  .join('.');
}

//判断是否为字符串
export function isString(value:any):boolean{
  return Object.prototype.toString.call(value) === '[object String]';
}

//判断是否为函数
export function isFunction(value:any):boolean{
  return Object.prototype.toString.call(value) === '[object Function]';
}