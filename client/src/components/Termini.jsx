import { useState, useEffect } from 'react';
import axios from 'axios';
import RezervacijaForma from './RezervacijaForma';
import { formatDatum } from '../utils/format';

const ikone = {
  'Matematika 1': '🔢',
  'Matematika 2': '📐',
  'Fizika': '⚛️',
  'Kemija': '🧪',
  'Biologija': '🌱',
  'Informatika': '💻',
  'Programiranje': '👨‍💻',
};

function slug(naziv) {
  return naziv.toLowerCase().replace(/\s+/g, '-');
}

function Termini({ scrollNaPredmet, adminMode }) { 
  const [termini, setTermini] = useState([]);
  const [odabraniTermin, setOdabraniTermin] = useState(null);
  const [porukaUspjeha, setPorukaUspjeha] = useState('');

  const dohvatiTermine = () => {
    axios.get('http://localhost:5001/api/termini')
      .then(res => setTermini(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    dohvatiTermine();
  }, []);

  useEffect(() => {
    if (scrollNaPredmet && termini.length > 0) {
      const el = document.getElementById(`predmet-${slug(scrollNaPredmet)}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [scrollNaPredmet, termini]);

  const uspjesnaRezervacija = (napomena) => {
  setOdabraniTermin(null);
  setPorukaUspjeha(
    napomena
      ? `Rezervacija je uspješno kreirana! ${napomena}`
      : 'Rezervacija je uspješno kreirana! Instruktor će je uskoro potvrditi.'
  );
  dohvatiTermine();
  setTimeout(() => setPorukaUspjeha(''), 7000);
};

  const grupirano = termini.reduce((acc, t) => {
    if (!acc[t.predmet]) acc[t.predmet] = [];
    acc[t.predmet].push(t);
    return acc;
  }, {});

  const nazivi = Object.keys(grupirano).sort();

  return (
    <div>
      {porukaUspjeha && <div className="poruka-uspjeh">✅ {porukaUspjeha}</div>}

      {nazivi.map(naziv => (
        <section className="predmet-sekcija" id={`predmet-${slug(naziv)}`} key={naziv}>
          <h2 className="predmet-naslov">
            <span>{ikone[naziv] || '📘'}</span> {naziv}
          </h2>

          <div className="card-grid">
            {grupirano[naziv].map(t => (
              <div className={`card ${!t.slobodan ? 'card-zauzeto' : ''}`} key={t.termin_id}>
                <h3>{t.predmet}</h3>
                <p>👤 {t.instruktor_ime} {t.instruktor_prezime}</p>
                <p>📅 {formatDatum(t.datum)}</p>
                <p>⏱️ {t.trajanje} min</p>
                <p>🏫 {t.predavaonica}</p>
                <p style={{ fontWeight: 700, color: '#1e40af', fontSize: '1rem', marginTop: '10px' }}>
                  {t.cijena} €
                </p>

                {!adminMode && (t.slobodan ? (
                  <button className="rezerviraj-btn" onClick={() => setOdabraniTermin(t)}>
                    Rezerviraj
                  </button>
                ) : (
                  <span className="status status-otkazana">Zauzeto</span>
                )
              )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {odabraniTermin && (
        <RezervacijaForma
          termin={odabraniTermin}
          onZatvori={() => setOdabraniTermin(null)}
          onUspjeh={uspjesnaRezervacija}
        />
      )}
    </div>
  );
}

export default Termini;