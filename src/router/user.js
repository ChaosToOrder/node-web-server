const express = require("express"),
    router = express.Router()

/**
 * 登录
 */
router.post('/login', (req, res) => {
    let body = req.body

    db.sql(`select * from sys_user_base WHERE username = ?`, [body.username], 'all')
        .then(data => {
            if (data.length === 0) {
                res.send({
                    code: -1,
                    msg: "用户不存在"
                })
            } else {
                let password = data[0].password
                if (password === body.password) {
                    req.session.username = body.username
                    res.send({
                        code: 0,
                        data: data[0],
                        msg: "登录成功"
                    })
                } else {
                    res.send({
                        code: -1,
                        msg: "密码错误"
                    })
                }
            }
        })

    // if (req.session.logName ) {
    //     res.send('111111')
    // } else {

    //     if (body.logName == 'br1168') {
    //         req.session.logName = body.logName; // 登录成功，设置 session
    //         res.send({
    //             code:0,
    //             body,
    //             msg: "登录成功"
    //         })
    //     } else if (body.logName == 'br11681'){
    //         req.session.logName = body.logName; // 登录成功，设置 session
    //         res.send({
    //             code:500,
    //             data: {

    //             },
    //             msg: "失败"
    //         })
    //     }else {
    //         res.send({
    //             code:500,
    //             data: {

    //             },
    //             msg: "失败"
    //         })
    //     }
    // }
    // res.send({
    //     code:200,
    //     body,
    //     msg: "登陆成功"
    // })
})

/**
 * 登出
 */
router.post('/logout', (req, res) => {

    req.session.username = null

    res.send({
        code: -2,
    })

})

/**
 * 验证
 */
router.get('/authentication', (req, res) => {
    if (req.session.username) {
        res.send({
            code: 0
        })
    } else {
        // res.send({
        //     code: -2,
        //     msg: '你的身份不存在或已过期,请重新登录'
        // })
        res.send({
            code: 0
        })
    }
})

/**
 * 分页查询系统管理员列表
 */
router.get('/usersList/page', (req, res) => {
    let query = req.query,
        pageNum = query.pageNum || 1, pageSize = query.pageSize || 10,// 页码 页数
        username = query.username || ''

    let getData = db.sql(`SELECT * FROM sys_user_base WHERE username LIKE ? LIMIT ? OFFSET ? `, [`%${username}%`, Number(pageSize), Number((pageNum - 1) * pageSize)])

    let getCount = db.sql(`select count(*) from sys_user_base where username like ?`, [`%${username}%`])

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
 * 删除用户
 */
router.post('/delete', (req, res) => {
    let body = req.body
    db.sql(`delete from sys_user_base where user_id = ?`, [body.user_id])
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
 * 批量删除管理员
 */
router.post('/delete/multiple', (req, res) => {
    let body = req.body,
        id_list = body.id_list
    
    let promises = id_list.map((val) => {
        return db.sql(`delete from sys_user_base where user_id = ?`, [val]);
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
 * 添加/编辑 管理员
 */
router.post('/add&edit', (req, res) => {
    let body = req.body,
        username = body.username,
        password = body.password,
        sex = body.sex,
        state_flag = body.state_flag,
        hp = body.hp,
        register_time = f.format(new Date()),
        user_id = body.user_id

        if (user_id) {
            db.sql(`update sys_user_base set 
            username = ?,password = ?, sex = ?,state_flag = ?,hp = ?
            where user_id = ?`,
            [username,password,sex,state_flag,JSON.stringify(hp),user_id])
            .then(() => {
                res.send({
                    code: 0,
                    msg: '修改成功'
                })
            })
        } else {
            db.sql(`insert into sys_user_base (username, password, sex, state_flag, hp, register_time) values(?, ?, ?, ?, ?, ?)`,
            [username, password, sex, state_flag,JSON.stringify(hp), register_time])
            .then(() => {
                res.send({
                    code: 0,
                    msg: '添加成功'
                })
            })
        }

    
})




module.exports = router
