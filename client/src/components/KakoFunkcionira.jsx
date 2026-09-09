function KakoFunkcionira() {
  const koraci = [
    {
      broj: '01',
      naslov: 'Pronađi predmet',
      opis: 'Pregledaj dostupne predmete i odaberi onaj koji ti treba pomoć — od matematike do informatike.',
      ikona: '🔍',
    },
    {
      broj: '02',
      naslov: 'Odaberi termin',
      opis: 'Pogledaj dostupne termine kod instruktora koji predaje taj predmet i odaberi vrijeme koje ti odgovara.',
      ikona: '📅',
    },
    {
      broj: '03',
      naslov: 'Rezerviraj i plati',
      opis: 'Potvrdi rezervaciju, odaberi način plaćanja i spreman/na si za instrukcije.',
      ikona: '✅',
    },
  ];

  return (
    <section className="steps">
      <div className="steps-header">
        <h2>Kako rezervirati termin</h2>
        <p>Tri jednostavna koraka do tvoje prve instrukcije</p>
      </div>

      <div className="steps-grid">
        {koraci.map(k => (
          <div className="step-card" key={k.broj}>
            <span className="step-number">{k.broj}</span>
            <div className="step-icon">{k.ikona}</div>
            <h3>{k.naslov}</h3>
            <p>{k.opis}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default KakoFunkcionira;