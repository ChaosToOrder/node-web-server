/**
 * 全局变量模块
 */
require('./global')()

/**
 * 服务器模块
 */
const express = require("express"),
    app = express()

app.listen(port, () => { // 启动服务器于 XX 端口
    console.log("服务器正在运行...")
})

/**
 * body-parser中间件
 */
const bodyparser = require('body-parser')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))

/**
 * 跨域处理
 */
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

/**
 * session 中间件
 */
const session = require('express-session')
app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
    },
}))
// 刷新session时间
app.use((req, res, next) => {
    // if (/^\/user\//.test(req.path)) { // 跳过 /user/ 为前缀的路由
    if (true) { // 跳过 /user/ 为前缀的路由
        next()
    } else {
        if (req.session.username) {
            req.session._garbage = Date();
            req.session.touch();
            next();
        } else {
            res.send({
                code: -2,
                msg: '你的身份不存在或已过期,请重新登录'
            })
        }
    }
})

/**
 * 静态资源
 */
app.use(express.static('./dist/')) // APP页面
app.use('/cms', express.static('./dist_cms/')) // CMS页面
app.use(upload_img.prefix, express.static(require('./src/utils/upload').uploadFolder_img)) // 图片资源

/**
 * 路由模块
 */
app.use('/user', require("./src/router/user.js")) // 用户
app.use('/mall', require("./src/router/mall.js")) // 商品
app.use('/upload', require("./src/router/upload.js")) // 上传

// eyJhbGc6IkpXVCJ9.eyJpc3MiOiJCIsImVzg5NTU0NDUiLCJuYW1lnVlfQ.SwyHTf8AqKYMAJc



