const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
function join(...args) {
    return path.resolve(...args)
}

module.exports = {
    target: 'web',
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
    devServer: {
        static: {
            directory: join(__dirname, 'public', 'assets'),
        },
        port: "8080"
    },
    output: {
        path: join(__dirname, 'public', 'assets'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Demo',
            template:join(__dirname,'public','index.html')
        }),
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
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
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    }
}