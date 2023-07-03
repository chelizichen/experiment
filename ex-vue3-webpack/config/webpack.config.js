// webpack.common.js
const { merge } = require('webpack-merge') // 获取merge函数
const { VueLoaderPlugin } = require('vue-loader');

const commonConfig = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
    ]
}
// 这个对象保存着之前的配置

module.exports = (mode) => {
    // 判断当前的模式
    let config = null;
    // 根据不同模式，导入不同配置
    if (mode === 'production') {
        config = require('./webpack.prod')
    } else {
        config = require('./webpack.dev')
    }
    // 返回合并后的配置文件
    return merge(commonConfig, config)
}

