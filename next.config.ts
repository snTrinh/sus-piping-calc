// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {

  output: "export",

  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",

  images: {
    unoptimized: true,
  },


  trailingSlash: true, 
};

module.exports = nextConfig;
