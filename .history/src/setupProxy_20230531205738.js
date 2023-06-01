const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target:
        process.env.NODE_ENV === "development"
          ? "http://localhost:8080"
          : "http://18.188.29.136:8080",
      changeOrigin: true,
    })
  );
};
