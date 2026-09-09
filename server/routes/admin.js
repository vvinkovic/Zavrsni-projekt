const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/login', (req, res) => {
  const { lozinka } = req.body;

  if (lozinka === process.env.ADMIN_LOZINKA) {
    res.json({ uspjeh: true });
  } else {
    res.status(401).json({ uspjeh: false, poruka: 'Pogrešna lozinka' });
  }
});

module.exports = router;