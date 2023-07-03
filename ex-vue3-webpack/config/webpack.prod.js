// webpack.prod.js
module.exports = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-typescript', {
                                // 这个配置是为了处理.vue文件解析后的ts文件
                                allExtensions: true
                            }]
                        ]
                    }
                }, {
                    loader: "ts-loader",
                }]

            }
        ]
    }
}

