using System;
using System.Collections.Generic;
using System.Text;

namespace ModelDesign.Service
{
    public enum TYPE_BUILDINGSCRIPT_STATE
    {
        PUBLIC = 0,
        PRIVATE = 1,
    }


    public static class TimeFormatHelper
    {
        /// <summary>
        /// 格式化时间
        /// </summary>
        /// <param name="createTimeS"></param>
        /// <returns></returns>
        public static string TimeFormat(this string createTimeS)
        {
            return DateTime.Parse(createTimeS).ToString("yyyy-MM-ddTHH:mm:ss");
        }
    }
}
