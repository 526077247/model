/**
 * 返回列表
 */
export class DataList<T> {
  total: number; // 总数
  start: number; // 当前起始位置
  pageSize: number; // 分页大小
  list: T[]; // 列表
  constructor(options: {
    total?: number;
    start?: number;
    pageSize?: number;
    list?: T[];
  } = {}) {
    this.total = !options.total ? 0 : Number.parseFloat(options.total.toString());
    this.start = !options.start ? 0 : Number.parseFloat(options.start.toString());
    this.pageSize = !options.pageSize ? 0 : Number.parseFloat(options.pageSize.toString());
    this.list = options.list || [];
  }
}

