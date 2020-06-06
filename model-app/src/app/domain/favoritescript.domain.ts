/**
 * 收藏脚本
 */
import {Util} from '../share/class/util';

export class FavoriteScript {
  id: string; // 脚本号
  userId: string; // 创建人
  scriptId: string;
  addTime: string; // 创建时间


  constructor(options: {
    id?: string;
    userId?: string; // 创建人
    scriptId?: string;
    addTime?: string; // 创建时间
  } = {}) {
    this.id = options.id || '';
    this.userId = options.userId || '';
    this.scriptId = options.scriptId || '';
    this.addTime = options.addTime || Util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');

  }
}
