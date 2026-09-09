#  Instrukos – sustav za rezervaciju instrukcija

Završni praktični projekt – baza podataka i web aplikacija za povezivanje učenika i instruktora. Omogućuje pregled dostupnih instruktora i termina, rezervaciju instrukcija te upravljanje rezervacijama kroz administratorski panel.

## Sadržaj

- [Tehnologije](#tehnologije)
- [Preduvjeti](#preduvjeti)
- [Funkcionalnosti](#funkcionalnosti)
- [Struktura projekta](#struktura-projekta)
- [Struktura baze podataka](#struktura-baze-podataka)
- [Pokretanje projekta](#pokretanje-projekta)
- [API rute](#api-rute)
- [Autor](#autor)

## Tehnologije

| Sloj | Tehnologija |
|---|---|
| Baza podataka | PostgreSQL |
| Backend | Node.js, Express |
| Frontend | React |
| Komunikacija | Axios (REST API) |
| Sigurnost | bcrypt (admin autentifikacija) |

## Preduvjeti

Za pokretanje projekta potrebno je unaprijed instalirati:

- **Node.js** (v18 ili noviji) – https://nodejs.org
- **PostgreSQL** – https://www.postgresql.org/download
- **pgAdmin** (dolazi uz PostgreSQL) – za upravljanje bazom podataka

## Funkcionalnosti

**Javni dio:**
- Pregled instruktora i predmeta koje predaju
- Pregled dostupnih termin, grupiranih po predmetu
- Rezervacija termina uz unos osnovnih podataka učenika
- Pregled vlastitih rezervacija putem OIB-a
- Samostalno otkazivanje rezervacije

**Administratorski panel** (zaštićen lozinkom):
- Pregled i upravljanje svim rezervacijama (odobravanje / odbijanje / otkazivanje)
- Filtriranje rezervacija po statusu i datumu
- Pregled svih učenika i instruktora
- Dodavanje novih termina

**Ostalo:**
- Responsive dizajn prilagođen mobilnim uređajima
- Sprječavanje dvostruke rezervacije istog termina

## Struktura projekta

```
Zavrsni projekt/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # React komponente (Termini, Instruktori, Admin...)
│       └── App.js
│
└── server/                 # Node.js/Express backend
    ├── routes/             # API rute (ucenici, instruktori, termini...)
    ├── db.js               # veza s PostgreSQL bazom
    ├── server.js
    └── .env.example        # predložak za konfiguraciju
```

## Struktura baze podataka

Relacijska baza podataka je izrađena u PostgreSQL-u i sadrži 8 međusobno povezanih tablica.

### Pregled tablica

**`ucenik`**
| Stupac | Tip | Opis |
|---|---|---|
| `oib_ucenik` | VARCHAR(11) PK | jedinstveni identifikator učenika |
| `ime`, `prezime` | VARCHAR | osnovni podaci |
| `email`, `telefon` | VARCHAR | kontakt podaci |

**`instruktor`**
| Stupac | Tip | Opis |
|---|---|---|
| `instruktor_id` | SERIAL PK | jedinstveni identifikator |
| `ime`, `prezime` | VARCHAR | osnovni podaci |
| `email`, `telefon` | VARCHAR | kontakt podaci |
| `opis` | TEXT | kratki bio instruktora |

**`predmet`**
| Stupac | Tip | Opis |
|---|---|---|
| `predmet_id` | SERIAL PK | jedinstveni identifikator |
| `naziv` | VARCHAR | naziv predmeta |
| `opis` | VARCHAR | kratki opis |
| `razina` | VARCHAR | razina (osnovna/srednja škola) |

**`predavaonica`**
| Stupac | Tip | Opis |
|---|---|---|
| `broj_predavaonice` | SERIAL PK | jedinstveni identifikator |
| `naziv`, `lokacija` | VARCHAR | podaci o prostoriji |

**`instruktor_predmet`** – rješava vezu M:N između instruktora i predmeta
| Stupac | Tip | Opis |
|---|---|---|
| `instruktor_predmet_id` | SERIAL PK | jedinstveni identifikator kombinacije |
| `instruktor_id` | FK → instruktor | |
| `predmet_id` | FK → predmet | |
| — | UNIQUE(instruktor_id, predmet_id) | sprječava duplikate iste kombinacije |

**`termin`**
| Stupac | Tip | Opis |
|---|---|---|
| `termin_id` | SERIAL PK | jedinstveni identifikator |
| `datum`, `vrijeme_pocetka`, `trajanje` | DATE / TIME / INTEGER | vrijeme održavanja |
| `cijena` | NUMERIC(8,2) | cijena termina |
| `predavaonica_id` | FK → predavaonica | |
| `instruktor_predmet_id` | FK → instruktor_predmet | referencira kombinaciju instruktor+predmet, ne oba zasebno |

**`rezervacija`**
| Stupac | Tip | Opis |
|---|---|---|
| `rezervacija_id` | SERIAL PK | jedinstveni identifikator |
| `datum_rezervacije` | DATE | datum kreiranja |
| `status` | VARCHAR | na čekanju / potvrđena / otkazana |
| `oib_ucenik` | FK → ucenik | |
| `termin_id` | FK → termin | |

**`placanje`**
| Stupac | Tip | Opis |
|---|---|---|
| `placanje_id` | PK | jedinstveni identifikator |
| `datum_placanja`, `iznos`, `nacin` | DATE / NUMERIC / VARCHAR | podaci o plaćanju |
| `rezervacija_id` | FK → rezervacija, UNIQUE | veza 1:1 s rezervacijom |

### Ključne dizajnerske odluke

- **Sprječavanje dvostruke rezervacije:** budući da su instrukcije individualne, jedan termin smije imati najviše jednu aktivnu rezervaciju. To je implementirano djelomičnim unique indeksom:
  ```sql
  CREATE UNIQUE INDEX idx_jedna_aktivna_rezervacija
  ON rezervacija (termin_id)
  WHERE status != 'otkazana';
  ```
  Ovo dopušta više *otkazanih* zapisa za isti termin (povijest), ali samo jednu *aktivnu* rezervaciju u danom trenutku.

## Pokretanje projekta

### 1. Baza podataka

1. Otvoriti pgAdmin i kreirati novu, praznu bazu podataka
2. Pokrenuti SQL skriptu za izradu tablica (CREATE TABLE naredbe za svih 8 tablica)
3. Po potrebi ubaciti testne podatke (INSERT naredbe)

### 2. Backend

U `server` folderu kreirati `.env` datoteku (prema predlošku `.env.example`) i upisati svoje podatke:

```dotenv
DB_USER=postgres
DB_HOST=localhost
DB_NAME=naziv_baze
DB_PASSWORD=vasa_lozinka
DB_PORT=5432
ADMIN_LOZINKA=vasa_admin_lozinka
```

Zatim pokrenuti:

```bash
cd server
npm install
node server.js
```

Backend API dostupan je na `http://localhost:5001`.

### 3. Frontend

U novom terminalu:

```bash
cd client
npm install
npm start
```

Aplikacija je dostupna na `http://localhost:3000`.

> **Napomena:** Projekt koristi lokalnu PostgreSQL bazu podataka koja nije uključena u repozitorij (samo struktura kroz kod). Za potpuno pokretanje potrebno je prethodno kreirati bazu prema uputama iznad.

## API rute

| Metoda | Ruta | Opis |
|---|---|---|
| GET | `/api/ucenici` | popis svih učenika |
| GET | `/api/instruktori` | popis instruktora s predmetima koje predaju |
| GET | `/api/predmeti` | popis svih predmeta |
| GET | `/api/termini` | popis termina (s oznakom je li slobodan) |
| GET | `/api/termini/opcije` | opcije za formu dodavanja termina |
| POST | `/api/termini` | dodavanje novog termina (admin) |
| GET | `/api/rezervacije` | popis svih rezervacija |
| GET | `/api/rezervacije/moje/:oib` | rezervacije za određenog učenika |
| POST | `/api/rezervacije` | kreiranje nove rezervacije |
| PUT | `/api/rezervacije/:id/potvrdi` | potvrda rezervacije (admin) |
| PUT | `/api/rezervacije/:id/otkazi` | otkazivanje rezervacije |
| POST | `/api/admin/login` | prijava u administratorski panel |

## Autor

Izradila: Vanessa Vinković
