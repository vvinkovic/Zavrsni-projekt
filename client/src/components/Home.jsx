import Hero from './Hero';
import ONama from './ONama';
import KakoFunkcionira from './KakoFunkcionira';
import Predmeti from './Predmeti';
import Cta from './Cta';

function Home({ onOdaberiPredmet, onIdiNaTermine }) {
  return (
    <>
      <Hero />
      <ONama />
      <Predmeti onOdaberi={onOdaberiPredmet} />
      <KakoFunkcionira />
      <Cta onKlik={onIdiNaTermine} />
    </>
  );
}

export default Home;