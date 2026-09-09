const admin = require('./routes/admin');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ucenici = require('./routes/ucenici');
const instruktori = require('./routes/instruktori');
const predmeti = require('./routes/predmeti');
const termini = require('./routes/termini');
const rezervacije = require('./routes/rezervacije');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/admin', admin);

app.get('/', (req, res) => {
  res.send('Server radi!');
});

app.use('/api/ucenici', ucenici);
app.use('/api/instruktori', instruktori);
app.use('/api/predmeti', predmeti);
app.use('/api/termini', termini);
app.use('/api/rezervacije', rezervacije);

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});