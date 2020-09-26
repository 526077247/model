using Account.Service;
using IBatisNet.DataAccess;
using service.core;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{

    public class FavoriteScriptMgeSvr : AppServiceBase, IFavoriteScriptMgeSvr
    {
        private readonly ISessionMgeSvr _SessionMgeSvr = null;
        private readonly IDaoManager daoManager = null;
        private readonly IFavoriteScriptDao _FavoriteScriptDao = null;
        #region 服务定义
        /// <summary>
        /// 构造函数
        /// </summary>
        public FavoriteScriptMgeSvr() : base()
        {
            _SessionMgeSvr = ServiceManager.GetService<ISessionMgeSvr>();
            daoManager = ServiceConfig.GetInstance().DaoManager;
            _FavoriteScriptDao = (IFavoriteScriptDao)daoManager.GetDao(typeof(IFavoriteScriptDao));
        }
        #endregion
        #region IFavoriteScriptMgeSvr函数

        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="token"></param>
        /// <param name="scriptId"></param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        public FavoriteScript Add(string token, string scriptId)
        {
            FavoriteScript script = new FavoriteScript();
            script.id = Guid.NewGuid().ToString();
            script.addTime = DateTime.Now;
            script.scriptId = scriptId;
            script.userId =_SessionMgeSvr.Get(token).Name;
            _FavoriteScriptDao.Insert(script);
            return script;
        }
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="token"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        public int Delete(string token, string id)
        {
            if (_FavoriteScriptDao.Get(new FavoriteScript { id = id }) is FavoriteScript script &&_SessionMgeSvr.Get(token).Name == script.userId)
                return _FavoriteScriptDao.Delete(script);
            else
                throw new ServiceException((int)TYPE_OF_RESULT_TYPE.failure, "无权限");
        }
        /// <summary>
        /// 查询列表
        /// </summary>
        /// <param name="token"></param>
        /// <param name="start"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        public ResultList<FavoriteScript> QueryList(string token, int start, int pageSize)
        {
            ResultList<FavoriteScript> result = new ResultList<FavoriteScript>();
            Hashtable para = new Hashtable
            {
                { "userId",_SessionMgeSvr.Get(token).Name},
                { "_OrderBy", "addTime_D" }
            };
            result.total = _FavoriteScriptDao.QueryCount(para);
            result.pageSize = pageSize > 20 ? 20 : pageSize;
            result.start = start;
            var list = _FavoriteScriptDao.QueryList(para, start, pageSize);
            if (list != null)
            {
                foreach (FavoriteScript item in list)
                {
                    result.list.Add(item);
                }
            }
            return result;
        }
        #endregion
    }
}
