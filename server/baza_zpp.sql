drop table if exists placanje;
drop table if exists rezervacija;
drop table if exists termin;
drop table if exists instruktor_predmet;
drop table if exists predavaonica;
drop table if exists predmet;
drop table if exists instruktor;
drop table if exists ucenik;

create table ucenik(
	OIB_ucenik varchar(11) constraint ucenik_pk primary key,
	ime varchar(25) not null,
	prezime varchar(50) not null,
	email varchar(40) not null,
	telefon varchar(20) not null
);



select * from ucenik;

create table instruktor (
    instruktor_id serial constraint instruktor_pk primary key,
    ime varchar(25) not null,
    prezime varchar(50) not null,
    email varchar(40) not null,
    telefon varchar(20) not null,
    opis text
);

create table predmet (
    predmet_id serial constraint predmet_pk primary key,
    naziv varchar(100) not null,
    opis varchar(100),
    razina varchar(50)
);


create table predavaonica (
    broj_predavaonice varchar(10) constraint predavaonica_pk primary key,
    naziv varchar(50) not null,
    lokacija varchar(100) not null
);

create table instruktor_predmet (
    instruktor_predmet_id serial constraint instruktor_predmet_pk primary key,
    instruktor_id integer not null constraint instruktor_predmet_instruktor_fk references instruktor(instruktor_id),
    predmet_id integer not null constraint instruktor_predmet_predmet_fk references predmet(predmet_id),
    constraint instruktor_predmet_uk unique (instruktor_id, predmet_id)
);

create table termin (
    termin_id serial constraint termin_pk primary key,
    datum date not null,
    vrijeme_pocetka time not null,
    trajanje integer not null,
    cijena numeric(8,2) not null,
    predavaonica_id varchar(20) not null constraint termin_predavaonica_fk references predavaonica(broj_predavaonice),
    instruktor_predmet_id integer not null constraint termin_instruktor_predmet_fk references instruktor_predmet(instruktor_predmet_id)
);


create table rezervacija (
    rezervacija_id serial constraint rezervacija_pk primary key,
    datum_rezervacije date not null default current_date,
    status varchar(20) not null default 'na cekanju',
    oib_ucenik varchar(11) not null constraint rezervacija_ucenik_fk references ucenik(oib_ucenik),
    termin_id integer not null constraint rezervacija_termin_fk references termin(termin_id)
);

-- osigurava da termin može imati samo jednu aktivnu rezervaciju
create unique index idx_jedna_aktivna_rezervacija
on rezervacija (termin_id)
where status != 'otkazana';


create table placanje (
    placanje_id serial constraint placanje_pk primary key,
    datum_placanja date not null,
    iznos numeric(8,2) not null,
    nacin varchar(30) not null,
    rezervacija_id integer not null constraint placanje_rezervacija_fk unique references rezervacija(rezervacija_id)
);



-- ============================================
-- ucenik (10)
-- ============================================
insert into ucenik (oib_ucenik, ime, prezime, email, telefon) values
('12345678903', 'Zara', 'Mamić', 'zara.mamic@email.com', '0971922587'),
('23456789013', 'Marko', 'Marić', 'marko.maric@email.com', '0962245128'),
('34567890125', 'Ivana', 'Topić', 'ivana.topic@email.com', '0973499482'),
('45678901239', 'Petar', 'Pavić', 'petar.pavic@email.com', '0984562428'),
('56789012343', 'Lucija', 'Lalić', 'lucija.lalic@email.com', '0955865901'),
('67890123455', 'Filip', 'Župan', 'filip.zupan@email.com', '0976886012'),
('78901234569', 'Nikolina', 'Babić', 'nikolina.babic@email.com', '0977824103'),
('89012345673', 'Tomislav', 'Vinković', 'tomislav.vinkovic@email.com', '0988201264'),
('90123456789', 'Katarina', 'Lopić', 'katarina.lopic@email.com', '0989046026'),
('01234567896', 'Ana', 'Dvorski', 'ana.dvorski@email.com', '0970563282');
 
-- ============================================
-- instruktor (5)
-- ============================================
insert into instruktor (ime, prezime, email, telefon, opis) values
('Josip', 'Horvat', 'josip.horvat@email.com', '098362473', 'Diplomirani profesor matematike s dugogodišnjim iskustvom u individualnim instrukcijama za osnovnu i srednju školu.'),
('Maja', 'Mijić', 'maja.mijic@email.com', '0983426821', 'Profesorica kemije i biologije, specijalizirana za pripremu učenika za maturu iz prirodoslovnih predmeta.'),
('Ivan', 'Novak', 'ivan.novak@email.com', '0970852156', 'Iskusan programer i predavač, fokusiran na praktičan pristup učenju programiranja i matematike.'),
('Marko', 'Jurić', 'marko.juric@email.com', '099864255', 'Profesor fizike i kemije s pristupom prilagođenim svakom učeniku individualno.'),
('Luka', 'Lukić', 'luka.lukic@email.com', '0998662415', 'Predavač programiranja i informatike, pomaže učenicima savladati osnove kroz projekte.');
 
-- ============================================
-- predmet (6)
-- ============================================
insert into predmet (naziv, opis, razina) values
('Programiranje', 'Osnove programiranja u Pythonu i Javi', 'Srednja škola'),
('Matematika 1', 'Instrukcije iz matematike za osnovnu školu', 'Osnovna škola'),
('Matematika 2', 'Instrukcije iz matematike za srednju školu', 'Srednja škola'),
('Fizika', 'Instrukcije iz fizike za srednju školu', 'Srednja škola'),
('Kemija', 'Instrukcije iz kemije za srednju školu', 'Srednja škola'),
('Biologija', 'Instrukcije iz biologije za osnovnu i srednju školu', 'Osnovna/Srednja škola'),
('Informatika', 'Osnove informatike', 'Osnovna škola');

