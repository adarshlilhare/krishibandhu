import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const BACKEND_URL = isProd ? 'https://adityameshram05.pythonanywhere.com' : 'http://127.0.0.1:5000';

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/python/:path*',
                destination: `${BACKEND_URL}/:path*` // Proxies automatically based on environment
            }
        ];
    }
};

export default nextConfig;
