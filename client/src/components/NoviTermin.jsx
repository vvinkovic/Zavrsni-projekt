import { useState, useEffect } from 'react';
import axios from 'axios';
import { authHeader } from '../utils/auth';

function NoviTermin({ onDodano }) {
  const [opcije, setOpcije] = useState({ kombinacije: [], predavaonice: [] });
  const [podaci, setPodaci] = useState({
    datum: '',
    vrijeme_pocetka: '',
    trajanje: 60,
    cijena: '',
    predavaonica_id: '',
    instruktor_predmet_id: '',
  });
  const [poruka, setPoruka] = useState('');
  const [ucitavanje, setUcitavanje] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5001/api/termini/opcije')
      .then(res => setOpcije(res.data))
      .catch(err => console.error(err));
  }, []);

  const promjena = (e) => {
    setPodaci({ ...podaci, [e.target.name]: e.target.value });
  };

  const posalji = async (e) => {
    e.preventDefault();
    setPoruka('');
    setUcitavanje(true);

    try {
      await axios.post('http://localhost:5001/api/termini', podaci, authHeader());
      setPoruka('✅ Termin uspješno dodan');
      setPodaci({
        datum: '',
        vrijeme_pocetka: '',
        trajanje: 60,
        cijena: '',
        predavaonica_id: '',
        instruktor_predmet_id: '',
      });
      onDodano();
      setTimeout(() => setPoruka(''), 4000);
    } catch (err) {
      setPoruka('❌ Greška pri dodavanju termina');
    } finally {
      setUcitavanje(false);
    }
  };

  return (
    <div className="novi-termin-box">
      <h2 className="admin-content-naslov" style={{ fontSize: '1.15rem', marginBottom: '16px' }}>
        ➕ Dodaj novi termin
      </h2>

      <form onSubmit={posalji} className="forma forma-red">
        <div>
          <label>Predmet / Instruktor</label>
          <select name="instruktor_predmet_id" value={podaci.instruktor_predmet_id} onChange={promjena} required>
            <option value="">Odaberi...</option>
            {opcije.kombinacije.map(k => (
              <option key={k.instruktor_predmet_id} value={k.instruktor_predmet_id}>
                {k.predmet} — {k.instruktor_ime} {k.instruktor_prezime}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Predavaonica</label>
          <select name="predavaonica_id" value={podaci.predavaonica_id} onChange={promjena} required>
            <option value="">Odaberi...</option>
            {opcije.predavaonice.map(p => (
              <option key={p.broj_predavaonice} value={p.broj_predavaonice}>
                {p.naziv}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Datum</label>
          <input type="date" name="datum" value={podaci.datum} onChange={promjena} required />
        </div>

        <div>
          <label>Vrijeme početka</label>
          <input type="time" name="vrijeme_pocetka" value={podaci.vrijeme_pocetka} onChange={promjena} required />
        </div>

        <div>
          <label>Trajanje (min)</label>
          <input type="number" name="trajanje" value={podaci.trajanje} onChange={promjena} required />
        </div>

        <div>
          <label>Cijena (€)</label>
          <input type="number" step="0.01" name="cijena" value={podaci.cijena} onChange={promjena} required />
        </div>

        <button type="submit" className="cta-button" disabled={ucitavanje}>
          {ucitavanje ? 'Dodavanje...' : 'Dodaj termin'}
        </button>
      </form>

      {poruka && <p style={{ marginTop: '12px', fontWeight: 600 }}>{poruka}</p>}
    </div>
  );
}

export default NoviTermin;