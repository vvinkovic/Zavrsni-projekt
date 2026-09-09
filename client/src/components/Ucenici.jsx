import { useState, useEffect } from 'react';
import axios from 'axios';

function Ucenici() {
  const [ucenici, setUcenici] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/ucenici')
      .then(res => setUcenici(res.data))
      .catch(err => console.error(err));
  }, []);

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