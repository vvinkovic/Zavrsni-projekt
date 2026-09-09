import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDatum } from '../utils/format';

function statusBoja(status) {
  if (status === 'potvrdena') return 'status-potvrdena';
  if (status === 'otkazana') return 'status-otkazana';
  return 'status-cekanje';
}

function RezervacijeAdmin() {
  const [rezervacije, setRezervacije] = useState([]);
  const [filterStatus, setFilterStatus] = useState('sve');
  const [filterDatum, setFilterDatum] = useState('');
  const [akcijaUTijeku, setAkcijaUTijeku] = useState(null);

  const dohvatiRezervacije = () => {
    axios.get('http://localhost:5001/api/rezervacije')
      .then(res => setRezervacije(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    dohvatiRezervacije();
  }, []);

  const promijeniStatus = async (id, akcija) => {
    setAkcijaUTijeku(id);
    try {
      await axios.put(`http://localhost:5001/api/rezervacije/${id}/${akcija}`);
      dohvatiRezervacije();
    } catch (err) {
      alert('Došlo je do greške.');
    } finally {
      setAkcijaUTijeku(null);
    }
  };

  const filtrirano = rezervacije.filter(r => {
    const odgovaraStatusu = filterStatus === 'sve' || r.status === filterStatus;
    const odgovaraDatumu = !filterDatum || r.termin_datum.slice(0, 10) === filterDatum;
    return odgovaraStatusu && odgovaraDatumu;
  });

  const obrisiFiltere = () => {
    setFilterStatus('sve');
    setFilterDatum('');
  };

  return (
    <div>
      <div className="filter-traka">
        <div className="filter-grupa">
          <label>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="sve">Svi statusi</option>
            <option value="potvrdena">Potvrđena</option>
            <option value="na cekanju">Na čekanju</option>
            <option value="otkazana">Otkazana</option>
          </select>
        </div>

        <div className="filter-grupa">
          <label>Datum termina</label>
          <input
            type="date"
            value={filterDatum}
            onChange={(e) => setFilterDatum(e.target.value)}
          />
        </div>

        {(filterStatus !== 'sve' || filterDatum) && (
          <button className="filter-reset" onClick={obrisiFiltere}>
            Poništi filtere
          </button>
        )}

        <span className="filter-broj">{filtrirano.length} rezultata</span>
      </div>

      {filtrirano.length === 0 ? (
        <div className="empty-state">Nema rezervacija koje odgovaraju odabranim filterima.</div>
      ) : (
        <div className="card-grid">
          {filtrirano.map(r => (
            <div className="card" key={r.rezervacija_id}>
              <h3>{r.ucenik_ime} {r.ucenik_prezime}</h3>
              <p>📅 {formatDatum(r.termin_datum)}</p>
              <p>🗓️ Rezervirano: {formatDatum(r.datum_rezervacije)}</p>
              <span className={`status ${statusBoja(r.status)}`}>{r.status}</span>

              {r.status === 'na cekanju' && (
                <div className="admin-akcije">
                  <button
                    className="potvrdi-btn"
                    onClick={() => promijeniStatus(r.rezervacija_id, 'potvrdi')}
                    disabled={akcijaUTijeku === r.rezervacija_id}
                  >
                    ✓ Odobri
                  </button>
                  <button
                    className="otkazi-btn"
                    onClick={() => promijeniStatus(r.rezervacija_id, 'otkazi')}
                    disabled={akcijaUTijeku === r.rezervacija_id}
                  >
                    ✕ Odbij
                  </button>
                </div>
              )}

              {r.status === 'potvrdena' && (
                <button
                  className="otkazi-btn"
                  style={{ marginTop: '14px' }}
                  onClick={() => promijeniStatus(r.rezervacija_id, 'otkazi')}
                  disabled={akcijaUTijeku === r.rezervacija_id}
                >
                  Otkaži rezervaciju
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RezervacijeAdmin;