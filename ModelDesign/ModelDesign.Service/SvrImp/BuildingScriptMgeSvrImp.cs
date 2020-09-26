using Account.Service;
using IBatisNet.DataAccess;
using service.core;

using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace ModelDesign.Service
{
    /// <summary>
    /// 脚本管理服务
    /// </summary>
    public class BuildingScriptMgeSvr : AppServiceBase, IBuildingScriptMgeSvr
    {
        #region 服务描述：脚本管理服务

        private readonly ISessionMgeSvr _SessionMgeSvr = null;
        private readonly IDaoManager daoManager = null;
        private readonly IBuildingScriptDao _BuildingScriptDao = null;
        private readonly IFavoriteScriptDao _FavoriteScriptDao = null;
        private readonly string _ScriptsPath = ConfigurationManager.Configuration.GetSection("scriptsPath").Value;
        public BuildingScriptMgeSvr() : base()
        {
            _SessionMgeSvr = ServiceManager.GetService<ISessionMgeSvr>();
            daoManager = ServiceConfig.GetInstance().DaoManager;
            _BuildingScriptDao = (IBuildingScriptDao)daoManager.GetDao(typeof(IBuildingScriptDao));
            _FavoriteScriptDao = (IFavoriteScriptDao)daoManager.GetDao(typeof(IFavoriteScriptDao));
        }

        #endregion


        #region IBuildingScriptMgeSvr函数

        /// <summary>
        /// 创建脚本
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="buildingScript">脚本内容</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        public BuildingScript Create(string token, BuildingScript buildingScript)
        {
            buildingScript.id = Guid.NewGuid().ToString();
            buildingScript.createTime = DateTime.Now;
            buildingScript.userId = _SessionMgeSvr.Get(token).Name;
            _BuildingScriptDao.Insert(buildingScript);
            SaveJsFile(buildingScript);
            FavoriteScript script = new FavoriteScript();
            script.id = Guid.NewGuid().ToString();
            script.addTime = DateTime.Now;
            script.scriptId = buildingScript.id;
            script.userId = _SessionMgeSvr.Get(token).Name;
            _FavoriteScriptDao.Insert(script);
            return buildingScript;
        }



        /// <summary>
        /// 修改脚本
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">脚本标识</param>
        /// <param name="buildingScript">脚本内容</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        public BuildingScript Update(string token, string id, BuildingScript buildingScript)
        {
            BuildingScript oldBuildingScript = Get(token, id);
            if (oldBuildingScript?.userId != _SessionMgeSvr.Get(token).Name)
                throw new ServiceException((int)TYPE_OF_RESULT_TYPE.failure, "无权限");
            buildingScript.createTime = oldBuildingScript.createTime;
            buildingScript.id = oldBuildingScript.id;
            buildingScript.userId = oldBuildingScript.userId;
            SaveJsFile(buildingScript);
            _BuildingScriptDao.Update(buildingScript);
            return buildingScript;
        }
        /// <summary>
        /// 删除脚本
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">脚本标识</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        public int Delete(string token, string id)
        {
            BuildingScript oldBuildingScript = Get(token, id);
            if (oldBuildingScript?.userId != _SessionMgeSvr.Get(token).Name)
                throw new ServiceException((int)TYPE_OF_RESULT_TYPE.failure, "无权限");
            File.Delete($"{_ScriptsPath}/{oldBuildingScript.id}.js");
            return _BuildingScriptDao.Delete(oldBuildingScript);
        }
        /// <summary>
        /// 获取脚本
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <param name="id">脚本标识</param>
        /// <returns></returns>
        [PublishMethod]
        public BuildingScript Get(string token, string id)
        {
            BuildingScript buildingScript = new BuildingScript { id = id };
            buildingScript = _BuildingScriptDao.Get(buildingScript) as BuildingScript;
            if (buildingScript == null)
                throw new ServiceException((int)TYPE_OF_RESULT_TYPE.failure, "指定id不存在");
            if (!(buildingScript.state == (int)TYPE_BUILDINGSCRIPT_STATE.PUBLIC || buildingScript?.userId == _SessionMgeSvr.Get(token).Name))
                throw new ServiceException((int)TYPE_OF_RESULT_TYPE.failure, "无权限");
            string content = File.ReadAllText($"{_ScriptsPath}/{buildingScript.id}.js");
            buildingScript.content = content.Split("//---")[0];
            return buildingScript;
        }
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
        public ResultList<BuildingScript> QueryList(string token, string typeIN, int start, int pageSize, string createTimeS = "1900-01-01T00:00:00", string createTimeE = "2099-12-31T00:00:00")
        {
            ResultList<BuildingScript> result = new ResultList<BuildingScript>();
            Hashtable para = new Hashtable
            {
                { "state_IN", (int)TYPE_BUILDINGSCRIPT_STATE.PUBLIC },
                { "type_IN" , typeIN },
                { "createTime_S", createTimeS.TimeFormat() },
                { "createTime_E", createTimeE.TimeFormat() },
                { "_OrderBy", "createTime_D" }
            };
            result.total = _BuildingScriptDao.QueryCount(para);
            result.pageSize = pageSize > 20 ? 20 : pageSize;
            result.start = start;
            var list = _BuildingScriptDao.QueryList(para, start, pageSize);
            if (list != null)
            {
                foreach (BuildingScript item in list)
                {
                    result.list.Add(item);
                }
            }
            return result;
        }
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
        public ResultList<BuildingScript> QueryMyList(string token, string typeIN, int start, int pageSize, string createTimeS = "1900-01-01T00:00:00", string createTimeE = "2099-12-31T00:00:00")
        {
            ResultList<BuildingScript> result = new ResultList<BuildingScript>();
            Hashtable para = new Hashtable
            {
                { "userId",_SessionMgeSvr.Get(token).Name},
                { "type_IN" , typeIN },
                { "createTime_S", createTimeS.TimeFormat() },
                { "createTime_E", createTimeE.TimeFormat() },
                { "_OrderBy", "createTime_D" }
            };
            result.total = _BuildingScriptDao.QueryCount(para);
            result.pageSize = pageSize > 20 ? 20 : pageSize;
            result.start = start;
            var list = _BuildingScriptDao.QueryList(para, start, pageSize);
            if (list != null)
            {
                foreach (BuildingScript item in list)
                {
                    result.list.Add(item);
                }
            }
            return result;
        }
        /// <summary>
        /// 查询可用脚本列表
        /// </summary>
        /// <param name="token">会话标识</param>
        /// <returns></returns>
        [CheckLogin]
        [PublishMethod]
        public List<BuildingScript> QueryFavoriteList(string token)
        {
            Hashtable para1 = new Hashtable
            {
                { "userId",_SessionMgeSvr.Get(token).Name}
            };
            var list1 = _FavoriteScriptDao.QueryList(para1, 0, -1);
            string ids = "";
            if (list1 != null)
            {
                foreach (FavoriteScript item in list1)
                {
                    ids += "'"+item.scriptId + "',";
                }
                ids = ids[0..^1];
            }
            else
            {
                return new List<BuildingScript>();
            }
            List<BuildingScript> result = new List<BuildingScript>();
            Hashtable para2 = new Hashtable
            {
                { "id_IN",ids},
                { "state_IN", (int)TYPE_BUILDINGSCRIPT_STATE.PUBLIC },
                { "_OrderBy", "createTime_D" }
            };
            var list2 = _BuildingScriptDao.QueryList(para2, 0, -1);
            if (list2 != null)
            {
                foreach (BuildingScript item in list2)
                {
                    result.Add(item);
                }
            }
            return result;
        }

        #endregion

        #region 私有方法


        /// <summary>
        /// 保存js文件
        /// </summary>
        /// <param name="buildingScript"></param>
        private void SaveJsFile(BuildingScript buildingScript)
        {
            if (buildingScript.content.Contains("require"))
            {
                throw new ServiceException((int)TYPE_OF_RESULT_TYPE.failure, "禁止操作");
            }
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(buildingScript.content); // 写入
            sb.AppendLine("//---");
            sb.AppendLine("module.exports = {");
            sb.AppendLine("    createContent");
            sb.AppendLine("}");
            if (!File.Exists($"{_ScriptsPath}/{buildingScript.id}.js"))
            {
                FileStream fs = new FileStream($"{_ScriptsPath}/{buildingScript.id}.js", FileMode.OpenOrCreate, FileAccess.ReadWrite); //可以指定盘符，也可以指定任意文件名，还可以为word等文件
                fs.Write(Encoding.Default.GetBytes(sb.ToString()));
                fs.Close();
            }
            else
            {
                File.WriteAllText($"{_ScriptsPath}/{buildingScript.id}.js", sb.ToString());
            }
        }

        #endregion

    }
}
