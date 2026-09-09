const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.instruktor_id,
        i.ime,
        i.prezime,
        i.email,
        i.telefon,
        i.opis,
        COALESCE(
          json_agg(pr.naziv ORDER BY pr.naziv) FILTER (WHERE pr.naziv IS NOT NULL),
          '[]'
        ) AS predmeti
      FROM instruktor i
      LEFT JOIN instruktor_predmet ip ON i.instruktor_id = ip.instruktor_id
      LEFT JOIN predmet pr ON ip.predmet_id = pr.predmet_id
      GROUP BY i.instruktor_id
      ORDER BY i.prezime
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Greška na serveru');
  }
});

module.exports = router;