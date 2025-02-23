/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "zdumabzfaygdbxnucjib.supabase.co" },
      { hostname: "t1.kakaocdn.net" },
      { hostname: "k.kakaocdn.net" },
      { hostname: "img1.kakaocdn.net" },
      { hostname: "pbs.twimg.com" },
      { hostname: "abs.twimg.com" },
      { hostname: "d15f34w2p8l1cc.cloudfront.net" },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
