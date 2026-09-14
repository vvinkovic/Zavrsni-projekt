import { useState } from 'react';
import axios from 'axios';

function RezervacijaForma({ termin, onZatvori, onUspjeh }) {
  const [podaci, setPodaci] = useState({
    oib_ucenik: '',
    ime: '',
    prezime: '',
    email: '',
    telefon: '',
  });
  const [greska, setGreska] = useState('');
  const [ucitavanje, setUcitavanje] = useState(false);

  const promjena = (e) => {
    setPodaci({ ...podaci, [e.target.name]: e.target.value });
  };
  const posalji = async (e) => {
    e.preventDefault();
    setGreska('');
    setUcitavanje(true);

  try {
    const res = await axios.post('http://localhost:5001/api/rezervacije', {
      ...podaci,
      termin_id: termin.termin_id,
    });
    onUspjeh(res.data.napomena);
  } catch (err) {
    setGreska(err.response?.data?.poruka || 'Došlo je do greške. Pokušaj ponovno.');
  } finally {
    setUcitavanje(false);
  }

  };

  return (
    <div className="modal-overlay" onClick={onZatvori}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onZatvori}>✕</button>

        <h2>Rezervacija termina</h2>
        <p className="modal-podnaslov">
          {termin.predmet} — {new Date(termin.datum).toLocaleDateString('hr-HR')} u {termin.vrijeme_pocetka}
        </p>
        <p className="modal-podnaslov">
          Instruktor: {termin.instruktor_ime} {termin.instruktor_prezime}
        </p>

        <form onSubmit={posalji} className="forma">
          <label>OIB</label>
          <input
            type="text"
            name="oib_ucenik"
            value={podaci.oib_ucenik}
            onChange={promjena}
            maxLength="11"
            required
          />

          <label>Ime</label>
          <input type="text" name="ime" value={podaci.ime} onChange={promjena} required />

          <label>Prezime</label>
          <input type="text" name="prezime" value={podaci.prezime} onChange={promjena} required />

          <label>Email</label>
          <input type="email" name="email" value={podaci.email} onChange={promjena} required />

          <label>Telefon</label>
          <input type="text" name="telefon" value={podaci.telefon} onChange={promjena} required />

          {greska && <p className="forma-greska">{greska}</p>}

          <button type="submit" className="cta-button" disabled={ucitavanje}>
            {ucitavanje ? 'Slanje...' : 'Potvrdi rezervaciju'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RezervacijaForma;