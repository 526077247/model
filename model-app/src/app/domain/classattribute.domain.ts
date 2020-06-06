/**
 * 属性
 */
export class ClassAttribute {
  id: string; // 属性号
  name: string; // 属性名
  describe: string; // 属性描述
  sqlOption: number; // 生产数据库选项
  type: string; // 类型
  remark: string; // 备注
  extend: string; // 扩展字段
  isCheck: boolean; // 是否选择
  isShow: boolean; // 是否展示
  constructor(options: {
    id?: string; // 属性号
    name?: string; // 属性名
    describe?: string; // 属性描述
    sqlOption?: number; // 生产数据库选项
    type?: string; // 类型
    remark?: string; // 备注
    extend?: string; // 扩展字段
  } = {}) {
    this.id = options.id || '';
    this.name = options.name || '';
    this.describe = options.describe || '';
    this.sqlOption = !options.sqlOption ? 0 : Number.parseFloat(options.sqlOption.toString());
    this.type = options.type || '';
    this.remark = options.remark || '';
    this.extend = options.extend || '';
    this.isCheck = false;
    this.isShow = false;
  }
}

export enum TYPE_OF_SQL {
  PK = 1,
  NOTNULL = 2,
  QUERY = 4,
  ORDER = 8,
  INDEX = 16,
  SKIP = 32
}
