//创建唯一id
import {prefixClassName} from '../constant';
export function createID():string{
  return `${prefixClassName}_el_${Math.random()
  .toString(36)
  .substring(2,9)}`;
}