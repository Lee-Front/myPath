const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target:
        //"https://port-0-mypathserver-1luhct24lclsoq2m.gksl2.cloudtype.app",
        "http://localhost:8080",
      changeOrigin: true,
    })
  );
};
