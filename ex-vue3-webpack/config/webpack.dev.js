const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebapckPlugin = require('fork-ts-checker-webpack-plugin')// 导入该插件
// PATH 模块
const path = require('path');
function join(...args) {
    return path.resolve(...args)
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
    entry: {
        vueApp: join(__dirname, '../src', 'client', 'main.ts')
    },
    resolve: {
        extensions: [".ts", ".js",],
        alias: {
            '@': join(__dirname, '../src', 'client')// 这样配置后 @ 可以指向 src 目录
        }
    },

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
            directory: join(__dirname, '../public', 'assets'),
            watch: true,
            publicPath: '/tgoperate/', // 公共路径 这个是其他文件地址的路径
        },
        port: "3419",
        proxy: {
            '/api': {
                target: 'http://localhost:3411/api', // 你要请求的目标接口地址
                changeOrigin: true, // 改变请求的源
                pathRewrite: {
                    '^/api': '', // 将URL中的/api路径替换为空字符串
                },
                headers: {
                    'Access-Control-Allow-Origin': '*', // 添加此行
                },
            }
        },
    },
    /**
     * Webpack配置中的output选项用于定义输出文件的相关配置。下面列出了output对象中常用的选项：
        filename: 定义输出文件的文件名。可以使用占位符（placeholders）来生成不同的文件名，
        例如 [name] 表示入口文件的名称，[hash] 表示编译过程中生成的哈希值。
    
        path: 定义输出文件的存储路径。可以是绝对路径或相对于配置文件的相对路径。
    
        publicPath: 定义在引用输出文件时的公共路径（public path）。
        可以是绝对路径或相对路径。它在处理静态资源时非常有用，例如图片、字体等文件的引用路径。
    
        chunkFilename: 定义非入口文件（chunk）的文件名。类似于filename选项，可以使用占位符来生成不同的文件名。
    
        library: 定义输出库（library）的名称。可以通过该选项将你的代码打包成一个可复用的库，供其他项目使用。
    
        libraryTarget: 定义输出库的目标环境。可以是 var、umd、commonjs2、commonjs、amd、this、window、global 等选项。
        
        pathinfo: 一个布尔值，用于控制是否在生成的包中包含有关模块路径的注释。
        默认情况下为 false，意味着生成的包将不包含注释。
        这些选项允许你对输出文件进行灵活的配置，以满足你的需求。根据你的项目类型和目标环境，你可以选择适合的选项进行配置。
     */
    output: {
        path: join(__dirname, '../public', 'assets'),
        filename: 'bundle.js',
        publicPath: '/tgoperate/' // 公共路径 这个是其他文件地址的路径
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Demo',
            template: join(__dirname, '../public', 'index.html')
        }),
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
                exclude: [
                    /node_modules/,
                    join(__dirname, "../src/router"),
                    join(__dirname, "../src/app.ts"),
                ],
                include: [
                    join(__dirname,"../src/client")
                ],
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


