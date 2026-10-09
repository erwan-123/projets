import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Force la racine du projet pour éviter la détection de la racine parente (projets/)
    root: __dirname,
  },
};

export default nextConfig;
