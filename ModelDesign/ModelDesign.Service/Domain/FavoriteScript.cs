using service.core;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    /// <summary>
    /// 最爱脚本
    /// </summary>
    public class FavoriteScript : DataObject
    {
        /// <summary>
        /// 最爱脚本标识
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 用户Id
        /// </summary>
        public string userId { get; set; }
        /// <summary>
        /// 脚本Id
        /// </summary>
        public string scriptId { get; set; }
        /// <summary>
        /// 添加时间
        /// </summary>
        public DateTime addTime { get; set; }
    }
}
