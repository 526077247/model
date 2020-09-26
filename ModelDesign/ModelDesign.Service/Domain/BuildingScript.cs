using service.core;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    /// <summary>
    /// 生成脚本
    /// </summary>
    public class BuildingScript: DataObject
    {
        /// <summary>
        /// 脚本标识
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 脚本名
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
        /// 脚本描述
        /// </summary>
        public string describeContent { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public int state { get; set; }
        /// <summary>
        /// 脚本类型
        /// </summary>
        public int type { get; set; }
        /// <summary>
        /// 脚本内容
        /// </summary>
        public string content { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string remark { get; set; }
    }
}
