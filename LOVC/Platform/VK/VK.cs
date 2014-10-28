using System;
using System.Collections.Generic;

namespace LOVC
{
    public class VK
    {
        private static int AppId = 0;
        private static string AppSecret = "";
        public static bool Authenticate(int viewer_id, string auth_key)
        {
            return MD5.Encode(AppId + "_" + viewer_id + "_" + AppSecret) == auth_key;
        }
        public static UserInfo getInfo(int id)
        {
            try
            {
                var client = new HttpClient();
                var json = client.Get("https://api.vk.com/method/users.get?uid=" + id);
                var uinfo = fastJSON.JSON.Instance.ToObject<Response<List<UserInfo>>>(json);
                client = null;
                return uinfo.response[0];
            } catch(Exception ex) {
                Console.WriteLine(ex);
            }
            return default(UserInfo);
        }
    }
}

