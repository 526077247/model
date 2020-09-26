using service.core;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    /// <summary>
    /// 对象属性
    /// </summary>
    public class ClassAttribute : DataObject
    {
        /// <summary>
        /// 属性标识
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 属性名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 属性描述
        /// </summary>
        public string describe { get; set; }
        /// <summary>
        /// 生产数据库选项
        /// </summary>
        public int sqlOption { get; set; }
        /// <summary>
        /// 类型
        /// </summary>
        public string type { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string remark { get; set; }
        /// <summary>
        /// 扩展字段
        /// </summary>
        public string extend { get; set; }
    }
}
