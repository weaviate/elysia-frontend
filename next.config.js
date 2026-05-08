const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();

const isStaticExport = process.env.NEXT_PUBLIC_IS_STATIC === "true";
const authProvider = process.env.NEXT_PUBLIC_AUTH_PROVIDER || process.env.AUTH_PROVIDER_MODE;
if (!["emulator", "entra"].includes(authProvider)) {
  throw new Error(
    "Missing auth provider configuration. Set NEXT_PUBLIC_AUTH_PROVIDER to 'emulator' or 'entra'."
  );
}
const useEmulator = authProvider === "emulator";
const supabaseInternal = process.env.SUPABASE_INTERNAL_URL || "http://127.0.0.1:8000";
const entraInternal = process.env.ENTRA_INTERNAL_URL || "http://127.0.0.1:8029";
const elysiaInternal = process.env.ELYSIA_INTERNAL_URL || "http://127.0.0.1:8090";
const n8nInternal = process.env.N8N_INTERNAL_URL || "http://127.0.0.1:5678";

const nextConfig = {
  ...(isStaticExport ? { output: "export" } : {}),
  trailingSlash: false,
  allowedDevOrigins: ["10.1.1.11", "atena.uni.com"],
  async rewrites() {
    if (isStaticExport) {
      return [];
    }

    // Elysia backend API paths — proxied so browser only needs port 3090
    const elysiaRoutes = [
      "init", "user", "collections", "db", "tree", "feedback", "util",
    ].map((path) => ({
      source: `/${path}/:path*`,
      destination: `${elysiaInternal}/${path}/:path*`,
    }));

    const beforeFiles = [
      // Supabase proxy — always active in server mode
      {
        source: "/supabase/:path*",
        destination: `${supabaseInternal}/:path*`,
      },
      ...elysiaRoutes,
      // N8N webhook proxy
      {
        source: "/n8n/:path*",
        destination: `${n8nInternal}/:path*`,
      },
    ];

    // Entra emulator proxy — only needed with local auth emulator
    if (useEmulator) {
      beforeFiles.push(
        {
          source: "/entra/:path*",
          destination: `${entraInternal}/:path*`,
        },
        {
          source: "/common/:path*",
          destination: `${entraInternal}/common/:path*`,
        },
      );
    }

    return {
      beforeFiles,
      // /api routes: Next.js API routes take priority; unmatched /api/* falls through to Elysia
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${elysiaInternal}/api/:path*`,
        },
      ],
    };
  },
  webpack: (config) => {
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

module.exports = withNextIntl(nextConfig);
