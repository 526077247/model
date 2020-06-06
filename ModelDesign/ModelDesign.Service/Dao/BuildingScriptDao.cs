
using IBatisNet.DataAccess.Interfaces;
using service.core;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    public interface IBuildingScriptDao : IBaseDao, IDao
    {

    }

    public class BuildingScriptDao : BaseDao, IBuildingScriptDao
    {
        #region IBuildingScriptDao函数

        #endregion

        #region IDao函数
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public int Delete(object obj)
        {
            return Delete(obj, "DeleteBuildingScript");
        }
        /// <summary>
        /// 取
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public object Get(object obj)
        {
            return Get(obj, "GetBuildingScript");
        }
        /// <summary>
        /// 条件取
        /// </summary>
        /// <param name="para"></param>
        /// <returns></returns>
        public object GetByPara(Hashtable para)
        {
            return Get(para, "GetBuildingScriptByPara");
        }
        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public object Insert(object obj)
        {
            return Insert(obj, "InsertBuildingScript");
        }
        /// <summary>
        /// 条件查数量
        /// </summary>
        /// <param name="map"></param>
        /// <returns></returns>
        public int QueryCount(Hashtable map)
        {
            return QueryCount(map, "QueryBuildingScriptCount");
        }
        /// <summary>
        /// 条件查列表
        /// </summary>
        /// <param name="map"></param>
        /// <param name="start"></param>
        /// <param name="paseSize"></param>
        /// <returns></returns>
        public IList QueryList(Hashtable map, int start, int paseSize)
        {
            return QueryList(map, "QueryBuildingScriptList", start, paseSize);
        }
        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public object Update(object obj)
        {
            return Update(obj, "UpdateBuildingScript");
        }

        #endregion
    }
}
