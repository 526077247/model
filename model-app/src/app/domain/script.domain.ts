/**
 * 脚本模板
 */

export class Script {
    id: string; // 标识
    buildScriptId: string;
    childes: Script[]; // 子节点
    domainId: string; // 对象

    constructor(options: {
        id?: string;
        buildScriptId?: string; // 脚本号
        childes?: Script[]; // 子节点
        domainId?: string; // 对象
    } = {}) {
        this.id = options.id || '';
        this.buildScriptId = options.buildScriptId || '';
        this.childes = options.childes ? options.childes : [];
        this.domainId = options.domainId || '';
    }
}
