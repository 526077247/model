using service.core;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using IBatisNet.DataAccess.Interfaces;

namespace ModelDesign.Service
{
    public interface IFavoriteScriptDao : IBaseDao, IDao
    {

    }

    public class FavoriteScriptDao : BaseDao, IFavoriteScriptDao
    {
        #region IFavoriteScriptDao函数

        #endregion

        #region IDao函数
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public int Delete(object obj)
        {
            return Delete(obj, "DeleteFavoriteScript");
        }
        /// <summary>
        /// 取
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public object Get(object obj)
        {
            return Get(obj, "GetFavoriteScript");
        }
        /// <summary>
        /// 条件取
        /// </summary>
        /// <param name="para"></param>
        /// <returns></returns>
        public object GetByPara(Hashtable para)
        {
            return Get(para, "GetFavoriteScriptByPara");
        }
        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public object Insert(object obj)
        {
            return Insert(obj, "InsertFavoriteScript");
        }
        /// <summary>
        /// 条件查数量
        /// </summary>
        /// <param name="map"></param>
        /// <returns></returns>
        public int QueryCount(Hashtable map)
        {
            return QueryCount(map, "QueryFavoriteScriptCount");
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
            return QueryList(map, "QueryFavoriteScriptList", start, paseSize);
        }
        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public object Update(object obj)
        {
            return Update(obj, "UpdateFavoriteScript");
        }

        #endregion
    }
}
