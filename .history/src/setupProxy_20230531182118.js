const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "ec2-18-188-29-136.us-east-2.compute.amazonaws.com",
      changeOrigin: true,
    })
  );
};
