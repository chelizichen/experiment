#!/usr/bin/env ts-node

const program = require("commander")
// const resolve = require('path').resolve
const cwd = require('process').cwd()
const path = require('path')

function resolve(...args) {
    return path.resolve(cwd, ...args)
}

const Config = require('webpack-chain')
const { merge } = require('webpack-merge') // 获取merge函数
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const express = require('express')
const { spawnSync, spawn, exec } = require("child_process")
const { mkdirSync } = require("fs")

const app = require(resolve("src", "app.ts"));


program.version("1.0.0")
    .command("run <args>")
    .option("-r,--release", "is release")
    .description("up test [dev,build,start]")
    .action(async function (args, opt) {
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

            app.use(publicPath, express.static(resolve('public', 'assets')))

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
            const fse = require('fs-extra');
            fse.removeSync(resolve("dist"))
            fse.removeSync(resolve("public", "assets"))
            fse.removeSync(resolve("release"))

            let publicPath = null;
            const buildServer = function () {
                const tsServerJson = resolve('tsconfig.server.json')
                const serverScripts = ` tsc --project ${tsServerJson} `;
                const buildProcess = exec(serverScripts);
                buildProcess.stdout.on("error", function (err) {
                    console.log(err);
                })
                buildProcess.stdout.on("data", function (data) {
                    console.log(data);
                })
                buildProcess.on("exit", function () {
                    console.log("***********服务端打包结束***********");
                    if (opt.release) {
                        const { appName, serverName } = upConfig;
                        const release_url = resolve('release');
                        const release_src = resolve('release', `${appName}.${serverName}`)
                        const tgz_url = resolve('release', `${appName}.${serverName}.tgz`);
                        const tgz_name = `${appName}.${serverName}`
                        const pkg = resolve('package.json')
                        const release_pkg = resolve('release', `${appName}.${serverName}`, 'package.json')
                        mkdirSync(release_url)
                        mkdirSync(release_src)
                        fse.copyFileSync(pkg, release_pkg) // 


                        const download_production = `cd ${release_src} &&  npm install --production`;

                        const download_cmd = spawn(download_production, {
                            stdio: "pipe",
                            shell: true,
                            env: process.env,
                        })

                        download_cmd.on("exit", function () {
                            const dist_url = resolve("dist")
                            const assets_url = resolve("public", "assets")
                            const target_assets_url = resolve('release', `${appName}.${serverName}`, 'public', 'assets');
                            fse.copySync(dist_url, release_src + "/dist")
                            fse.copySync(assets_url, target_assets_url)
                            console.log("***********打包完成**************")

                            console.log("***********开始压缩**************")
                            const tgz_cmd = `cd release && tar -zcvf ${tgz_name}.tgz  ./${tgz_name}`;
                            const cmd_process = exec(tgz_cmd)

                            cmd_process.stderr.on('data', function (chunk) {
                                console.log('tar', chunk);
                            })
                            cmd_process.on('exit',function(){
                                console.log("***********压缩完成**************")
                            })

                        })




                        // const build_cmd = 'tar .....'
                    }
                })
            }
            const buildClient = function () {
                const { getDevServerOptions } = require("../lib/dev")
                const buildConfig = getDevServerOptions(upConfig)
                delete buildConfig.devServer;

                const clientConfig = new Config();
                const baseConfig = commonConfig("production"); // 基础配置
                try {
                    upConfig.clientChain(clientConfig);// 链式调用
                } catch (error) {
                    throw new Error(`chain call error:${error}`);
                }
                const afterMergeConfig = merge(baseConfig, clientConfig.toConfig(), buildConfig)
                publicPath = afterMergeConfig.output.publicPath;
                webpack(afterMergeConfig, function (err, stats) {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log(stats.toString())
                    console.log("***********开始打包服务端***********")
                    buildServer()
                });
            }
            buildClient();

            // prod 后 可以走release

        }
        // 走运行时
        if (args == "start") {
            const requireEntryFile = require(resolve('dist', 'app.js'));
            const port = upConfig.port
            const publicPath = upConfig.publicPath
            const app = requireEntryFile.ServerApplication
            app.use(publicPath, express.static(resolve('public', 'assets')))
            app.listen(port, function () {
                console.log(`webpack out put at  localhost:${port}${publicPath}`);
                console.log(`Express server is running on localhost:${port}`);
            })

        }

    })


program.parse(process.argv);