import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Instruktori from './components/Instruktori';
import Termini from './components/Termini';
import MojeRezervacije from './components/MojeRezervacije';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { dohvatiToken, obrisiToken } from './utils/auth';
import './App.css';

function App() {
  const [aktivniTab, setAktivniTabRaw] = useState(
    sessionStorage.getItem('aktivni_tab') || 'home'
  );
  const [scrollNaPredmet, setScrollNaPredmet] = useState(null);
  const [adminPrijavljen, setAdminPrijavljen] = useState(!!dohvatiToken());

  const setAktivniTab = (tab) => {
    setAktivniTabRaw(tab);
    sessionStorage.setItem('aktivni_tab', tab);
  };

  const idiNaPredmet = (nazivPredmeta) => {
    setAktivniTab('termini');
    setScrollNaPredmet(nazivPredmeta);
  };

  const odjava = () => {
    obrisiToken();
    setAdminPrijavljen(false);
    setAktivniTab('home');
  };

  const tabovi = [
    { id: 'home', naziv: 'Početna', component: <Home onOdaberiPredmet={idiNaPredmet} onIdiNaTermine={() => setAktivniTab('termini')} /> },
    { id: 'termini', naziv: 'Termini', component: <Termini scrollNaPredmet={scrollNaPredmet} /> },
    { id: 'instruktori', naziv: 'Instruktori', component: <Instruktori /> },
    { id: 'moje-rezervacije', naziv: 'Moje rezervacije', component: <MojeRezervacije /> },
  ];

  if (aktivniTab === 'admin') {
    return adminPrijavljen ? (
      <AdminPanel onOdjava={odjava} />
    ) : (
      <AdminLogin onPrijava={() => setAdminPrijavljen(true)} />
    );
  }

  const aktivni = tabovi.find(t => t.id === aktivniTab);
  const jeHome = aktivniTab === 'home';

  return (
    <div className="App">
      <Navbar
        aktivniTab={aktivniTab}
        setAktivniTab={setAktivniTab}
        tabovi={tabovi}
        onAdminKlik={() => setAktivniTab('admin')}
      />

      {!jeHome && (
        <header className="page-header">
          <h1>{aktivni.naziv}</h1>
        </header>
      )}

      <main className={jeHome ? '' : 'content'}>
        {aktivni.component}
      </main>
    </div>
  );
}

export default App;