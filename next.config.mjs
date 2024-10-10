/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    customKey: "my-value",
    CONNECT_STR: "mongodb://127.0.0.1:27017/marketdb",
    admpswd: "ebcaa2bc57ae3e81cf2065edd94e3c87d0997370c4b7fdb4e306d83efacf3c3d",
  },
};

export default nextConfig;
