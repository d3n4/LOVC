using System;
using System.Collections.Generic;

namespace LOVC
{
    public static class RoomManager
    {
        public static Dictionary<string, Room> rooms = new Dictionary<string, Room>();
        public static Room lobby { get; set; }
        public static Room createRoom(string id, string model, int owner)
        {
            var r = new Room(model) { info = new RoomInfo(){ id = id, name = id, owner = owner, count = 0, capacity = 200 } };
            rooms.Add( id, r );
            return r;
        }

        public static Room Get(string id)
        {
            if (rooms.ContainsKey(id))
                return rooms [id];
            return null;
        }
    }
}

