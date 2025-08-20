import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["@prisma/client", "@auth/prisma-adapter"], // Updated key
    async redirects() {
        return [
            {
                source: "/signin",
                destination: "/sign-in",
                permanent: true
            }
        ];
    }
};

export default nextConfig;