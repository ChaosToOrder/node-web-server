const express = require("express"),
    app = express()

app.listen(80, () => {
    console.log("服务器正在运行...")
})

app.use(express.static('./dist/'))



