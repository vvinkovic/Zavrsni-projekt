const express = require('express');
const router = express.Router();
const pool = require('../db');
const provjeriAdmina = require('../middleware/adminAuth');

// samo admin smije vidjeti popis učenika (OIB, email, telefon su osjetljivi podaci)
router.get('/', provjeriAdmina, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ucenik ORDER BY prezime');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Greška na serveru');
  }
});

module.exports = router;