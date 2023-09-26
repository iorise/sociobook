/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.clerk.com",
      "images.clerk.dev",
      "www.gravatar.com",
      "uploadthing.com",
    ],
  },
};

module.exports = nextConfig;
