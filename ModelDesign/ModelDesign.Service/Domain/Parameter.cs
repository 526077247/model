using service.core;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    /// <summary>
    /// 参数
    /// </summary>
    public class Parameter : DataObject
    {
        /// <summary>
        /// 参数标识
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 所属方法
        /// </summary>
        public string methodId { get; set; }
        /// <summary>
        /// 参数名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 参数描述
        /// </summary>
        public string describe { get; set; }
        /// <summary>
        /// 参数类型
        /// </summary>
        public string type { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string remark { get; set; }

    }
}
