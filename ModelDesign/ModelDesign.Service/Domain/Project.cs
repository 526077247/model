using Newtonsoft.Json;
using service.core;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    /// <summary>
    /// 项目
    /// </summary>
    public class Project : DataObject
    {
        /// <summary>
        /// 项目标识
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 项目名
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 创建人
        /// </summary>
        public string userId { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime createTime { get; set; }
        /// <summary>
        /// 项目描述
        /// </summary>
        public string describeContent { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public int state { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string remark { get; set; }
        /// <summary>
        /// 对象列表
        /// </summary>
        public DataList<Domain> domains { get; set; }
        /// <summary>
        /// 模板列表
        /// </summary>
        public DataList<Script> scripts { get; set; }
        /// <summary>
        /// 构造函数
        /// </summary>
        public Project()
        {
            domains = new DataList<Domain>();
            scripts = new DataList<Script>();
        }
    }

    
}
