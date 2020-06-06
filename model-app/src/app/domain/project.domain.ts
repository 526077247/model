/**
 * 项目
 */
import {Util} from '../share/class/util';
import {Domain} from './domain.domain';
import { Script } from './script.domain';

export class Project {
  id: string; // 项目号
  name: string; // 项目名
  userId: string; // 创建人
  createTime: string; // 创建时间
  describeContent: string; // 项目描述
  state: number; // 状态
  remark: string; // 备注
  domains: Domain[]; // 对象列表
  scripts: Script[]; // 脚本列表

  constructor(options: {
    id?: string; // 项目号
    name?: string; // 项目名
    userId?: string; // 创建人
    createTime?: string; // 创建时间
    describeContent?: string; // 项目描述
    state?: number; // 状态
    remark?: string; // 备注
    domains?: Domain[]; // 对象列表
    scripts?: Script[]; // 脚本列表
  } = {}) {
    this.id = options.id || '';
    this.name = options.name || '';
    this.userId = options.userId || '';
    this.createTime = options.createTime || Util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
    this.describeContent = options.describeContent || '';
    this.state = !options.state ? 0 : Number.parseFloat(options.state.toString());
    this.remark = options.remark || '';
    this.domains = options.domains ? options.domains : [];
    this.scripts = options.scripts ? options.scripts : [];
  }

  public getDomainList(): Domain[] {
    const res = [];
    if (!!this.domains) {
      for (const item of this.domains) {
        const domain = new Domain(item);
        res.push.apply(res, domain.getDomainList());
      }
    }
    res.sort((a, b) => {
      if (a.name === b.name) {
        return 0;
      }
      const list = [a.name, b.name].sort();
      return a.name === list[0] ? -1 : 1;
    });
    return res;
  }


}
