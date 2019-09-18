
const upload = require('./src/utils/upload')
const os = require('os')

module.exports = function () {
    global.db = db // 数据库
    global.port = 80 // 服务器端口号
    global.f = {
        format, // 时间格式化方法
        getIPAdress, // 获取本机ip
        getClientIp, // 获取用户ip
    }
    /** 图片上传 */
    global.upload_img = {
        middleware: upload.upload_img, // 图片上传中间件
        prefix: '/uploadFile'
    }
}

/** ------------------------------------ end */

/**
 * mysql 数据库
 */
let mysql = require('mysql');
let connection = mysql.createConnection({
    // host: 'localhost',
    // port: 3306,
    host: 'cdb-4pems80c.cd.tencentcdb.com',
    port: '10052',
    user: 'root',
    password: 'changein2017',
    database: 'blog'
});

connection.connect(() => {
    console.log('mysql连接成功');
});

let db = {
    sql(sql, sqlParams) {
        return new Promise((reslove, reject) => {
            connection.query(sql, sqlParams, (err, res) => {
                if (err) {
                    reject(err.message)
                } else {
                    reslove(res)
                }
            })
        })
    }
}
/** ------------------------------------ end */



/** ----------------------------------- end */

/**
 * 公用方法
 */
let format = function (date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let min = date.getMinutes();
    let s = date.getSeconds();

    if (m < 10) {
        m = `0${m}`;
    }

    if (d < 10) {
        d = `0${d}`;
    }

    if (h < 10) {
        h = `0${h}`;
    }

    if (min < 10) {
        min = `0${min}`;
    }

    if (s < 10) {
        s = `0${s}`;
    }

    return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

/*
获取本机IP
*/
function getIPAdress() {
    // if(localIp) return localIp;
    let localIPAddress = "";
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                localIPAddress = alias.address;
            }
        }
    }
    localIp = localIPAddress;
    return localIPAddress;
}


/**
* 获取用户ip
*/
function getClientIp(req) {
    try {
        return req.headers['x-wq-realip'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    } catch (e) {
        logger.info("getClientIp error");
        return "";
    }
}
