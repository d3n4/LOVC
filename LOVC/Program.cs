using System;
using System.Text;
using WebSocketSharp;
using WebSocketSharp.Net;
using WebSocketSharp.Server;

namespace LOVC {
    class MainClass {
        private static HttpServer _httpsv;
        public static void Main(string[] args){
            // Main spawn room for all
            RoomManager.lobby = RoomManager.createRoom("lobby", "model1", 12075682);
            // additional rooms
            RoomManager.createRoom("test", "model2", 12075682);
            RoomManager.createRoom("ЗБТ комната", "model4", 12075682);
            RoomManager.createRoom("GamesHumor :D", "model3", 12075682);

            // http server
            _httpsv = new HttpServer(7172);
            _httpsv.OnGet += (sender, e) => OnGet(e);
            _httpsv.OnError += (sender, e) => Console.WriteLine(e.Message);

            _httpsv.AddWebSocketService<GameService>("/Game");

            //var socket = new WebSocketServer(IPAddress.Any, 7421);
            //socket.AddWebSocketService<GameService>("/Game");
            //socket.Start();
            _httpsv.Start();
            Console.ReadLine();
            _httpsv.Stop();
            //socket.Stop();
        }

        private static byte[] GetContent(string path)
        {
            path = path.Split('?')[0];
            if (path == "/")
                path += "index.html";
            return _httpsv.GetFile("./htdocs/"+path);
        }

        private static void OnGet(HttpRequestEventArgs eventArgs)
        {
            var request  = eventArgs.Request;
            var response = eventArgs.Response;
            response.ContentEncoding = Encoding.UTF8;
            var content  = GetContent(request.RawUrl);
            if (content != null)
            {
                response.WriteContent(content);
                return;
            }

            response.StatusCode = (int)HttpStatusCode.NotFound;
        }
    }
}