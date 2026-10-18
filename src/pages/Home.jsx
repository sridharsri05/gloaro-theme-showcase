import Hero from './home/Hero.jsx';
import { Categories, Cta, Faq, Marquee, Process, Statement, Stats, ThemeScroller, Why } from './home/Sections.jsx';
import './home/home.css';

export default function Home() {
  return (
    <div className="home">
      <Hero />
      <Marquee />
      <Statement />
      <ThemeScroller />
      <Categories />
      <Process />
      <Stats />
      <Why />
      <Faq />
      <Cta />
    </div>
  );
}
