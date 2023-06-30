const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://18.188.29.136:8080",
      changeOrigin: true,
    })
  );
};