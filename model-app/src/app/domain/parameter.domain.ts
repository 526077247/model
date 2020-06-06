/**
 * 参数
 */

export class Parameter {
  id: string; // 参数号
  methodId: string; // 方法号
  name: string; // 参数名
  describe: string; // 参数描述
  type: string; // 基类
  remark: string; // 备注
  extend: string; // 扩展字段
  isCheck: boolean; // 是否選擇
  constructor(options: {
    id?: string; // 参数号
    methodId?: string; // 方法号
    name?: string; // 参数名
    describe?: string; // 参数描述
    type?: string; // 基类
    remark?: string; // 备注
    extend?: string; // 扩展字段
  } = {}) {
    this.id = options.id || '';
    this.methodId = options.methodId || '';
    this.name = options.name || '';
    this.describe = options.describe || '';
    this.type = options.type || '';
    this.remark = options.remark || '';
    this.extend = options.extend || '';
    this.isCheck = false;
  }
}
