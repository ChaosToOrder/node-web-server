const express = require("express"),
    router = express.Router()
const fs = require('fs');



/**
 * 图片
 */
let  img_prefix = `http://${f.getIPAdress()}:${port}${upload_img.prefix}` // 图片文件访问前缀
// 上传
router.post('/pic', upload_img.middleware.single('file'), (req, res) => {
    let file = req.file;
    let pic_url = `${img_prefix}/${file.filename}` // 访问前缀 + 文件名
    // file.pic_url = pic_url
    res.send({
        code: 0,
        data: {
            pic_url: pic_url,
            type: req.body.type
        },
        msg: '图片上传成功'
    });
})

// 删除
router.post('/pic/delete', (req, res) => {
    let body = req.body,
        filename = body.pic_url.replace(new RegExp(`${img_prefix}/`),'')
    
    fs.unlink(`${require('../utils/upload').uploadFolder_img}/${filename}`,(err) => {
        if (err) {
            res.send({
                code: -1,
                msg: '图片删除失败'
            })
        } else {
            res.send({
                code: 0,
                msg: '图片删除成功'
            });
        }
        
    });
    
})

module.exports = router


