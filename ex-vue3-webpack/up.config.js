module.exports = {
    // 用于定义webpack的输出路径
    publicPath: '/tgoperate/',
    appName: "GYZQ",
    serverName: "TgOperateServer",

    clientChain:function(chain) {
        chain.output.filename("[name].[contenthash:8].js").end()
    },
    serverChain:function(chain) {
        
    }
}