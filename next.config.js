const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/plausible/js/script.js",
        destination: "https://plausible.io/js/plausible.js",
      },
      {
        source: "/plausible/api/event",
        destination: "https://plausible.io/api/event",
      },
    ];
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
