import type { NextConfig } from "next";
import { config } from "zod";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveExtensions: [
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ]
  }
};

export default nextConfig;
