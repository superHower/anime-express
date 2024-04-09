const express = require('express');
const router = express.Router();
const connection = require('../db');
// 插入 Anime
router.post('/insert', (req, res) => {
  const { name, info, nation, time } = req.body;

  const sql = 'INSERT INTO anime (name, info, nation, time) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, info, nation, time], (err, result) => {
    if (err) {
      console.error('添加动漫失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '添加动漫失败', data: null });
      return;
    }

    res.json({ code: 200, message: '添加动漫成功', data: { id: result.insertId, name, info, nation, time } });
  });
});

// 获取所有 Anime
router.get('/list', (req, res) => {
  const sql = 'SELECT * FROM anime';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('获取所有动漫失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '获取所有动漫失败', data: null });
      return;
    }

    res.json({ code: 200, message: '已获取所有动漫', data: results });
  });
});

// 根据 ID 获取 Anime
router.get('/info', (req, res) => {
  const { id } = req.query;

  const sql = 'SELECT * FROM anime WHERE id = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('动漫获取失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '动漫获取失败', data: null });
      return;
    }

    if (results.length > 0) {
      const anime = results[0];
      res.json({ code: 200, message: '动漫获取成功', data: anime });
    } else {
      res.status(404).json({ code: 404, message: '没找到此动漫', data: null });
    }
  });
});
// 根据名称模糊查询 Anime
router.get('/infoByName', (req, res) => {
  const { name } = req.query;

  const sql = `
    SELECT * FROM anime
    WHERE
      <if test="name != null and name != ''">
        name LIKE CONCAT('%', ?, '%')
      </if>
  `;
  connection.query(sql, [name], (err, results) => {
    if (err) {
      console.error('名称模糊查询动漫失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '名称模糊查询动漫失败', data: null });
      return;
    }

    res.json({ code: 200, message: '名称模糊查询动漫成功', data: results });
  });
});

// 根据名称删除 Anime
router.delete('/delete', (req, res) => {
  const { name } = req.query;

  const sql = 'DELETE FROM anime WHERE name = ?';
  connection.query(sql, [name], (err, result) => {
    if (err) {
      console.error('删除动漫失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '删除动漫失败' });
      return;
    }

    if (result.affectedRows > 0) {
      res.json({ code: 200, message: '动漫删除成功' });
    } else {
      res.status(404).json({ code: 404, message: '找不到指定的动漫' });
    }
  });
});

// 更新 Anime
router.patch('/update', (req, res) => {
  const { id, name, nation, info, time } = req.body;

  const sql = `UPDATE anime
               SET
                 ${name ? `name = '${name}',` : ''}
                 ${nation ? `nation = '${nation}',` : ''}
                 ${info ? `info = '${info}',` : ''}
                 ${time ? `time = '${time}'` : ''}
               WHERE id = ${id}`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error('更新动漫失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '更新动漫失败' });
      return;
    }

    if (result.affectedRows > 0) {
      res.json({ code: 200, message: '动漫更新成功' });
    } else {
      res.status(404).json({ code: 404, message: '找不到指定的动漫' });
    }
  });
});

// 条件查询
router.get('/infoByCondition', (req, res) => {
  const { nation, time } = req.query;
  let begin, end;

  switch (time) {
    case '2020年之后':
      begin = '2020-01-01';
      end = new Date().toISOString().split('T')[0];
      break;
    case '2010年-2019年':
      begin = '2010-01-01';
      end = '2019-12-31';
      break;
    case '2000年-2009年':
      begin = '2000-01-01';
      end = '2009-12-31';
      break;
    case '2000年之前':
      begin = '1900-01-01';
      end = '1999-12-31';
      break;
    default:
      begin = null;
      end = null;
  }

  let sql = 'SELECT * FROM anime WHERE 1=1';
  const params = [];

  if (nation) {
    sql += ' AND nation = ?';
    params.push(nation);
  }

  if (begin && end) {
    sql += ' AND `time` BETWEEN ? AND ?';
    params.push(begin, end);
  }

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error('动漫查询失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '动漫查询失败' });
      return;
    }

    res.json({ code: 200, message: '动漫查询成功', data: results });
  });
});


// 最新评论
router.get('/latestComment', (req, res) => {
  const { id } = req.query;
  console.log(`查询动漫：《${id}》的最新评论`);

  const sql = 'CALL GetAnimeLatestComments(?)';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('查询最新评论失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '查询最新评论失败', data: null });
      return;
    }

    res.json({ code: 200, message: '查询最新评论成功', data: results[0] });
  });
});

// 收藏的动漫
router.get('/collectionAnime', (req, res) => {
  const { id } = req.query;
  console.log(`查询用户：《${id}》收藏的动漫`);

  const sql = 'CALL GetUserCollectionAnime(?)';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('查询收藏的动漫失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '查询收藏的动漫失败', data: null });
      return;
    }

    res.json({ code: 200, message: '查询收藏的动漫成功', data: results[0] });
  });
});

// 点赞的动漫
router.get('/favoriteAnime', (req, res) => {
  const { id } = req.query;
  console.log(`查询用户：《${id}》点赞的动漫`);

  const sql = 'CALL GetUserFavoriteAnime(?)';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('查询点赞的动漫失败: ' + err.stack);
      res.status(500).json({ code: 500, message: '查询点赞的动漫失败', data: null });
      return;
    }

    res.json({ code: 200, message: '查询点赞的动漫成功', data: results[0] });
  });
});

module.exports = router;