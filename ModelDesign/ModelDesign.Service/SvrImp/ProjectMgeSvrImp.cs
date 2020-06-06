using IBatisNet.DataAccess;
using service.core;
using service.core;
using sso.service;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    public class ProjectMgeSvr : AppServiceBase, IProjectMgeSvr
    {
        #region 服务描述：项目管理服务
        private readonly ILoginMgeSvr _LoginMgeSvr = null;
        private readonly IDaoManager daoManager = null;
        private readonly IProjectDao _ProjectDao = null;
        /// <summary>
        /// 构造函数
        /// </summary>
        public ProjectMgeSvr() : base()
        {
            _LoginMgeSvr = DynServerFactory.CreateServer<ILoginMgeSvr>("http://47.98.50.215/Service/LoginMgeSvr.assx");
            daoManager = ServiceConfig.GetInstance().DaoManager;
            _ProjectDao = (IProjectDao)daoManager.GetDao(typeof(IProjectDao));
        }
        #endregion

        #region IProjectMgeSvr函数
        /// <summary>
        /// 创建项目
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="project">项目详情</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        public Project Create(string token, Project project)
        {
            project.id = Guid.NewGuid().ToString();
            project.createTime = DateTime.Now;
            project.userId = _LoginMgeSvr.GetLoginInfo(token).Name;
            if (project.domains == null)
                project.domains = new DataList<Domain>();
            if (project.scripts == null)
                project.scripts = new DataList<Script>();
            _ProjectDao.Insert(project);
            return project;
        }

        /// <summary>
        /// 获取项目
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">项目标识</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        public Project Get(string token, string id)
        {
            Project project = new Project { id = id };
            project = _ProjectDao.Get(project) as Project;
            if (project == null)
                return new Project();
            if (project.userId != _LoginMgeSvr.GetLoginInfo(token).Name)
                throw new Exception("无权限");
            return project;
        }

        /// <summary>
        /// 修改项目
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">项目标识</param>
        /// <param name="project">项目详情</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        public Project Update(string token, string id, Project project)
        {
            Project oldProject = Get(token, id);
            if (string.IsNullOrEmpty(oldProject.id))
                throw new Exception("该项目不存在");
            project.createTime = oldProject.createTime;
            project.id = oldProject.id;
            project.userId = oldProject.userId;
            if (project.domains == null)
                project.domains = new DataList<Domain>();
            if (project.scripts == null)
                project.scripts = new DataList<Script>();
            _ProjectDao.Update(project);
            return project;
        }

        /// <summary>
        /// 删除项目
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">项目标识</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        public int Delete(string token, string id)
        {
            Project oldProject = Get(token, id);
            return _ProjectDao.Delete(oldProject);
        }

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
        public ResultList<Project> QueryList(string token, string state_IN, int start, int pageSize, string createTimeS = "1900-01-01T00:00:00", string createTimeE = "2099-12-31T00:00:00")
        {
            ResultList<Project> result = new ResultList<Project>();
            Hashtable para = new Hashtable
            {
                { "createTime_S", createTimeS.TimeFormat() },
                { "createTime_E", createTimeE.TimeFormat() },
                { "_OrderBy", "createTime_D" },
                { "userId" , _LoginMgeSvr.GetLoginInfo(token).Name}
            };
            if (!string.IsNullOrEmpty(state_IN))
            {
                para.Add("state_IN", state_IN);
            }
            result.total = _ProjectDao.QueryCount(para);
            result.pageSize = pageSize > 20 ? 20 : pageSize;
            result.start = start;
            var list = _ProjectDao.QueryList(para, start, pageSize);
            if (list != null)
            {
                foreach (Project item in list)
                {
                    result.list.Add(item);
                }
            }
            return result;
        }


       

        
        #endregion


    }


}
