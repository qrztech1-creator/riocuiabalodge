import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/*': ['./public/pages/**/*'],
  },
};

export default nextConfig;
