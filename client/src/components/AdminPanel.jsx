import { useState } from 'react';
import Ucenici from './Ucenici';
import Instruktori from './Instruktori';
import Termini from './Termini';
import RezervacijeAdmin from './RezervacijeAdmin';
import NoviTermin from './NoviTermin';

function AdminPanel({ onOdjava }) {
  const [tab, setTab] = useState('rezervacije');
  const [osvjezi, setOsvjezi] = useState(0);

  const tabovi = [
    { id: 'rezervacije', naziv: 'Rezervacije', ikona: '📋' },
    { id: 'ucenici', naziv: 'Učenici', ikona: '🎓' },
    { id: 'instruktori', naziv: 'Instruktori', ikona: '👨‍🏫' },
    { id: 'termini', naziv: 'Termini', ikona: '📅' },
  ];

  const aktivniNaziv = tabovi.find(t => t.id === tab).naziv;

  return (
    <div className="admin-wrapper">
      <div className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="navbar-brand">
            <span className="navbar-logo">🔒</span>
            <span className="navbar-title">Admin panel</span>
          </div>
          <button className="admin-odjava-btn" onClick={onOdjava}>Odjava</button>
        </div>
      </div>

      <div className="admin-body">
        <aside className="admin-sidebar">
          {tabovi.map(t => (
            <button
              key={t.id}
              className={tab === t.id ? 'admin-sidebar-link active' : 'admin-sidebar-link'}
              onClick={() => setTab(t.id)}
            >
              <span>{t.ikona}</span> {t.naziv}
            </button>
          ))}
        </aside>

        <main className="admin-content">
          <h1 className="admin-content-naslov">{aktivniNaziv}</h1>
          {tab === 'rezervacije' && <RezervacijeAdmin />}
          {tab === 'ucenici' && <Ucenici />}
          {tab === 'instruktori' && <Instruktori />}
          {tab === 'termini' && (
            <>
              <NoviTermin onDodano={() => setOsvjezi(o => o + 1)} />
              <Termini key={osvjezi} adminMode={true} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;