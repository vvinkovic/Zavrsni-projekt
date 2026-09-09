import { useState, useEffect } from 'react';
import axios from 'axios';

const ikone = {
  'Matematika 1': '🔢',
  'Matematika 2': '📐',
  'Fizika': '⚛️',
  'Kemija': '🧪',
  'Biologija': '🌱',
  'Informatika': '💻',
  'Programiranje': '👨‍💻',
};

function Predmeti({ onOdaberi }) {
  const [predmeti, setPredmeti] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/predmeti')
      .then(res => setPredmeti(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="predmeti-section">
      <div className="steps-header">
        <h2>Pronađi svoj predmet</h2>
        <p>Odaberi predmet i pregledaj dostupne instruktore i termine</p>
      </div>

      <div className="predmeti-grid-nova">
        {predmeti.map(p => (
          <div className="predmet-kartica" key={p.predmet_id} onClick={() => onOdaberi(p.naziv)}>
            <div className="predmet-krug">{ikone[p.naziv] || '📘'}</div>
            <h3>{p.naziv}</h3>
            {p.razina && <span className="predmet-razina">{p.razina}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Predmeti;