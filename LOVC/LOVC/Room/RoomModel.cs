using System;
using System.IO;
using System.Collections.Generic;

namespace LOVC
{
    public class RoomModel
    {
        protected int[][][] model;
        public Vector3 spawn { get; protected set; }
        public string map;

        public RoomModel()
        {

        }

        public RoomModel(string modelObject)
        {
            load(modelObject);
        }

        public int this[int layer, int x, int y]{
            get {
                try
                {
                    return model[layer][x][y];
                } catch (Exception ex) {
#if DEBUG
                    Console.WriteLine(ex);
#endif
                }
                return (int)LocationType.Invalid;
            }

            set { 
                try
                {
                    model[layer][x][y] = value;
                } catch (Exception ex) {
                    #if DEBUG
                    Console.WriteLine(ex);
                    #endif
                }
            }
        }

        public void regenerate()
        {
            map = fastJSON.JSON.Instance.ToJSON(model);
        }

        public static RoomModel loadFrom(string name)
        {
            var file = Environment.CurrentDirectory + "/Gamedata/Rooms/" + name + ".map";
            RoomModel roomModel = null;
            if(File.Exists(file))
                roomModel = new RoomModel(File.ReadAllText(file));
            return roomModel;
        }

        public RoomModel load(string modelObject)
        {
            var lines = modelObject.Replace("\r", "").Split('\n');
            int layerId = 0, layers = 1, vertical = 0, horisontal = 0, y = 0;
            for (var lineId = 0; lineId < lines.Length; lineId++)
            {
                var line = lines [lineId].Trim();
                if (layers == 1 && vertical == 0)
                    horisontal = line.Split(' ').Length;
                if (layers == 1)
                    vertical++;
                if (line.Length <= 0)
                    layers++;
            }
            model = new int[layers][][];
            for (var l = 0; l < layers; l++)
            {
                model [l] = new int[horisontal][];
                for(var h = 0; h < horisontal; h++)
                    model[l][h] = new int[vertical];
            }
            for (var lineId = 0; lineId < lines.Length; lineId++)
            {
                var line = lines[lineId].Trim();
                if (line.Length <= 0)
                {
                    y = 0;
                    layerId++;
                    continue;
                }
                var locs = line.Split(' ');
                for (var x = 0; x < horisontal; x++)
                {
                    var loc = Convert.ToInt32(locs[x]);
                    if (loc == (int)LocationType.Spawn)
                        spawn = new Vector3(x, y, 0);
                    model [layerId] [x] [y] = loc;
                }
                y++;
            }
            regenerate();
            return this;
        }
    }
}

