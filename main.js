// 全局变量模块
require('./global')()

// 服务器模块
const express = require("express"),
    app = express()

app.listen(port, () => { // 启动服务器于 XX 端口
    console.log("服务器正在运行...")
})

// 路由模块
const getData_router = require("./src/router/getData.js")

app.use('/getData', getData_router) // 获取数据的路由
app.use(express.static('./dist/')) // 配置静态资源



