using System;

namespace LOVC
{
    public class Vector3
    {
        public static readonly Vector3 Zero = new Vector3();

        public int x = 0, y = 0, z = 0;

        public Vector3()
        {
        }

        public Vector3(int x, int y)
        {
            this.x = y;
            this.y = y;
        }

        public Vector3(int x, int y, int z)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
}

