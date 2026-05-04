/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["sdk-node-apis-efi", "qrcode"],
  },
};

export default nextConfig;
