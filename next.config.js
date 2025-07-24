const nextConfig = {
  output: "export",
  trailingSlash: true,
  distDir: "out", // Specify output directory
  // This is key for SPA mode:
  exportPathMap: async function () {
    return {
      '/': { page: '/' }, // Only export the root page
    }
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle .glsl files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "raw-loader", // or "asset/source" in newer Webpack versions
        },
        {
          loader: "glslify-loader",
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
