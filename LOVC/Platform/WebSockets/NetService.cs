using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Reflection;

using WebSocketSharp;
using WebSocketSharp.Server;

using fastJSON;

namespace LOVC
{
    public class NetService : WebSocketService
    {
        protected virtual void connect(){}
        protected virtual void disconnect(CloseEventArgs e){}

        protected override void OnOpen()
        {
            this.connect();
        }

        protected override void OnClose(CloseEventArgs e)
        {
            this.disconnect(e);
        }

        protected void Kick(string reason = "No reason")
        {
            Invoke("Kick", reason);
            Stop();
        }

        protected string Query(string key){
            if (QueryString.Contains(key))
                return QueryString [key];
            return null;
        }

        protected string Invoke_package(string function, object[] args)
        {
            var Packet = new InvokePackage()
            {
                function = function,
                args = args
            };
            return JSON.Instance.ToJSON(Packet);
        }

        public void Invoke(string function, params object[] args)
        {
            Send(Invoke_package(function, args));
        }

        public void InvokeGlobal(string function, params object[] args)
        {
            Broadcast(Invoke_package(function, args));
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            try {
                var packet = JSON.Instance.ToObject<InvokePackage>(e.Data);
                trigger(packet.function, packet.args);
            } catch (Exception ex) {
                Console.WriteLine(ex);
            }
        }

        protected void trigger(string function, object[] args)
        {
            try
            {
                var methodInfo = GetType().GetMethod(function);
                if(methodInfo == null)
                    return;
                var safe = false;
                foreach(Object attr in methodInfo.GetCustomAttributes(false))
                    if(attr.GetType().Name == "NetAccessible")
                        safe = true;
                if(!safe)
                    return;
                var paramsInfo = methodInfo.GetParameters();
                object[] @params = new object[paramsInfo.Length];
                for(var i = 0; i < paramsInfo.Length; i++)
                    if (args.Length > i)
                        @params [i] = JSON.Instance.ToObject((string)args[i], paramsInfo[i].ParameterType);
                else
                    if(!Convert.IsDBNull(paramsInfo[i].DefaultValue))
                        @params [i] = paramsInfo[i].DefaultValue;
                    else
                        return;
                methodInfo.Invoke(this, @params);
            } catch (Exception ex) {
                Console.WriteLine(ex);
            }
        }
    }
}

