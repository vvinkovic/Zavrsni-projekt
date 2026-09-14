import { useState, useEffect } from 'react';
import axios from 'axios';
import { authHeader } from '../utils/auth';

function Ucenici() {
  const [ucenici, setUcenici] = useState([]);
  const [greska, setGreska] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/ucenici', authHeader())
      .then(res => setUcenici(res.data))
      .catch(err => {
        setGreska(err.response?.data?.poruka || 'Greška pri dohvaćanju podataka');
      });
  }, []);

  if (greska) return <div className="empty-state">{greska}</div>;

  return (
    <div className="card-grid">
      {ucenici.map(u => (
        <div className="card" key={u.oib_ucenik}>
          <h3>{u.ime} {u.prezime}</h3>
          <p>📧 {u.email}</p>
          <p>📞 {u.telefon}</p>
        </div>
      ))}
    </div>
  );
}

export default Ucenici;