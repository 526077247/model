/**
 * 帮助菜单
 */

export class HelpMenu {
  name: string; // 脚本号
  type: string; // 创建人
  childes: HelpMenu[];


  constructor(options: {
    name?: string;
    type?: string; // 创建人
    childes?: HelpMenu[];
  } = {}) {
    this.name = options.name || '';
    this.type = options.type || '';
    this.childes = options.childes || [];

  }
}
