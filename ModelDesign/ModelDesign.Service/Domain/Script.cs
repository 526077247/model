using service.core;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    public class Script : DataObject
    {
        /// <summary>
        /// 标识
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 脚本Id
        /// </summary>
        public string buildScriptId { get; set; }
        /// <summary>
        /// 对象Id
        /// </summary>
        public string domainId { get; set; }
        /// <summary>
        /// 子节点
        /// </summary>
        public DataList<Script> childes { get; set; }
    }
}
