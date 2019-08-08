const express = require("express"),
    app = express()

app.listen(80, () => {
    console.log("服务器已启动...")
})

app.use(express.static('./dist/'))



