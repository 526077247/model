/**
 * 方法
 */
import {Parameter} from './parameter.domain';

export class Method {
  id: string; // 方法号
  interfaceId: string; // 接口号
  name: string; // 方法名
  returnType: string; // 返回值类型
  describe: string; // 接口描述
  remark: string; // 备注
  extend: string; // 扩展字段
  parameters: Parameter[]; // 参数列表
  isCheck: boolean; // 是否选择
  isShow: boolean; // 是否展示
  constructor(options: {
    id?: string; // 方法号
    interfaceId?: string; // 接口号
    name?: string; // 方法名
    returnType?: string; // 返回值类型
    describe?: string; // 接口描述
    remark?: string; // 备注
    extend?: string; // 扩展字段
    parameters?: Parameter[]; // 参数列表
  } = {}) {
    this.id = options.id || '';
    this.interfaceId = options.interfaceId || '';
    this.name = options.name || '';
    this.returnType = options.returnType || '';
    this.describe = options.describe || '';
    this.remark = options.remark || '';
    this.extend = options.extend || '';
    this.parameters = options.parameters ? options.parameters : [];
    this.isCheck = false;
    this.isShow = false;
  }
}
