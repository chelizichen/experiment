#!/usr/bin/env ts-node

const program = require("commander")
// const resolve = require('path').resolve
const cwd = require('process').cwd()
const path = require('path')

function resolve(...args) {
    return path.resolve(cwd,...args)
}

const Config = require('webpack-chain')
const { merge } = require('webpack-merge') // 获取merge函数
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const express = require('express')

const app = require(resolve("src","app.ts")).ServerApplication


program.version("1.0.0")
  .command("run <args>")
  .description("up test [dev,build,start]")
    .action(async function (args) { 
        const commonConfig = require("../config/config")
        const upConfig = require(resolve("up.config.js"))
        // 走dev
        if (args == "dev") {
            const { getDevServerOptions } = require("../lib/dev")
            const clientConfig = new Config();
            const baseConfig = commonConfig("development"); // 基础配置
            const devConfig = getDevServerOptions(upConfig)
            try {
                upConfig.clientChain(clientConfig);// 链式调用
            } catch (error) {
                throw new Error(`chain call error:${error}`);
            }
            const afterMergeConfig = merge(baseConfig, clientConfig.toConfig(), devConfig)
            const compiler = webpack(afterMergeConfig);

            const devServerOptions = {
                ...afterMergeConfig.devServer
            };
            const publicPath = afterMergeConfig.output.publicPath
            const port = devServerOptions.port

            app.use(publicPath, express.static(resolve('public','assets')))

            app.use(
                webpackDevMiddleware(compiler, {
                  publicPath, // 公共路径，与 webpack 配置中的 publicPath 保持一致
                })
            );
            
            app.listen(port, () => {
                console.log(`webpack out put at  localhost:${port}${publicPath}`);
                console.log(`Express server is running on localhost:${port}`);
            })
            
        }
        // 走生产打包
        if (args == "prod") {
            
        }
        // 走运行时
        if (args == "start") {
            
        }
    })


 program.parse(process.argv);