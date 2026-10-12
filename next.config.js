/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      // Hire page was retired — keep old links landing somewhere useful.
      { source: "/hire", destination: "/", permanent: false },
    ];
  },
}

module.exports = nextConfig
