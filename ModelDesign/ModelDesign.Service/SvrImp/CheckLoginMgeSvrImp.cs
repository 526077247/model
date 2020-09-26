using Account.Service;
using service.core;

using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    public class CheckLoginMgeSvr:ICheckLoginMgeSvr
    {
        private readonly ISessionMgeSvr _SessionMgeSvr = null;
        public CheckLoginMgeSvr() : base()
        {
            _SessionMgeSvr = ServiceManager.GetService<ISessionMgeSvr>("SessionMgeSvr");
        }

        public bool CheckLogin(string token)
        {
            var res = _SessionMgeSvr.Get(token);
            return !string.IsNullOrEmpty(res.Token);
        }
    }
}
