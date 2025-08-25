import type { NextConfig } from "next";


const withPWA = require("next-pwa")({
  dest: "public"
});

module.exports = withPWA({
  reactStrictMode: true,
});


const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'export', // esto indica que quieres un sitio estático
};

export default nextConfig;
