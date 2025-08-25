/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.example.com", // ✅ your actual image host
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", // if you also use pexels images
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", 
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
