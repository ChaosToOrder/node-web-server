const express = require("express"),
    router = express.Router()

router.get('/test',(req, res) => {
    sqliteDB.queryData(
        `select * from test`,
        (data) => {
            res.send(data)
        }
    )
})

module.exports = router
