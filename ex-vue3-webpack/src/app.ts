const testRouter = require("./router/test");

const express = require("express");

const ServerApplication = express();


ServerApplication.use("/tgoperate/", express.static('public/assets'))

ServerApplication.use("/api", testRouter.router)

module.exports = {
  ServerApplication,
};
