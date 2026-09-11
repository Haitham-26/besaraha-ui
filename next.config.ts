import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

function publicRedirect(path: string) {
  return [
    {
      source: path || "/",
      has: [{ type: "cookie" as const, key: "token" }],
      permanent: false,
      destination: "/profile",
    },
    {
      source: `/ar${path}`,
      has: [{ type: "cookie" as const, key: "token" }],
      permanent: false,
      destination: "/profile",
    },
  ];
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...publicRedirect(""),
      ...publicRedirect("/login"),
      ...publicRedirect("/signup"),
      ...publicRedirect("/signup/token"),
      ...publicRedirect("/forgot-password/email"),
      ...publicRedirect("/forgot-password/new"),
      ...publicRedirect("/forgot-password/token"),
      ...publicRedirect("/how-it-works"),

      {
        source: "/questions",
        missing: [{ type: "cookie", key: "token" }],
        permanent: false,
        destination: "/",
      },
      {
        source: "/messages",
        missing: [{ type: "cookie", key: "token" }],
        permanent: false,
        destination: "/",
      },
      {
        source: "/profile",
        missing: [{ type: "cookie", key: "token" }],
        permanent: false,
        destination: "/",
      },
      {
        source: "/settings",
        missing: [{ type: "cookie", key: "token" }],
        permanent: false,
        destination: "/",
      },
      {
        source: "/settings/security",
        missing: [{ type: "cookie", key: "token" }],
        permanent: false,
        destination: "/",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
