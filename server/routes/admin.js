const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { lozinka } = req.body;

  if (!lozinka) {
    return res.status(400).json({ poruka: 'Lozinka je obavezna' });
  }

  try {
    const podudara = await bcrypt.compare(lozinka, process.env.ADMIN_LOZINKA_HASH);

    if (!podudara) {
      return res.status(401).json({ poruka: 'Pogrešna lozinka' });
    }

    const token = jwt.sign({ uloga: 'admin' }, process.env.JWT_SECRET, { expiresIn: '4h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ poruka: 'Greška na serveru' });
  }
});

module.exports = router;