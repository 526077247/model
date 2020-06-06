/**
 * 项目
 */
import {ClassAttribute} from './classattribute.domain';
import {Method} from './method.domain';

export class Domain {
  id: string; // 对象号
  projectId: string; // 项目号
  name: string; // 对象名
  describe: string; // 对象描述
  type: string; // 基类
  tableName: string; // 表名
  nameSpace: string; // 命名空间
  assemblyName: string; // 程序集
  remark: string; // 备注
  extend: string; // 扩展字段
  classAttributes: ClassAttribute[]; // 属性列表
  methods: Method[]; // 接口列表
  childes: Domain[]; // 子对象列表

  constructor(options: {
    id?: string; // 对象号
    projectId?: string; // 项目号
    name?: string; // 对象名
    describe?: string; // 对象描述
    type?: string; // 基类
    tableName?: string; // 表名
    nameSpace?: string; // 命名空间
    assemblyName?: string; // 程序集
    remark?: string; // 备注
    extend?: string; // 扩展字段
    classAttributes?: ClassAttribute[]; // 属性列表
    methods?: Method[]; // 接口列表
    childes?: Domain[]; // 子对象列表
  } = {}) {
    this.id = options.id || '';
    this.projectId = options.projectId || '';
    this.name = options.name || '';
    this.describe = options.describe || '';
    this.type = options.type || '';
    this.tableName = options.tableName || '';
    this.nameSpace = options.nameSpace || '';
    this.assemblyName = options.assemblyName || '';
    this.remark = options.remark || '';
    this.extend = options.extend || '';
    this.classAttributes = options.classAttributes ? options.classAttributes : [];
    this.methods = options.methods ? options.methods : [];
    this.childes = options.childes ? options.childes : [];
  }

  public getDomainList(): Domain[] {
    const res = [];
    res.push(this);
    if (!!this.childes) {
      for (const item of this.childes) {
        const domain = new Domain(item);
        res.push.apply(res, domain.getDomainList());
      }
    }
    return res;
  }
}
