import { useState } from 'react';
import axios from 'axios';
import { formatDatum } from '../utils/format';

function statusBoja(status) {
  if (status === 'potvrdena') return 'status-potvrdena';
  if (status === 'otkazana') return 'status-otkazana';
  return 'status-cekanje';
}

function MojeRezervacije() {
  const [oib, setOib] = useState('');
  const [rezervacije, setRezervacije] = useState(null);
  const [ucitavanje, setUcitavanje] = useState(false);
  const [greska, setGreska] = useState('');
  const [otkazivanjeUTijeku, setOtkazivanjeUTijeku] = useState(null);

  const pretrazi = async (e) => {
    e.preventDefault();
    setGreska('');
    setUcitavanje(true);

    try {
      const res = await axios.get(`http://localhost:5001/api/rezervacije/moje/${oib}`);
      setRezervacije(res.data);
    } catch (err) {
      setGreska('Došlo je do greške. Pokušaj ponovno.');
    } finally {
      setUcitavanje(false);
    }
  };

  const otkazi = async (id) => {
    const potvrda = window.confirm('Jesi li sigurna da želiš otkazati ovu rezervaciju?');
    if (!potvrda) return;

    setOtkazivanjeUTijeku(id);
    try {
      await axios.put(`http://localhost:5001/api/rezervacije/${id}/otkazi`);
      const res = await axios.get(`http://localhost:5001/api/rezervacije/moje/${oib}`);
      setRezervacije(res.data);
    } catch (err) {
      alert('Došlo je do greške pri otkazivanju.');
    } finally {
      setOtkazivanjeUTijeku(null);
    }
  };

  return (
    <div className="moje-rezervacije">
      <div className="steps-header">
        <h2>Moje rezervacije</h2>
        <p>Upiši svoj OIB kako bi pregledala svoje rezervacije</p>
      </div>

      <form onSubmit={pretrazi} className="oib-forma">
        <input
          type="text"
          placeholder="Unesi OIB"
          value={oib}
          onChange={(e) => setOib(e.target.value)}
          maxLength="11"
          required
        />
        <button type="submit" className="cta-button" disabled={ucitavanje}>
          {ucitavanje ? 'Pretraga...' : 'Pretraži'}
        </button>
      </form>

      {greska && <p className="forma-greska">{greska}</p>}

      {rezervacije !== null && (
        rezervacije.length === 0 ? (
          <div className="empty-state">Nema pronađenih rezervacija za taj OIB.</div>
        ) : (
          <div className="card-grid" style={{ marginTop: '30px' }}>
            {rezervacije.map(r => (
              <div className="card" key={r.rezervacija_id}>
                <h3>{r.predmet}</h3>
                <p>👤 {r.instruktor_ime} {r.instruktor_prezime}</p>
                <p>📅 {formatDatum(r.termin_datum)} u {r.vrijeme_pocetka}</p>
                <span className={`status ${statusBoja(r.status)}`}>{r.status}</span>

                {r.status !== 'otkazana' && (
                  <button
                    className="otkazi-btn"
                    onClick={() => otkazi(r.rezervacija_id)}
                    disabled={otkazivanjeUTijeku === r.rezervacija_id}
                  >
                    {otkazivanjeUTijeku === r.rezervacija_id ? 'Otkazivanje...' : 'Otkaži rezervaciju'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default MojeRezervacije;