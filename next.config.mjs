/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "zdumabzfaygdbxnucjib.supabase.co" },
      { hostname: "t1.kakaocdn.net" },
      { hostname: "k.kakaocdn.net" },
      { hostname: "img1.kakaocdn.net" },
    ],
  },
};

export default nextConfig;
