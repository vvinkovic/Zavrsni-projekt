const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const provjeriAdmina = require('../middleware/adminAuth');
const { isValidOIB } = require('../utils/oib');

// GET sve rezervacije (admin)
router.get('/', provjeriAdmina, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.rezervacija_id,
        to_char(r.datum_rezervacije, 'YYYY-MM-DD') AS datum_rezervacije,
        r.status,
        u.ime AS ucenik_ime,
        u.prezime AS ucenik_prezime,
        to_char(t.datum, 'YYYY-MM-DD') AS termin_datum,
        t.vrijeme_pocetka
      FROM rezervacija r
      JOIN ucenik u ON r.oib_ucenik = u.oib_ucenik
      JOIN termin t ON r.termin_id = t.termin_id
      ORDER BY r.datum_rezervacije DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Greška na serveru');
  }
});

// POST nova rezervacija (javno)
router.post('/', async (req, res) => {
  const { oib_ucenik, ime, prezime, email, telefon, termin_id } = req.body;

  if (!oib_ucenik || !ime || !prezime || !email || !termin_id) {
    return res.status(400).json({ poruka: 'Nedostaju obavezni podaci' });
  }

  if (!isValidOIB(oib_ucenik)) {
    return res.status(400).json({ poruka: 'OIB nije ispravan' });
  }

  try {
    let napomena = null;

    const postoji = await pool.query('SELECT * FROM ucenik WHERE oib_ucenik = $1', [oib_ucenik]);

    if (postoji.rows.length === 0) {
      await pool.query(
        'INSERT INTO ucenik (oib_ucenik, ime, prezime, email, telefon) VALUES ($1, $2, $3, $4, $5)',
        [oib_ucenik, ime, prezime, email, telefon]
      );
    } else {
      napomena = 'Pod ovim OIB-om već postoji učenik u sustavu - korišteni su postojeći spremljeni podaci.';
    }

    const zauzet = await pool.query(
      `SELECT * FROM rezervacija WHERE termin_id = $1 AND status != 'otkazana'`,
      [termin_id]
    );

    if (zauzet.rows.length > 0) {
      return res.status(400).json({ poruka: 'Termin je već rezerviran' });
    }

    const novaRezervacija = await pool.query(
      `INSERT INTO rezervacija (status, oib_ucenik, termin_id) VALUES ('na cekanju', $1, $2) RETURNING *`,
      [oib_ucenik, termin_id]
    );

    res.status(201).json({ ...novaRezervacija.rows[0], napomena });
  } catch (err) {
    // 23505 = povreda unique indexa - netko je rezervirao taj termin u međuvremenu
    if (err.code === '23505') {
      return res.status(400).json({ poruka: 'Termin je već rezerviran' });
    }
    console.error(err.message);
    res.status(500).json({ poruka: 'Greška na serveru' });
  }
});

// GET rezervacije za konkretnog učenika (po OIB-u)
router.get('/moje/:oib', async (req, res) => {
  const { oib } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        r.rezervacija_id,
        to_char(r.datum_rezervacije, 'YYYY-MM-DD') AS datum_rezervacije,
        r.status,
        to_char(t.datum, 'YYYY-MM-DD') AS termin_datum,
        t.vrijeme_pocetka,
        pr.naziv AS predmet,
        i.ime AS instruktor_ime,
        i.prezime AS instruktor_prezime
      FROM rezervacija r
      JOIN termin t ON r.termin_id = t.termin_id
      JOIN instruktor_predmet ip ON t.instruktor_predmet_id = ip.instruktor_predmet_id
      JOIN predmet pr ON ip.predmet_id = pr.predmet_id
      JOIN instruktor i ON ip.instruktor_id = i.instruktor_id
      WHERE r.oib_ucenik = $1
      ORDER BY r.datum_rezervacije DESC
    `, [oib]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ poruka: 'Greška na serveru' });
  }
});

// PUT otkazivanje - vlasnik (OIB) ili admin
router.put('/:id/otkazi', async (req, res) => {
  const { id } = req.params;
  const { oib_ucenik } = req.body;
  const authHeader = req.headers.authorization;

  let jeAdmin = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
      jeAdmin = true;
    } catch (err) {
      // token nevažeći - tretiramo kao da nije admin
    }
  }

  try {
    const rezervacija = await pool.query(
      'SELECT * FROM rezervacija WHERE rezervacija_id = $1',
      [id]
    );

    if (rezervacija.rows.length === 0) {
      return res.status(404).json({ poruka: 'Rezervacija nije pronađena' });
    }

    if (!jeAdmin && rezervacija.rows[0].oib_ucenik !== oib_ucenik) {
      return res.status(403).json({ poruka: 'Nemate ovlasti otkazati ovu rezervaciju' });
    }

    const rezultat = await pool.query(
      `UPDATE rezervacija SET status = 'otkazana' WHERE rezervacija_id = $1 RETURNING *`,
      [id]
    );

    res.json(rezultat.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ poruka: 'Greška na serveru' });
  }
});

// PUT potvrda rezervacije (admin) - kreira i zapis o plaćanju
router.put('/:id/potvrdi', provjeriAdmina, async (req, res) => {
  const { id } = req.params;

  try {
    const rezervacija = await pool.query(
      `SELECT r.*, t.cijena FROM rezervacija r JOIN termin t ON r.termin_id = t.termin_id WHERE r.rezervacija_id = $1`,
      [id]
    );

    if (rezervacija.rows.length === 0) {
      return res.status(404).json({ poruka: 'Rezervacija nije pronađena' });
    }

    const rezultat = await pool.query(
      `UPDATE rezervacija SET status = 'potvrdena' WHERE rezervacija_id = $1 RETURNING *`,
      [id]
    );

    const postojiPlacanje = await pool.query(
      'SELECT * FROM placanje WHERE rezervacija_id = $1',
      [id]
    );

    if (postojiPlacanje.rows.length === 0) {
      await pool.query(
        `INSERT INTO placanje (datum_placanja, iznos, nacin, rezervacija_id) VALUES (CURRENT_DATE, $1, 'gotovina', $2)`,
        [rezervacija.rows[0].cijena, id]
      );
    }

    res.json(rezultat.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ poruka: 'Greška na serveru' });
  }
});

module.exports = router;