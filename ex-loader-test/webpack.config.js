const path = require('path');
const { cwd } = require('process');

function resolve(...args) {
    return path.resolve(cwd(),...args)
}

module.exports = {
    entry: "./src/index.js",
    mode:'development',
    module: {
        rules: [
            {
                test: /\.taro$/,
                use: resolve("TaroLoader.js"),
                exclude: [
                    resolve("node_modules"),
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.taro']
    },
    stats: {
        modules: false
    }
}