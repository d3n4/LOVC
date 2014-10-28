using System;
using System.Collections;
using System.Collections.Generic;

using WebSocketSharp;

namespace LOVC
{
    public class GameService : NetService
    {
        public static Players players = new Players();
        protected Player player;
        protected bool authenticated = false;

        protected override void connect()
        {
            try
            {
                var id = DateTime.Now.Millisecond;
                var auth_key = "empty";
                authenticated = true;

                /* Real authentication for VK social
                var id = Convert.ToInt32(Query("viewer_id"));
                var auth_key = Query("auth_key");
                VK.Authenticate(id, auth_key);
                */


                if (authenticated)
                {
                    if (players.ContainsKey(id))
                    {
                        players [id].connection.Kick("You already connected from other window");
                        players.Remove(id);
                    }
                    var info = VK.getInfo(id);
                    player = new Player(){ connection = this, id = Convert.ToInt32(id), name = info.first_name, room = RoomManager.lobby };
                    player.Initialize();
                    players.Add(player.id, player);
                    return;
                }
                Kick("Invalid auth key");
            } catch (Exception e)
            {
                Console.WriteLine("[GameService:Exception] " + e);
            }

            Kick("Invalid identifier");
        }

        protected override void disconnect(CloseEventArgs e)
        {
            if (authenticated)
            {
                player.room.Leave(player, LeaveReason.Disconnect);
                players.Remove(player.id);
            }
        }

        [NetAccessible]
        public void GetRooms()
        {
            var list = new List<RoomInfo>();
            foreach (var room in RoomManager.rooms)
                list.Add(room.Value.info);
            Invoke("RoomList", list);
            list.Clear();
            list = null;
        }

        [NetAccessible]
        public void PlayerSay(string message, int mode){
            player.room.Chat(player, message, (SayMode)mode);
        }

        [NetAccessible]
        public void gotoRoom(string roomId)
        {
            var room = RoomManager.Get(roomId);
            if (room != null)
                player.room = room;
        }

        [NetAccessible]
        public void playerMove(int x, int y){
            Console.WriteLine("MOVE PLAYER TO: {0}x{1}", x, y);
            player.room.Move(player, x,y);
        }

        [NetAccessible]
        public void onlines(){
            Console.WriteLine("Onlines called");
            Invoke("count", players.Count);
        }
    }
}

