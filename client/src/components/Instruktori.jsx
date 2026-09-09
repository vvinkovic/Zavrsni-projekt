import { useState, useEffect } from 'react';
import axios from 'axios';

function Instruktori() {
  const [instruktori, setInstruktori] = useState([]);
  const [otvoren, setOtvoren] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5001/api/instruktori')
      .then(res => setInstruktori(res.data))
      .catch(err => console.error(err));
  }, []);

  const prekidac = (id) => {
    setOtvoren(otvoren === id ? null : id);
  };

  return (
    <div className="instruktor-lista">
      {instruktori.map(i => {
        const jeOtvoren = otvoren === i.instruktor_id;
        return (
          <div className={`instruktor-red ${jeOtvoren ? 'otvoren' : ''}`} key={i.instruktor_id}>
            <button className="instruktor-glava" onClick={() => prekidac(i.instruktor_id)}>
              <div className="instruktor-osnovno">
                <h3>{i.ime} {i.prezime}</h3>
                <span className="instruktor-predmeti">{i.predmeti.join(', ')}</span>
              </div>
              <span className={`instruktor-strelica ${jeOtvoren ? 'rotirano' : ''}`}>›</span>
            </button>

            {jeOtvoren && (
            <div className="instruktor-detalji">
              <div className="instruktor-kontakt-red">
                <p>📧 {i.email}</p>
                <p>📞 {i.telefon}</p>
              </div>
              {i.opis && <p className="instruktor-opis">{i.opis}</p>}
            </div>
          )}
          </div>
        );
      })}
    </div>
  );
}

export default Instruktori;