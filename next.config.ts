import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    reactCompiler: true,
  },
  serverExternalPackages: ["socket.io-client"],
  // Allow LAN access from other computers on office Wi-Fi / Ethernet
  // @ts-ignore
  allowedDevOrigins: [
    "192.168.1.100",
    "192.168.1.100:3000",
    "10.8.0.5",
    "10.8.0.5:3000",
    "localhost:3000",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "/apis/:path*",
    },
  ],
};

export default withNextIntl(nextConfig);
