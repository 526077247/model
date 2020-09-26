using service.core;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    /// <summary>
    /// 对象
    /// </summary>
    public class Domain : DataObject
    {
        /// <summary>
        /// 对象标识
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 所属项目
        /// </summary>
        public string projectId { get; set; }
        /// <summary>
        /// 对象名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 对象描述
        /// </summary>
        public string describe { get; set; }
        /// <summary>
        /// 基类
        /// </summary>
        public string type { get; set; }
        /// <summary>
        /// 数据库表名称
        /// </summary>
        public string tableName { get; set; }
        /// <summary>
        /// 命名空间
        /// </summary>
        public string nameSpace { get; set; }
        /// <summary>
        /// 程序集
        /// </summary>
        public string assemblyName { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string remark { get; set; }
        /// <summary>
        /// 扩展字段
        /// </summary>
        public string extend { get; set; }
        /// <summary>
        /// 属性
        /// </summary>
        public DataList<ClassAttribute> classAttributes { get; set; }
        /// <summary>
        /// 服务方法
        /// </summary>
        public DataList<Method> methods { get; set; }
        /// <summary>
        /// 子对象
        /// </summary>
        public DataList<Domain> childes { get; set; }
        /// <summary>
        /// 构造函数
        /// </summary>
        public Domain()
        {
            methods = new DataList<Method>();
            classAttributes = new DataList<ClassAttribute>();
        }
    }
}
