using service.core;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using IBatisNet.DataAccess.Interfaces;

namespace ModelDesign.Service
{
    public interface IProjectDao : IBaseDao, IDao
    {

    }

    public class ProjectDao : BaseDao, IProjectDao
    {
        #region IProjectDao函数

        #endregion

        #region IDao函数
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public int Delete(object obj)
        {
            return Delete(obj, "DeleteProject");
        }
        /// <summary>
        /// 取
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public object Get(object obj)
        {
            if (!(Get(obj, "GetProject") is Project project))
                return null;
            return project;
        }
        /// <summary>
        /// 条件取
        /// </summary>
        /// <param name="para"></param>
        /// <returns></returns>
        public object GetByPara(Hashtable para)
        {
            if (!(Get(para, "GetProjectByPara") is Project project))
                return null;
            return project;
        }
        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public object Insert(object obj)
        {
            return Insert(obj, "InsertProject");
        }
        /// <summary>
        /// 条件查数量
        /// </summary>
        /// <param name="map"></param>
        /// <returns></returns>
        public int QueryCount(Hashtable map)
        {
            return QueryCount(map, "QueryProjectCount");
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
            return QueryList(map, "QueryProjectList", start, paseSize);
        }
        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public object Update(object obj)
        {
            return Update(obj, "UpdateProject");
        }

        #endregion
    }
}
