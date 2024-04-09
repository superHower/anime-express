const express = require('express');
const router = express.Router();
const connection = require('../db');
// 注册
router.post('/register', (req, res) => {
  const { account, name, gender, age, pwd } = req.body;

  // 执行插入操作
  const sql = 'INSERT INTO user (account, name, gender, age, pwd) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [account, name, gender, age, pwd], (err, result) => {
    if (err) {
      console.error('插入数据库时发生错误：' + err.stack);
      res.status(500).json({ code: 500, message: '插入数据库时发生错误', data: null });
      return;
    }

    // 返回插入的用户信息
    const insertedUser = { account, name, gender, age };
    res.json({ code: 200, message: '注册成功', data: insertedUser });
  });
});

// 登录
router.post('/login', (req, res) => {
  const { account, pwd } = req.body;

  // 查询用户信息
  const sql = 'SELECT * FROM user WHERE account = ? AND pwd = ?';
  connection.query(sql, [account, pwd], (err, results) => {
    if (err) {
      console.error('查询数据库时发生错误：' + err.stack);
      res.status(500).json({ code: 500, message: '查询数据库时发生错误', data: null });
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({ code: 200, message: '登录成功', token: 'Ae27rgdwdkfu', data: user });
    } else {
      res.status(404).json({ code: 404, message: '账号或密码输入错误', data: null });
    }
  });
});

// 更新用户基本信息
router.put('/userinfo', (req, res) => {
  const { id, name, age } = req.body;

  let updateFields = [];
  let params = [];

  if (name) {
    updateFields.push('name = ?');
    params.push(name);
  }

  if (age) {
    updateFields.push('age = ?');
    params.push(age);
  }

  if (updateFields.length === 0) {
    res.json({ code: 400, message: '未提供要更新的字段', data: null });
    return;
  }

  params.push(id);

  const sql = `UPDATE user SET ${updateFields.join(', ')} WHERE id = ?`;
  connection.query(sql, params, (err) => {
    if (err) {
      console.error('更新用户信息时发生错误：' + err.stack);
      res.status(500).json({ code: 500, message: '更新用户信息时发生错误', data: null });
      return;
    }

    res.json({ code: 200, message: '更新用户基本信息成功', data: null });
  });
});

// 更新用户密码
router.patch('/updatepwd', (req, res) => {
  const { id, old_pwd, new_pwd, re_pwd } = req.body;

  if (new_pwd !== re_pwd) {
    res.status(400).json({ code: 400, message: '密码不匹配', data: null });
    return;
  }

  const sql = 'SELECT * FROM user WHERE id = ? AND pwd = ?';
  connection.query(sql, [id, old_pwd], (err, results) => {
    if (err) {
      console.error('检查用户密码时发生错误：' + err.stack);
      res.status(500).json({ code: 500, message: '检查用户密码时发生错误', data: null });
      return;
    }

    if (results.length === 0) {
      res.status(400).json({ code: 400, message: '密码不正确', data: null });
      return;
    }

    const updateSql = 'UPDATE user SET pwd = ? WHERE id = ?';
    connection.query(updateSql, [new_pwd, id], (err) => {
      if (err) {
        console.error('更新用户密码时发生错误：' + err.stack);
        res.status(500).json({ code: 500, message: '更新用户密码时发生错误', data: null });
        return;
      }

      res.json({ code: 200, message: '密码已更新', data: null });
    });
  });
});

// 获取所有用户
router.get('/list', (req, res) => {
  // 查询所有用户
  const sql = 'SELECT * FROM user';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('查询数据库时发生错误：' + err.stack);
      res.status(500).json({ code: 500, message: '查询数据库时发生错误', data: null });
      return;
    }

    // 返回用户列表
    res.json({ code: 200, message: '获取用户列表成功', data: results });
  });
});

// 根据账号删除用户
router.delete('/delete', (req, res) => {
  const { account } = req.query;

  // 执行删除操作
  const sql = 'DELETE FROM user WHERE account = ?';
  connection.query(sql, [account], (err, result) => {
    if (err) {
      console.error('从数据库中删除时发生错误：' + err.stack);
      res.status(500).json({ code: 500, message: '从数据库中删除时发生错误', data: null });
      return;
    }

    if (result.affectedRows > 0) {
      res.json({ code: 200, message: '用户删除成功', data: null });
    } else {
      res.status(404).json({ code: 404, message: '用户未找到', data: null });
    }
  });
});

module.exports = router;