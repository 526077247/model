/**
 * 脚本
 */
import {Util} from '../share/class/util';
import {Domain} from './domain.domain';

export class BuildingScript {
  id: string; // 脚本号
  name: string; // 脚本标题
  userId: string; // 创建人
  createTime: string; // 创建时间
  describeContent: string; // 脚本描述
  state: number; // 状态
  type: number; // 脚本类型
  content: string; // 脚本内容
  remark: string; // 备注
  childes: BuildingScript[]; // 子节点
  domain: Domain; // 对象
  isLoading: boolean;

  constructor(options: {
    id?: string;
    name?: string; // 脚本标题
    userId?: string; // 创建人
    createTime?: string; // 创建时间
    describeContent?: string; // 脚本描述
    state?: number; // 状态
    type?: number; // 脚本类型
    content?: string; // 脚本内容
    remark?: string; // 备注
    childes?: BuildingScript[]; // 子节点
    domain?: Domain; // 对象
  } = {}) {
    this.id = options.id || '';
    this.name = options.name || '';
    this.userId = options.userId || '';
    this.createTime = options.createTime || Util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
    this.describeContent = options.describeContent || '';
    this.state = !options.state ? 0 : Number.parseFloat(options.state.toString());
    this.type = !options.type ? 0 : Number.parseFloat(options.type.toString());
    this.content = options.content || '';
    this.remark = options.remark || '';
    this.childes = options.childes ? options.childes : [];
    this.domain = options.domain ? options.domain : new Domain();
    this.isLoading = false;
  }
}
