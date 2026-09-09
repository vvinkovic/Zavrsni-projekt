const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM predmet ORDER BY naziv');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Greška na serveru');
  }
});

module.exports = router;