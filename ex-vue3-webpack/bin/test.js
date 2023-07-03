#!/usr/bin/env ts-node

const program = require("commander")
const resolve = require('path').resolve
const cwd = require('process').cwd()
const Config = require('webpack-chain')
const upConfig = require(resolve(cwd, "up.config.js"))
const app = require(resolve(cwd,"src","app.ts")).ServerApplication
const baseDevConfig = require(resolve(cwd,"config", "webpack.config.js"))
const { merge } = require('webpack-merge') // 获取merge函数
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

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

            app.use(
                webpackDevMiddleware(compiler, {
                  publicPath: afterMergeConfig.output.publicPath, // 公共路径，与 webpack 配置中的 publicPath 保持一致
                })
            );
            
            app.listen(devServerOptions.port,()=>{
                console.log(`Express server is running on localhost:${devServerOptions.port}`);
            })
            
        }
    })


 program.parse(process.argv);