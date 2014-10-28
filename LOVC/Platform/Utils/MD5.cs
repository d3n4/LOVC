using System;
using System.Text;
using System.Security.Cryptography;

namespace LOVC
{
    public static class MD5
    {
        public static string Encode(string input)
        {
            var result = string.Empty;
            foreach (var b in new MD5CryptoServiceProvider().ComputeHash(Encoding.Default.GetBytes(input)))
                result += b.ToString("X2").ToLower();
            return result;
        }
    }
}

