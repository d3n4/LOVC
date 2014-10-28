using System;

namespace LOVC
{
    public class Vector2
    {
        public static readonly Vector2 Zero = new Vector2();

        public int x = 0, y = 0;

        public Vector2()
        {
        }

        public Vector2(int x, int y)
        {
            this.x = y;
            this.y = y;
        }
    }
}

