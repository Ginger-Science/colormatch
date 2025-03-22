/** @type {import('next').NextConfig} */
export default {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
      path: false,
      crypto: false,
    }
    return config
  },
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
}
