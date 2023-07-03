const express = require("express");
const { join,resolve } = require("path");
const fs = require('fs');
// const { router } = require(resolve("./src","router/test"));
const ServerApplication = express();

// // 开发环境设置跨域
// // 确保开发环境下接口正常请求
// if (process.env.development) {
//     const proxy = require('http-proxy-middleware');
//     ServerApplication.use(
//       "/tgoperate/api",
//       proxy({
//         target: "http://localhost:3411/tgoperate",
//       })
//     );
// }

ServerApplication.use("/tgoperate/",express.static('public/assets'))

ServerApplication.use("/api/test", function (_, res) {
      res.send({
        msg: "Hello Webpack",
      });
});

module.exports = {
  ServerApplication,
};

// ServerApplication.listen(3411, function () {
//     console.log("app is listen on localhost:3411");
// });