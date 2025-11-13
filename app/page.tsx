import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Popular from '@/components/Popular/Popular';
import OurTravelers from '@/components/OurTravelers/OurTravelers';
import Join from '@/components/Join/Join';
import css from './Home.module.css';

export default function MainPage() {
  return (
    <main className={css.main}>
      <Hero />
      <About />
      <Popular />
      <OurTravelers />
      <Join />
    </main>
  );
}
