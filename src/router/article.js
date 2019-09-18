const express = require("express"),
    router = express.Router()

/** --- 文章 --- */
/**
 * 分页 综合 查询文章
 */
router.post('/article/list/page', (req, res) => {
    let body = req.body,
        pageNum = body.pageNum || 1, pageSize = body.pageSize || 10,// 页码 页数
        title = body.title || '', // 文章名
        typeIdList = body.typeIdList || null // 类别
    // let getData = db.sql(`select * from a_article where title like ? limit ? offset ? `, [`%${title}%`, pageSize, (pageNum - 1) * pageSize])
    let getData = db.sql(
        `SELECT t1.type_name, t2.*
        FROM a_article_type t1
        INNER JOIN a_article t2
        ON t1.type_id = t2.type_id
        WHERE title like ? 
        AND (${sql_typeId(typeIdList,'t1')}) 
        LIMIT ? 
        OFFSET ? `,
        [`%${title}%`, Number(pageSize), Number((pageNum - 1) * pageSize)])
        
    let getCount = db.sql(
        `SELECT count(*)
        FROM a_article_type t1
        INNER JOIN a_article t2
        ON t1.type_id = t2.type_id
        WHERE title like ?
        AND (${sql_typeId(typeIdList,'t1')})`
        ,
        [`%${title}%`])
        
    Promise.all([getData, getCount])
        .then(([res1, res2]) => {
            res.send({
                code: 0,
                data: {
                    list: res1,
                    total: res2[0]['count(*)']
                },

            })
        })
})

/**
 * 分页 根据类别 查询文章
 */
router.get('/article/list/page/byTypeId', (req, res) => {
    let query = req.query,
        pageNum = query.pageNum || 1, pageSize = query.pageSize || 10,// 页码 页数
        type_id = query.type_id

    // let getData = db.sql(`select * from a_article where title like ? limit ? offset ? `, [`%${title}%`, pageSize, (pageNum - 1) * pageSize])
    let getData = db.sql(
        `SELECT t1.*,t2.type_name 
        FROM a_article t1 
        INNER JOIN a_article_type t2 
        ON t1.type_id = t2.type_id 
        WHERE type_id = ?
        LIMIT ? 
        OFFSET ? `,
        [type_id, pageSize, (pageNum - 1) * pageSize])

    let getCount = db.sql(`select count(*) from a_article WHERE type_id = ?`, [type_id])

    Promise.all([getData, getCount])
        .then(([res1, res2]) => {
            res.send({
                code: 0,
                data: {
                    list: res1,
                    total: res2[0]['count(*)']
                },

            })
        })
})

/**
 * 删除文章
 */
router.post('/article/delete', (req, res) => {
    let body = req.body
    db.sql(`delete from a_article where article_id = ?`, [body.article_id])
        .then(data => {
            res.send({
                code: 0,
                msg: '删除成功'
            })
        })
        .catch(err => {
            res.send({
                code: -1,
                err: err
            })
        })
})

/**
 * 批量删除文章
 */
router.post('/article/delete/multiple', (req, res) => {
    let body = req.body,
        id_list = body.id_list

    let promises = id_list.map((val) => {
        return db.sql(`delete from a_article where article_id = ?`, [val]);
    });
    Promise.all(promises)
        .then(data => {
            res.send({
                code: 0,
                msg: '批量删除成功'
            })
        })
        .catch(err => {
            res.send({
                code: -1,
                err: err
            })
        })
})

/**
 * 添加/编辑 文章
 */
router.post('/article/add&edit', (req, res) => {
    let body = req.body,
        title = body.title, // 文章名
        original_price = body.original_price, // 原价
        postage = body.postage, // 邮费
        type_id = body.type_id, // 文章类别ID
        pic_url = Array.isArray(body.pic_url)? body.pic_url[0] : body.pic_url, // 封面
        create_time = f.format(new Date()),
        article_id = body.article_id

    if (article_id) {
        db.sql(`update a_article set 
            title = ?,original_price = ?, postage = ?,type_id = ?,pic_url = ?
            where article_id = ?`,
            [title, original_price, postage, type_id, pic_url, article_id])
            .then(() => {
                res.send({
                    code: 0,
                    msg: '修改成功'
                })
            })
    } else {
        db.sql(`insert into a_article (title, original_price, postage, type_id, pic_url, create_time) values(?, ?, ?, ?, ?, ?)`,
            [title, original_price, postage, type_id, pic_url, create_time])
            .then(() => {
                res.send({
                    code: 0,
                    msg: '添加成功'
                })
            })
    }


})

/** --- 文章类别 --- */
/**
 * 分页查询文章类别
 */
router.get('/type/list/page', (req, res) => {
    let query = req.query,
        pageNum = query.pageNum || 1, pageSize = query.pageSize || 10,// 页码 页数
        type_name = query.type_name || ''

    let getData = db.sql(`select * from a_article_type where type_name like ? limit ? offset ? `, [`%${type_name}%`, Number(pageSize), Number((pageNum - 1) * pageSize)])

    let getCount = db.sql(`select count(*) from a_article_type where type_name like ?`, [`%${type_name}%`])

    Promise.all([getData, getCount])
        .then(([res1, res2]) => {
            res.send({
                code: 0,
                data: {
                    list: res1,
                    total: res2[0]['count(*)']
                },

            })
        })
})

/**
 * 删除 文章类别
 */
router.post('/type/delete', (req, res) => {
    let body = req.body
    db.sql(`delete from a_article_type where type_id = ?`, [body.type_id])
        .then(data => {
            res.send({
                code: 0,
                msg: '删除成功'
            })
        })
        .catch(err => {
            res.send({
                code: -1,
                err: err
            })
        })
})

/**
 * 批量 删除 文章类别
 */
router.post('/type/delete/multiple', (req, res) => {
    let body = req.body,
        id_list = body.id_list

    let promises = id_list.map((val) => {
        return db.sql(`delete from a_article_type where type_id = ?`, [val]);
    });
    Promise.all(promises)
        .then(data => {
            res.send({
                code: 0,
                msg: '批量删除成功'
            })
        })
        .catch(err => {
            res.send({
                code: -1,
                err: err
            })
        })
})

/**
 * 添加/编辑 文章类别
 */
router.post('/type/add&edit', (req, res) => {
    let body = req.body,
        type_name = body.type_name, // 文章类别名
        type_desc = body.type_desc, // 描述
        pic_url = Array.isArray(body.pic_url)? body.pic_url[0] : body.pic_url, // 封面
        create_time = f.format(new Date()),
        type_id = body.type_id

    if (type_id) {
        db.sql(`update a_article_type set 
            type_name = ?,type_desc = ?,pic_url = ?
            where type_id = ?`,
            [type_name, type_desc, pic_url, type_id])
            .then(() => {
                res.send({
                    code: 0,
                    msg: '修改成功'
                })
            })
    } else {
        db.sql(`insert into a_article_type (type_name, type_desc, pic_url, create_time) values(?, ?, ?, ?)`,
            [type_name, type_desc, pic_url, create_time])
            .then(() => {
                res.send({
                    code: 0,
                    msg: '添加成功'
                })
            })
    }


})

module.exports = router

function sql_typeId (typeIdList,table) {
    if (typeIdList && typeIdList.length > 0) {
        let str = ''
        typeIdList.forEach((val, index) => {
            if (index === 0) {
                str += `${table?table+'.' : ''}type_id = ${val} `
            } else {
                str += `OR ${table?table+'.' : ''}type_id = ${val} `
            }
        })
        return str
    } else {
        return `${table?table+'.' : ''}type_id LIKE '%%'`
    }
}