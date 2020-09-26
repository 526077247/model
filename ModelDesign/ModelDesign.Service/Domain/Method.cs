using service.core;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    /// <summary>
    /// 接口方法
    /// </summary>
    public class Method : DataObject
    {
        /// <summary>
        /// 方法标识
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 所属接口
        /// </summary>
        public string interfaceId { get; set; }
        /// <summary>
        /// 方法名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 返回值类型
        /// </summary>
        public string returnType { get; set; }
        /// <summary>
        /// 方法描述
        /// </summary>
        public string describe { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string remark { get; set; }
        /// <summary>
        /// 扩展字段
        /// </summary>
        public string extend { get; set; }
        /// <summary>
        /// 参数列表
        /// </summary>
        public DataList<Parameter> parameters { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        public Method()
        {
            parameters = new DataList<Parameter>();
        }
    }
}
