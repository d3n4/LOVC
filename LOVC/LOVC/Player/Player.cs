using System;

namespace LOVC
{
    public class Player
    {
        public string name { get; set; }
        public int id { get; set; }
        public GameService connection { get; set; }
        public Vector3 position = new Vector3();
        protected Room _room = null;
        public VKClient VKCli;
        public Room room 
        {
            get
            {
                return _room;
            }

            set
            {
                if(_room != null)
                    _room.Leave(this);
                value.Join(this, _room);
                _room = value;
            }
        }

        public void Initialize()
        {
            connection.Invoke("Initialize", id);
            Console.WriteLine(room);
            // room.Join(this);
        }

        /*public void move(int x, int y){
            // position.x = x;
            // position.y = y;
            foreach (var player in room.players)
                connection.Invoke("PlayerMove", player.Value.id, x, y);
        }

        public void Spawn(Vector3 Position)
        {
            this.position = Position;
            foreach (var player in room.players)
                if(player.Value.id != id)
                    player.Value.connection.Invoke("PlayerSpawn", id, name, position);

            foreach (var player in room.players)
                if(player.Value.id != id)
                    connection.Invoke("PlayerSpawn", player.Value.id, player.Value.name, player.Value.position);
        }*/
    }
}

