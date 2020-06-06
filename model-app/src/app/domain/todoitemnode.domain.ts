import {Util} from '../share/class/util';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  name: string;
  level: number;
  id: string;

  constructor(options: {
    children?: TodoItemNode[];
    name?: string;
    level?: number;
    id?: string;
  } = {}) {
    this.children = options.children;
    this.name = options.name || '';
    this.level = options.level;
    this.id = options.id || Util.uuid();
  }
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  name: string;
  level: number;
  id: string;
  expandable: any;
  childzero: boolean;
  isShow: boolean;
}
