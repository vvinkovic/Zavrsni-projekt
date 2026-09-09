function Navbar({ aktivniTab, setAktivniTab, tabovi, onAdminKlik }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="navbar-logo">📚</span>
          <span className="navbar-title">Instrukos</span>
        </div>

        <div className="navbar-links">
          {tabovi.map(tab => (
            <button
              key={tab.id}
              className={aktivniTab === tab.id ? 'navbar-link active' : 'navbar-link'}
              onClick={() => setAktivniTab(tab.id)}
            >
              {tab.naziv}
            </button>
          ))}
          <button className="navbar-link navbar-admin" onClick={onAdminKlik}>
            🔒 Admin
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;