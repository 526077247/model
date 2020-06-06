using service.core;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    /// <summary>
    /// 脚本管理服务
    /// </summary>
    public interface IBuildingScriptMgeSvr : IAppServiceBase
    {
        /// <summary>
        /// 创建脚本
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="buildingScript">脚本内容</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        BuildingScript Create(string token, BuildingScript buildingScript);
        /// <summary>
        /// 修改脚本
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">脚本标识</param>
        /// <param name="buildingScript">脚本内容</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        BuildingScript Update(string token,string id, BuildingScript buildingScript);
        /// <summary>
        /// 删除脚本
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">脚本标识</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        int Delete(string token, string id);
        /// <summary>
        /// 获取脚本
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">脚本标识</param>
        /// <returns></returns>
        [PublishMethod]
        BuildingScript Get(string token, string id);
        /// <summary>
        /// 查询脚本列表
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="typeIN">类型（多个逗号分隔）</param>
        /// <param name="start">起始位置</param>
        /// <param name="pageSize">分页大小</param>
        /// <param name="createTimeS">创建时间起</param>
        /// <param name="createTimeE">创建时间止</param>
        /// <returns></returns>
        [PublishMethod]
        ResultList<BuildingScript> QueryList(string token, string typeIN, int start, int pageSize, string createTimeS = "1900-01-01T00:00:00", string createTimeE = "2099-12-31T00:00:00");
        /// <summary>
        /// 查询脚本列表
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="typeIN">类型（多个逗号分隔）</param>
        /// <param name="start">起始位置</param>
        /// <param name="pageSize">分页大小</param>
        /// <param name="createTimeS">创建时间起</param>
        /// <param name="createTimeE">创建时间止</param>
        /// <returns></returns>
        [PublishMethod]
        ResultList<BuildingScript> QueryMyList(string token, string typeIN, int start, int pageSize, string createTimeS = "1900-01-01T00:00:00", string createTimeE = "2099-12-31T00:00:00");
        /// <summary>
        /// 查询可用脚本列表
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        List<BuildingScript> QueryFavoriteList(string token);
    }
}
