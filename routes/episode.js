const express = require('express');
const router = express.Router();
const connection = require('../db');

// 插入一集
router.post('/insert', (req, res) => {
  const { aid, number, name, duration } = req.body;

  const sql = 'INSERT INTO episode (aid, number, name, duration) VALUES (?, ?, ?, ?)';
  connection.query(sql, [aid, number, name, duration], (err, result) => {
    if (err) {
      console.error('插入剧集失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '插入剧集失败', data: null });
      return;
    }

    console.log('插入剧集成功:', result);
    res.json({ code: 200, message: '插入剧集成功', data: { id: result.insertId, aid, number, name, duration } });
  });
});

// 根据动漫ID获取剧集列表
router.get('/list', (req, res) => {
  const { id } = req.query;

  const sql = 'SELECT * FROM episode WHERE aid = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('获取剧集列表失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '获取剧集列表失败', data: null });
      return;
    }

    console.log('获取剧集列表成功:', results);
    res.json({ code: 200, message: '获取剧集列表成功', data: results });
  });
});

// 根据剧集编号删除剧集
router.delete('/delete', (req, res) => {
  const { number } = req.query;

  const sql = 'DELETE FROM episode WHERE number = ?';
  connection.query(sql, [number], (err, result) => {
    if (err) {
      console.error('删除剧集失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '删除剧集失败', data: null });
      return;
    }

    console.log('删除剧集成功:', result);
    res.sendStatus(204);
  });
});

module.exports = router;
