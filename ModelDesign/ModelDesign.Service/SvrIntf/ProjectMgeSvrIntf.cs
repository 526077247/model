using service.core;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    /// <summary>
    /// 项目管理服务
    /// </summary>
    public interface IProjectMgeSvr : IAppServiceBase
    {
        /// <summary>
        /// 创建项目
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="project">项目详情</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        Project Create(string token, Project project);

        /// <summary>
        /// 获取项目
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">项目标识</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        Project Get(string token, string id);

        /// <summary>
        /// 修改项目
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">项目标识</param>
        /// <param name="project">项目详情</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        Project Update(string token, string id, Project project);

        /// <summary>
        /// 删除项目
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">项目标识</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        int Delete(string token, string id);

        /// <summary>
        /// 查询列表
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="state_IN">状态（多个逗号隔开）</param>
        /// <param name="start">起始位置</param>
        /// <param name="pageSize">分页大小</param>
        /// <param name="createTimeS">创建时间起</param>
        /// <param name="createTimeE">创建时间止</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        ResultList<Project> QueryList(string token, string state_IN, int start, int pageSize, string createTimeS = "1900-01-01T00:00:00", string createTimeE = "2099-12-31T00:00:00");


    }
}
