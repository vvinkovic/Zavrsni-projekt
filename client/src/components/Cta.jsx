function Cta({ onKlik }) {
  return (
    <section className="cta">
      <h2>Trebaš pomoć oko učenja?</h2>
      <p>Pronađi instruktora za svoj predmet i rezerviraj termin već danas</p>
      <button className="cta-button" onClick={onKlik}>Pogledaj termine</button>
    </section>
  );
}

export default Cta;