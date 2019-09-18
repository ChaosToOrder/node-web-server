const express = require("express"),
    router = express.Router()

/** --- 商品 --- */
/**
 * 分页 综合 查询商品
 */
router.post('/goods/list/page', (req, res) => {
    let body = req.body,
        pageNum = body.pageNum || 1, pageSize = body.pageSize || 10,// 页码 页数
        goods_name = body.goods_name || '', // 商品名
        categoryIdList = body.categoryIdList || null // 类别

    // let getData = db.sql(`select * from s_goods where goods_name like ? limit ? offset ? `, [`%${goods_name}%`, pageSize, (pageNum - 1) * pageSize])
    let getData = db.sql(
        `SELECT t1.category_name, t2.*
        FROM s_goods_category t1
        INNER JOIN s_goods t2
        ON t1.goods_category_id = t2.category_id
        WHERE goods_name like ? 
        AND (${sql_categoryId(categoryIdList)}) 
        LIMIT ? 
        OFFSET ? `,
        [`%${goods_name}%`, Number(pageSize), Number((pageNum - 1) * pageSize)])

    let getCount = db.sql(
        `SELECT count(*)
        FROM s_goods_category t1
        INNER JOIN s_goods t2
        ON t1.goods_category_id = t2.category_id
        WHERE goods_name like ?
        AND (${sql_categoryId(categoryIdList)})`,
        [`%${goods_name}%`])

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
 * 分页 根据类别 查询商品
 */
router.get('/goods/list/page/byCategoryId', (req, res) => {
    let query = req.query,
        pageNum = query.pageNum || 1, pageSize = query.pageSize || 10,// 页码 页数
        category_id = query.category_id

    // let getData = db.sql(`select * from s_goods where goods_name like ? limit ? offset ? `, [`%${goods_name}%`, pageSize, (pageNum - 1) * pageSize])
    let getData = db.sql(
        `SELECT t1.*,t2.category_name 
        FROM s_goods t1 
        INNER JOIN s_goods_category t2 
        ON t1.category_id = t2.goods_category_id 
        WHERE category_id = ?
        LIMIT ? 
        OFFSET ? `,
        [category_id, pageSize, (pageNum - 1) * pageSize])

    let getCount = db.sql(`select count(*) from s_goods WHERE category_id = ?`, [category_id])

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
 * 删除商品
 */
router.post('/goods/delete', (req, res) => {
    let body = req.body
    db.sql(`delete from s_goods where goods_id = ?`, [body.goods_id])
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
 * 批量删除商品
 */
router.post('/goods/delete/multiple', (req, res) => {
    let body = req.body,
        id_list = body.id_list

    let promises = id_list.map((val) => {
        return db.sql(`delete from s_goods where goods_id = ?`, [val]);
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
 * 添加/编辑 商品
 */
router.post('/goods/add&edit', (req, res) => {
    let body = req.body,
        goods_name = body.goods_name, // 商品名
        original_price = body.original_price, // 原价
        postage = body.postage, // 邮费
        category_id = body.category_id, // 商品类别ID
        pic_url = Array.isArray(body.pic_url)? body.pic_url[0] : body.pic_url, // 封面
        create_time = f.format(new Date()),
        goods_id = body.goods_id

    if (goods_id) {
        db.sql(`update s_goods set 
            goods_name = ?,original_price = ?, postage = ?,category_id = ?,pic_url = ?
            where goods_id = ?`,
            [goods_name, original_price, postage, category_id, pic_url, goods_id])
            .then(() => {
                res.send({
                    code: 0,
                    msg: '修改成功'
                })
            })
    } else {
        db.sql(`insert into s_goods (goods_name, original_price, postage, category_id, pic_url, create_time) values(?, ?, ?, ?, ?, ?)`,
            [goods_name, original_price, postage, category_id, pic_url, create_time])
            .then(() => {
                res.send({
                    code: 0,
                    msg: '添加成功'
                })
            })
    }


})

/** --- 商品类别 --- */
/**
 * 分页查询商品类别
 */
router.get('/category/list/page', (req, res) => {
    let query = req.query,
        pageNum = query.pageNum || 1, pageSize = query.pageSize || 10,// 页码 页数
        category_name = query.category_name || ''

    let getData = db.sql(`select * from s_goods_category where category_name like ? limit ? offset ? `, [`%${category_name}%`, Number(pageSize), Number((pageNum - 1) * pageSize)])

    let getCount = db.sql(`select count(*) from s_goods_category where category_name like ?`, [`%${category_name}%`])

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
 * 删除 商品类别
 */
router.post('/category/delete', (req, res) => {
    let body = req.body
    db.sql(`delete from s_goods_category where goods_category_id = ?`, [body.goods_category_id])
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
 * 批量 删除 商品类别
 */
router.post('/category/delete/multiple', (req, res) => {
    let body = req.body,
        id_list = body.id_list

    let promises = id_list.map((val) => {
        return db.sql(`delete from s_goods_category where goods_category_id = ?`, [val]);
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
 * 添加/编辑 商品类别
 */
router.post('/category/add&edit', (req, res) => {
    let body = req.body,
        category_name = body.category_name, // 商品类别名
        category_desc = body.category_desc, // 描述
        pic_url = Array.isArray(body.pic_url)? body.pic_url[0] : body.pic_url, // 封面
        create_time = f.format(new Date()),
        goods_category_id = body.goods_category_id

    if (goods_category_id) {
        db.sql(`update s_goods_category set 
            category_name = ?,category_desc = ?,pic_url = ?
            where goods_category_id = ?`,
            [category_name, category_desc, pic_url, goods_category_id])
            .then(() => {
                res.send({
                    code: 0,
                    msg: '修改成功'
                })
            })
    } else {
        db.sql(`insert into s_goods_category (category_name, category_desc, pic_url, create_time) values(?, ?, ?, ?)`,
            [category_name, category_desc, pic_url, create_time])
            .then(() => {
                res.send({
                    code: 0,
                    msg: '添加成功'
                })
            })
    }


})

module.exports = router

function sql_categoryId (categoryIdList) {
    if (categoryIdList && categoryIdList.length > 0) {
        let str = ''
        categoryIdList.forEach((val, index) => {
            if (index === 0) {
                str += `category_id = ${val} `
            } else {
                str += `OR category_id = ${val} `
            }
        })
        return str
    } else {
        return "category_id LIKE '%%'"
    }
}