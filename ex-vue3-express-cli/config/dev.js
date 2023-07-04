const ForkTsCheckerWebapckPlugin = require('fork-ts-checker-webpack-plugin')// 导入该插件
// PATH 模块
const path = require('path');
const { cwd } = require('process');

function resolve(...args) {
    return path.resolve(cwd(),...args)
}


const StyleRules = [
    {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
    },
    {
        test: /\.css$/, // 匹配css文件
        use: [
            "style-loader",
            {
                loader: "css-loader",
                options: {
                    importLoaders: 1, // css-loader前还有几个loader
                },
            },
            {
                loader: "postcss-loader",
                options: {
                    postcssOptions: {    // 对postcss的配置也可以单独抽离到一个文件中，这里就不抽取了。
                        plugins: ['postcss-preset-env'],
                    }
                },
            },
        ],
    },
    {
        test: /\.less$/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 2
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: ['postcss-preset-env']
                    }
                }
            },
            'less-loader'
        ]
    }

]


module.exports = {
    target: 'web',
    mode: "development",
    stats: 'errors-only',
    // 优化的内容
    optimization: {
        // splitChunks: {
        //     cacheGroups: {
        //         vendor: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: 'vendor',
        //             chunks: 'all',
        //         },
        //     },
        // },
    },
    // 开发环境
    devServer: {
        /**
         * devServer中的static属性用于指定静态文件的位置。在开发过程中，当你使用Webpack DevServer启动开发服务器时，它将为你提供一个本地的开发环境。static属性允许你指定一个目录，其中包含你的静态文件，例如 HTML 文件、图像、样式表等。
            当你在浏览器中访问开发服务器时，它将为你提供这些静态文件，并在你的应用程序中引用它们。这对于开发过程中的实时重新加载和调试非常有用。
            static属性可以接受两种形式的值：

            字符串路径：
                你可以提供一个字符串，指定包含静态文件的目录的路径。例如，static: 'public'将指定项目根目录下的public目录作为静态文件目录。
            
            对象配置：你可以传递一个对象来更详细地配置静态文件的选项。该对象具有以下属性：
                directory：指定包含静态文件的目录的路径。
                watch：一个布尔值，指示DevServer是否应该监视静态文件的变化并自动重新加载，默认为false。
                publicPath：指定在DevServer中提供静态文件的公共路径。例如，publicPath: '/assets/'将静态文件的根路径设置为/assets/。
                serveIndex：一个布尔值，指示DevServer是否应该在缺少索引文件时显示目录列表，默认为false。
         */
        static: {
            directory: resolve('public', 'assets'), // 默认 不允许修改
            watch: true,
            publicPath: '/center/', // 公共路径 这个是其他文件地址的路径
        },
        port: "3419",
    },
    plugins: [

        new ForkTsCheckerWebapckPlugin()
    ],
    module: {
        rules: [
            // js
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // 编译必须排除core-js中的代码，不然可能会发生错误
                        exclude: [
                            /node_modules[\\\/]core-js/,
                            /node_modules[\\\/]webpack[\\\/]buildin/,
                        ],
                        presets: [['@babel/preset-env', {
                            useBuiltIns: 'usage',
                            corejs: 3
                        }]]
                    }
                }
            },
            // ts
            {
                test: /\.ts$/,
                // exclude: [
                //     /node_modules/,
                //     resolve("src/router"),
                //     resolve("src/app.ts"),
                // ],
                // include: [
                //     resolve("src/client")
                // ],
                use: {
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],  // 处理在vue文件中使用ts
                        transpileOnly: true,  // 关闭类型检测，这样可以减少编译时间。
                    }
                }
            },
            ...StyleRules
        ]
    }
}


