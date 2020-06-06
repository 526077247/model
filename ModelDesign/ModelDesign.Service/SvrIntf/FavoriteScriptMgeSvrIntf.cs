using service.core;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{

    public interface IFavoriteScriptMgeSvr: IAppServiceBase
    {
        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="token"></param>
        /// <param name="scriptId"></param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        FavoriteScript Add(string token, string scriptId);
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="token"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        int Delete(string token, string id);
        /// <summary>
        /// 查询列表
        /// </summary>
        /// <param name="token"></param>
        /// <param name="start"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        ResultList<FavoriteScript> QueryList(string token,int start, int pageSize);
    }
}
