const KLJUC = 'admin_token';

export function spremiToken(token) {
  localStorage.setItem(KLJUC, token);
}

export function dohvatiToken() {
  return localStorage.getItem(KLJUC);
}

export function obrisiToken() {
  localStorage.removeItem(KLJUC);
}

// zaglavlje za axios pozive koji traže admin ovlasti
export function authHeader() {
  const token = dohvatiToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}