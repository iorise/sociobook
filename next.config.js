/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.clerk.com",
      "www.gravatar.com",
      "uploadthing.com",
      "images.clerk.dev"
    ],
  },
};

module.exports = nextConfig;
