import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/*': ['./public/pages/**/*'],
    '/lp': ['./rio-cuiaba-lodge-lp/**/*'],
    '/lp/privacidade': ['./rio-cuiaba-lodge-lp/**/*'],
    '/lp/termos': ['./rio-cuiaba-lodge-lp/**/*'],
  },
};

export default nextConfig;
