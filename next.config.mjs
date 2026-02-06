/** @type {import('next').NextConfig} */
const s3ImageBaseUrl = process.env.NEXT_PUBLIC_S3_IMAGE_BASE_URL;
const imageHostname = s3ImageBaseUrl ? new URL(s3ImageBaseUrl).hostname : "";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: imageHostname,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
