#!/usr/bin/env node

const program = require("commander")
const resolve = require('path').resolve
const cwd = require('process').cwd()
const Config = require('webpack-chain')
const upConfig = require(resolve(cwd, "up.config.js"))
const upExpressDevApplication = require(resolve(cwd,"src","app.ts"))
const baseDevConfig = require(resolve(cwd,"config", "webpack.config.js"))
const { merge } = require('webpack-merge') // 获取merge函数
const webpack = require('webpack');
const express = require('express')
const WebpackDevServer = require('webpack-dev-server');
program.version("1.0.0")
  .command("run <args>")
  .description("up test dev")
    .action(async function (args) { 
        
        if (args == "dev") {
            const clientConfig = new Config()
            // 基础配置
            const baseConfig = baseDevConfig("development");
            upConfig.clientChain(clientConfig)
            const afterMergeConfig = merge(baseConfig, clientConfig.toConfig())
            const compiler = webpack(afterMergeConfig);
            const devServerOptions = {
                ...afterMergeConfig.devServer
            };

            console.log('port', devServerOptions.port);
            const server = new WebpackDevServer(devServerOptions, compiler);
            console.log(Object.keys(server));
            console.log(server instanceof express);
            server.start()
            // server.listen(devServerOptions.port, "127.0.0.1", () => {
            //     // 3411 express
            //     // 3419 webpack
            //     console.log(`Webpack server is running on localhost:${devServerOptions.port}`);
            // });
        }
    })


 program.parse(process.argv);