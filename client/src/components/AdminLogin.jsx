import { useState } from 'react';
import axios from 'axios';
import { spremiToken } from '../utils/auth';

function AdminLogin({ onPrijava }) {
  const [lozinka, setLozinka] = useState('');
  const [greska, setGreska] = useState('');
  const [ucitavanje, setUcitavanje] = useState(false);

  const posalji = async (e) => {
    e.preventDefault();
    setGreska('');
    setUcitavanje(true);

    try {
      const res = await axios.post('http://localhost:5001/api/admin/login', { lozinka });
      spremiToken(res.data.token);
      onPrijava();
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Pogrešna lozinka');
    } finally {
      setUcitavanje(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-box">
        <h2>🔒 Admin prijava</h2>
        <form onSubmit={posalji} className="forma">
          <label>Lozinka</label>
          <input
            type="password"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            required
            autoFocus
          />
          {greska && <p className="forma-greska">{greska}</p>}
          <button type="submit" className="cta-button" disabled={ucitavanje}>
            {ucitavanje ? 'Provjera...' : 'Prijavi se'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;