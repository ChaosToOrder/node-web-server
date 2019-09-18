const fs = require('fs');
const multer  = require('multer')
/**
 * 创建文件夹（如果已创建则打开）
 */
let createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};



/** 上传配置 */

/**
 * 图片上传
 */
/** --- */
let uploadFolder_img = '../upload/img'; // 图片上传文件夹位置
/** --- */
createFolder(uploadFolder_img); // 创建或打开图片文件夹
let storage_img = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder_img);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, 'pic-' + Date.now() + file.originalname );  
    }
});
// 通过 storage 选项来对 上传行为 进行定制化
let upload_img = multer({ storage: storage_img })


module.exports = {
    uploadFolder_img,
    upload_img,
}