-- ============================================
-- predavaonica (4)
-- ============================================

insert into predavaonica (broj_predavaonice, naziv, lokacija) values
(1, 'Učionica 1', 'Osijek, Trg Ante Starčevića 5'),
(2, 'Učionica 2', 'Osijek, Trg Ante Starčevića 5'),
(3, 'Učionica 3', 'Osijek, Kapucinska 42'),
(4, 'Online prostorija', 'Virtualna učionica (Zoom)');

-- ============================================
-- instruktor_predmet (10)
-- ============================================
insert into instruktor_predmet (instruktor_id, predmet_id) values
(1, 2),  -- Josip - Matematika 1
(1, 4),  -- Josip - Fizika
(2, 6),  -- Maja - Biologija
(2, 5),  -- Maja - Kemija
(5, 1),  -- Luka - Programiranje
(5, 7),  -- Luka - Informatika
(4, 5),  -- Marko - Kemija
(4, 4),  -- Marko - Fizika
(3, 3),  -- Ivan - Matematika 2
(3, 1);  -- Ivan - Programiranje

-- ============================================
-- termin (24)
-- ============================================
insert into termin (datum, vrijeme_pocetka, trajanje, cijena, predavaonica_id, instruktor_predmet_id) values
('2026-10-18', '09:00:00', 60, 20.00, '1', 1),
('2026-10-18', '10:30:00', 60, 25.00, '3', 2),
('2026-11-18', '15:00:00', 90, 22.00, '4', 3),
('2026-12-02', '11:00:00', 60, 22.00, '2', 4),
('2026-12-16', '13:00:00', 60, 20.00, '1', 5),
('2026-11-19', '16:00:00', 90, 20.00, '3', 6),
('2026-10-20', '09:00:00', 60, 24.00, '1', 7),
('2026-10-20', '10:30:00', 90, 22.00, '4', 8),
('2026-08-20', '14:00:00', 60, 25.00, '2', 9),
('2026-12-21', '09:30:00', 60, 22.00, '1', 10),
('2026-12-08', '11:00:00', 60, 20.00, '3', 1),
('2026-10-21', '15:30:00', 60, 25.00, '4', 2),
('2026-11-22', '10:00:00', 90, 22.00, '2', 3),
('2026-08-22', '13:00:00', 60, 22.00, '1', 4),
('2026-12-05', '09:00:00', 60, 20.00, '3', 5),
('2026-12-20', '11:30:00', 90, 20.00, '4', 6),
('2026-11-24', '10:00:00', 60, 24.00, '1', 7),
('2026-10-24', '14:00:00', 90, 22.00, '2', 8),
('2026-10-25', '09:00:00', 60, 25.00, '3', 9),
('2026-11-25', '12:00:00', 60, 22.00, '1', 10),
('2026-12-02', '10:00:00', 60, 20.00, '4', 1),
('2026-12-10', '13:30:00', 60, 25.00, '2', 2),
('2026-08-27', '09:00:00', 90, 22.00, '1', 3),
('2026-11-27', '15:00:00', 60, 22.00, '3', 4);

-- ============================================
-- rezervacija (16)
-- ============================================

insert into rezervacija (datum_rezervacije, status, oib_ucenik, termin_id) values
('2026-08-14', 'potvrdena',  '12345678903', 1),
('2026-10-14', 'potvrdena',  '23456789013', 2),
('2026-09-14', 'potvrdena',  '34567890125', 3),
('2026-09-14', 'na cekanju', '45678901239', 4),
('2026-09-15', 'potvrdena',  '56789012343', 5),
('2026-08-12', 'otkazana',   '67890123455', 6),
('2026-08-15', 'potvrdena',  '78901234569', 7),
('2026-09-25', 'potvrdena',  '89012345673', 8),
('2026-08-16', 'na cekanju', '90123456789', 9),
('2026-08-26', 'potvrdena',  '01234567896', 10),
('2026-12-16', 'potvrdena',  '12345678903', 11),
('2026-08-17', 'otkazana',   '23456789013', 12),
('2026-08-17', 'potvrdena',  '34567890125', 13),
('2026-09-25', 'na cekanju', '45678901239', 14),
('2026-08-18', 'potvrdena',  '56789012343', 15),
('2026-09-18', 'potvrdena',  '67890123455', 16);
 
-- ============================================
-- placanje (11 - samo za potvrđene rezervacije)
-- ============================================
insert into placanje (datum_placanja, iznos, nacin, rezervacija_id) values
('2026-08-14', 20.00, 'kartica', 1),
('2026-08-14', 25.00, 'gotovina', 2),
('2026-08-14', 22.00, 'kartica', 3),
('2026-08-15', 20.00, 'kartica', 5),
('2026-08-15', 24.00, 'kartica', 7),
('2026-08-16', 22.00, 'gotovina', 8),
('2026-08-16', 22.00, 'kartica', 10),
('2026-08-16', 20.00, 'gotovina', 11),
('2026-08-17', 22.00, 'kartica', 13),
('2026-08-18', 20.00, 'kartica', 15),
('2026-08-18', 25.00, 'kartica', 16);
