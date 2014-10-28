using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace LOVC
{
    public class HttpClient
    {
        public string ClientName = "LOVC Server Wrapper";
        private readonly CookieContainer _cookies = new CookieContainer();
        public string Post(string address){
            return Post (address, "");
        }
        public string Post(string address, string data)
        {
            ServicePointManager.Expect100Continue = false;
            var result = "";
            var request = (HttpWebRequest)WebRequest.Create(address);
            request.CookieContainer = _cookies;
            request.Method = "POST";
            request.UserAgent = ClientName;
            request.ContentType = "application/x-www-form-urlencoded";
            using (Stream requestStream = request.GetRequestStream())
                using (StreamWriter writer = new StreamWriter(requestStream))
            {
                writer.Write(data);
            }
            using (var responseStream = request.GetResponse().GetResponseStream())
                if (responseStream != null)
                    using (var reader = new StreamReader(responseStream))
                        result = reader.ReadToEnd();
            request = null;
            return result;
        }

        public string Get(string address)
        {
            ServicePointManager.Expect100Continue = false;
            var result = "";
            var request = (HttpWebRequest)WebRequest.Create(address);
            request.CookieContainer = _cookies;
            request.Method = "GET";
            request.UserAgent = ClientName;
            using (var responseStream = request.GetResponse().GetResponseStream())
                if (responseStream != null)
                    using (var reader = new StreamReader(responseStream))
                        result = reader.ReadToEnd();
            request = null;
            return result;
        }
    }
}
