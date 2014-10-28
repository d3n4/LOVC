using System;

namespace LOVC
{
    public class VKClient
    {
        protected HttpClient client = new HttpClient();

        public VKClient(string access_token)
        {

        }

        public static T API<T>(string method, string args)
        {
            try
            {

            } catch {
            }
            return default(T);
        }
    }
}

