using service.core;
using sso.service;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    public class CheckLoginMgeSvr:ICheckLoginMgeSvr
    {
        private readonly ILoginMgeSvr _LoginMgeSvr = null;
        public CheckLoginMgeSvr() : base()
        {
            _LoginMgeSvr = ServiceManager.GetService<ILoginMgeSvr>("LoginMgeSvr");
        }

        public bool CheckLogin(string token)
        {
            var res = _LoginMgeSvr.GetLoginInfo(token);
            return !string.IsNullOrEmpty(res.Token);
        }
    }
}
