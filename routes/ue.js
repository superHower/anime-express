const express = require('express');
const router = express.Router();
const connection = require('../db');

// 插入 Ue
router.post('/', (req, res) => {
  const { uid, eid, barrage, time } = req.body;

  const sql = `INSERT INTO ue (uid, eid, barrage, time) VALUES (?, ?, ?, ?)`;
  connection.query(sql, [uid, eid, barrage, time], (err, result) => {
    if (err) {
      console.error('Error inserting Ue: ' + err.stack);
      res.status(500).json({ message: 'Error inserting Ue' });
      return;
    }

    console.log('Ue inserted successfully');
    res.json({ id: result.insertId });
  });
});

// 获取所有 Ue
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM ue';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying Ue: ' + err.stack);
      res.status(500).json({ message: 'Error querying Ue' });
      return;
    }

    console.log('Ue queried successfully');
    res.json(results);
  });
});

// 根据 uid 和 eid 获取 Ue
router.get('/details', (req, res) => {
  const { uid, eid } = req.query;

  const sql = 'SELECT * FROM ue WHERE uid = ? AND eid = ?';
  connection.query(sql, [uid, eid], (err, results) => {
    if (err) {
      console.error('Error querying Ue: ' + err.stack);
      res.status(500).json({ message: 'Error querying Ue' });
      return;
    }

    console.log('Ue details queried successfully');
    res.json(results);
  });
});

// 根据 uid 和 eid 删除 Ue
router.delete('/:uid/:eid', (req, res) => {
  const { uid, eid } = req.params;

  const sql = 'DELETE FROM ue WHERE uid = ? AND eid = ?';
  connection.query(sql, [uid, eid], (err, result) => {
    if (err) {
      console.error('Error deleting Ue: ' + err.stack);
      res.status(500).json({ message: 'Error deleting Ue' });
      return;
    }

    console.log('Ue deleted successfully');
    res.json({ affectedRows: result.affectedRows });
  });
});

// 更新 Ue 的字段
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { uid, eid, barrage, time } = req.body;

  const sql = 'UPDATE ue SET uid = ?, eid = ?, barrage = ?, time = ? WHERE id = ?';
  connection.query(sql, [uid, eid, barrage, time, id], (err, result) => {
    if (err) {
      console.error('Error updating Ue: ' + err.stack);
      res.status(500).json({ message: 'Error updating Ue' });
      return;
    }

    console.log('Ue updated successfully');
    res.json({ affectedRows: result.affectedRows });
  });
});

module.exports = router;
