const express = require('express');
const router = express.Router();
const connection = require('../db');

// 增加 Ua
router.post('/insert', (req, res) => {
  const { uid, aid, isLike, ranking, collectionTime } = req.body;

  const sql = `
    INSERT INTO ua (uid, aid, isLike, ranking, collectionTime)
    VALUES (?, ?, ?, ?, ?)
  `;
  connection.query(sql, [uid, aid, isLike, ranking, collectionTime], (err, result) => {
    if (err) {
      console.error('插入 Ua 失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '插入 Ua 失败', data: null });
      return;
    }

    res.json({ code: 200, message: '插入 Ua 成功', data: { id: result.insertId } });
  });
});

// 获取 Ua 信息
router.get('/info', (req, res) => {
  const { uid, aid } = req.query;

  const sql = 'SELECT * FROM ua WHERE uid = ? AND aid = ?';
  connection.query(sql, [uid, aid], (err, results) => {
    if (err) {
      console.error('查询 Ua 信息失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '查询 Ua 信息失败', data: null });
      return;
    }

    res.json({ code: 200, message: '查询 Ua 信息成功', data: results });
  });
});

// 发表评论
router.post('/comment', (req, res) => {
  const { uaid, content, time } = req.body;

  const sql = `INSERT INTO comment (uaid, content, time) VALUES (?, ?, ?) `;
  connection.query(sql, [uaid, content, time], (err, result) => {
    if (err) {
      console.error('发表评论失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '发表评论失败', data: null });
      return;
    }

    res.json({ code: 200, message: '发表评论成功', data: { id: result.insertId } });
  });
});

// 更新 Ua 的 isLike 字段为 1
router.patch('/updateLike', (req, res) => {
  const { uid, aid } = req.query;

  const sql = 'UPDATE ua SET isLike = 1 WHERE uid = ? AND aid = ?';
  connection.query(sql, [uid, aid], (err, results) => {
    if (err) {
      console.error('更新 Ua 失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '更新 Ua 失败', data: null });
      return;
    }

    res.json({ code: 200, message: '更新 Ua 成功', data: null });
  });
});

// 更新 Ua 的 collectionTime 字段
router.patch('/updateCollect', (req, res) => {
  const { uid, aid } = req.query;

  const sql = 'UPDATE ua SET collectionTime = CURRENT_TIMESTAMP WHERE uid = ? AND aid = ?';
  connection.query(sql, [uid, aid], (err, results) => {
    if (err) {
      console.error('更新 Ua 失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '更新 Ua 失败', data: null });
      return;
    }

    res.json({ code: 200, message: '更新 Ua 成功', data: null });
  });
});

// 更新 Ua 的 ranking 字段
router.patch('/updateRanking', (req, res) => {
  const { uid, aid, ranking } = req.query;

  const sql = 'UPDATE ua SET ranking = ? WHERE uid = ? AND aid = ?';
  connection.query(sql, [ranking, uid, aid], (err, results) => {
    if (err) {
      console.error('更新 Ua 失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '更新 Ua 失败', data: null });
      return;
    }

    res.json({ code: 200, message: '更新 Ua 成功', data: null });
  });
});
  
module.exports = router;