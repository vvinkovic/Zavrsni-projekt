const express = require('express');
const router = express.Router();
const pool = require('../db');
const provjeriAdmina = require('../middleware/adminAuth');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.termin_id,
        to_char(t.datum, 'YYYY-MM-DD') AS datum,
        t.vrijeme_pocetka,
        t.trajanje,
        t.cijena,
        p.naziv AS predavaonica,
        pr.naziv AS predmet,
        i.ime AS instruktor_ime,
        i.prezime AS instruktor_prezime,
        NOT EXISTS (
          SELECT 1 FROM rezervacija r 
          WHERE r.termin_id = t.termin_id AND r.status != 'otkazana'
        ) AS slobodan
      FROM termin t
      JOIN predavaonica p ON t.predavaonica_id = p.broj_predavaonice
      JOIN instruktor_predmet ip ON t.instruktor_predmet_id = ip.instruktor_predmet_id
      JOIN predmet pr ON ip.predmet_id = pr.predmet_id
      JOIN instruktor i ON ip.instruktor_id = i.instruktor_id
      ORDER BY t.datum, t.vrijeme_pocetka
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Greška na serveru');
  }
});

router.get('/opcije', async (req, res) => {
  try {
    const kombinacije = await pool.query(`
      SELECT ip.instruktor_predmet_id, i.ime AS instruktor_ime, i.prezime AS instruktor_prezime, pr.naziv AS predmet
      FROM instruktor_predmet ip
      JOIN instruktor i ON ip.instruktor_id = i.instruktor_id
      JOIN predmet pr ON ip.predmet_id = pr.predmet_id
      ORDER BY pr.naziv
    `);

    const predavaonice = await pool.query('SELECT * FROM predavaonica ORDER BY naziv');

    res.json({
      kombinacije: kombinacije.rows,
      predavaonice: predavaonice.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ poruka: 'Greška na serveru' });
  }
});

// samo admin smije dodavati nove termine
router.post('/', provjeriAdmina, async (req, res) => {
  const { datum, vrijeme_pocetka, trajanje, cijena, predavaonica_id, instruktor_predmet_id } = req.body;

  if (!datum || !vrijeme_pocetka || !trajanje || !cijena || !predavaonica_id || !instruktor_predmet_id) {
    return res.status(400).json({ poruka: 'Nedostaju obavezni podaci' });
  }

  try {
    const rezultat = await pool.query(
      `INSERT INTO termin (datum, vrijeme_pocetka, trajanje, cijena, predavaonica_id, instruktor_predmet_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [datum, vrijeme_pocetka, trajanje, cijena, predavaonica_id, instruktor_predmet_id]
    );

    res.status(201).json(rezultat.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ poruka: 'Greška na serveru' });
  }
});

module.exports = router;