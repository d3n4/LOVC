using System;
using System.Collections.Generic;
using System.IO;

using fastJSON;

namespace LOVC
{
    public class Room
    {
        public RoomInfo info;
        public Vector3 spawn
        {
            get {
                if (model != null)
                if (model.spawn != null)
                    return model.spawn;
                return Vector3.Zero;
            }
            set { }
        }
        public List<string> moderators = new List<string>();
        public Players players = new Players();

        public RoomModel model;

        public Room()
        {

        }

        public Room(string modelName)
        {
            loadModel(modelName);
        }

        public Room loadModel(string name)
        {
            model = RoomModel.loadFrom(name);
            return this;
        }

        public virtual void Move(Player player, int x, int y)
        {
            player.position.x = x;
            player.position.y = y;

            foreach (var pl in players)
                if(pl.Value.id != player.id)
                    pl.Value.connection.Invoke("PlayerMove", player.id, x, y);
        }

        public virtual void Chat(Player player, string message, SayMode mode)
        {
            Console.WriteLine("Player {0} say {1} ({2})", player.name, message, mode);
            if ((message.StartsWith("/") || message.StartsWith("!")) && message.Length > 1)
            {
                Command(player, message.Substring(1).Split(new[]{' '}, 2), mode);
                return;
            }
            foreach (var pl in players)
            if(pl.Value.id != player.id)
                pl.Value.connection.Invoke("PlayerSay", player.id, message, mode);
        }

        public virtual void Command(Player player, string[] command, SayMode mode = SayMode.Normal)
        {
            if (command[0].ToLower() == "me" && command.Length > 1)
            {
                foreach (var pl in players)
                    if(pl.Value.id != player.id)
                        pl.Value.connection.Invoke("PlayerSay", player.id, command[1], SayMode.Action);
            }
        }

        public virtual void Join(Player player, Room fromRoom = null)
        {
            info.count++;
            players [player.id] = player;

            player.connection.Invoke("RoomJoin", info.id, model.map, model.spawn);

            player.position.x = spawn.x;
            player.position.y = spawn.y;


            foreach (var pl in players)
                if(pl.Value.id != player.id)
                    pl.Value.connection.Invoke("PlayerSpawn", player.id, player.name, spawn);

            foreach (var pl in players)
                if(pl.Value.id != player.id)
                    player.connection.Invoke("PlayerSpawn", pl.Value.id, pl.Value.name, pl.Value.position);

            Console.WriteLine("Player {0} join to room {1} from {2}", player.name, info.name, fromRoom != null ? fromRoom.info.name : "black hole");
        }

        public virtual void Leave(Player player, LeaveReason reason = LeaveReason.SwitchRoom)
        {
            info.count--;
            if(players.ContainsKey(player.id))
                players.Remove(player.id);
            Console.WriteLine("Player " + player.id + " leave " + info.name);
            foreach (var pl in players)
            {
                pl.Value.connection.Invoke("PlayerDestroy", player.id);
                player.connection.Invoke("PlayerDestroy", pl.Value.id);
                player = null;
            }
            // InvokeGlobal("playerDestroy", player.id);
        }
    }
}

