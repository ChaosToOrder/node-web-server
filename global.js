const SqliteDB = require('./src/sqlite3/sqlite3.js').SqliteDB
let sqliteDB = new SqliteDB('data/data.db')

module.exports = function () {
    global.sqliteDB = sqliteDB
    global.port = 80 // 服务器端口号
}