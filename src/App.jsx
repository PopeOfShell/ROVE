import { useEffect, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';
import './App.css';

import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';
import img6 from '../assets/6.jpg';
import img7 from '../assets/7.jpg';
import img8 from '../assets/8.jpg';
import bgImg   from '../assets/background.png';
import profileImg from '../assets/profile_cutted.png';

const GALLERY = [
  { src: img1, title: 'Salon Nowoczesny',     cat: 'Living Space' },
  { src: img2, title: 'Sypialnia Premium',    cat: 'Bedroom'      },
  { src: img3, title: 'Strefa Wellness',       cat: 'Wellness'     },
  { src: img4, title: 'Salon Dzienny',         cat: 'Living Room'  },
  { src: img5, title: 'Łazienka Marmurowa',   cat: 'Master Bath'  },
  { src: img6, title: 'Gabinet Prywatny',      cat: 'Office'       },
  { src: img7, title: 'Sypialnia z Toaletką', cat: 'Bedroom with a dressing table' },
  { src: img8, title: 'Pokój Gościnny',       cat: 'Guest Room'   },
];

function GalleryItem({ photo, index }) {
  const imgRef  = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const img  = imgRef.current;
      const wrap = wrapRef.current;
      if (!img || !wrap) return;
      const { top, bottom, height } = wrap.getBoundingClientRect();
      const wh = window.innerHeight;
      if (bottom > 0 && top < wh) {
        const progress = (wh - top) / (wh + height);
        const offset   = (progress - 0.5) * 80;
        img.style.transform = `translateY(${offset}px) scale(1.12)`;
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="gi reveal" style={{ '--d': `${(index % 3) * 0.12}s` }}>
      <div className="gi-wrap" ref={wrapRef}>
        <img ref={imgRef} src={photo.src} alt={photo.title} loading="lazy" decoding="async" />
        <div className="gi-cap">
          <span className="gi-cat">{photo.cat}</span>
          <span className="gi-ttl">{photo.title}</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);

  // Close menu on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Header transparency on scroll
  useEffect(() => {
    const hdr = document.getElementById('hdr');
    const fn  = () => hdr?.classList.toggle('on', window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="site">

      {/* ── HEADER ── */}
      <header id="hdr" className="hdr">
        <a href="#hero" className="hdr-logo">ROVE</a>
        <nav className="hdr-nav">
          <a href="#portfolio">Portfolio</a>
          <a href="#about">O mnie</a>
          <a href="#contact">Kontakt</a>
        </nav>
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Otwórz menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* ── MOBILE MENU ── */}
      <div
        className={`mobile-menu${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
      >
        <nav className="mobile-nav" onClick={e => e.stopPropagation()}>
          <a href="#portfolio" onClick={() => setMenuOpen(false)}>Portfolio</a>
          <a href="#about"     onClick={() => setMenuOpen(false)}>O mnie</a>
          <a href="#contact"   onClick={() => setMenuOpen(false)}>Kontakt</a>
        </nav>
      </div>

      {/* ── HERO ── */}
      <section id="hero" className="hero">
        <div className="hero-tex" style={{ backgroundImage: `url(${bgImg})` }} />
        <div className="hero-veil" />
        <div className="hero-pts" aria-hidden="true">
          {[...Array(8)].map((_, i) => <span key={i} className={`pt pt${i}`} />)}
        </div>

        <div className="hero-body">
          <div className="hero-brand reveal">
            <p className="eyebrow">Architecture &amp; Interior Design</p>
            <h1 className="logotype">ROVE</h1>
            <div className="gold-bar" />
            <p className="tagline">
              Przestrzenie tworzone z pasją.<br />
              Projekty pisane elegancją.
            </p>
            <a href="#contact" className="btn-gold">Umów Konsultację</a>
          </div>

          <div className="hero-viewer" aria-hidden="true">
            {!splineLoaded && (
              <div className="spline-loader">
                <span className="spline-spinner" />
              </div>
            )}
            <Spline
              scene="https://prod.spline.design/pa0ZFnLkHiVkq-g7/scene.splinecode"
              onLoad={() => setSplineLoaded(true)}
              style={{ opacity: splineLoaded ? 1 : 0, transition: 'opacity 0.8s ease' }}
            />
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span>SCROLL</span>
          <div className="scroll-tick" />
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="portfolio" className="gallery-sec">
        <header className="sec-hdr reveal">
          <span className="eyebrow">Portfolio</span>
          <h2>Wybrane Realizacje</h2>
          <div className="gold-bar" />
        </header>
        <div className="g-grid">
          {GALLERY.map((p, i) => (
            <GalleryItem key={i} photo={p} index={i} />
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="about-sec">
        <div className="about-inner reveal">
          <div className="about-img">
            <img src={profileImg} alt="Architekt wnętrz" />
          </div>
          <div className="about-txt">
            <span className="eyebrow">O Mnie</span>
            <h2>Sztuka Przestrzeni</h2>
            <div className="gold-bar" />
            <p>
              Tworzę wnętrza, które są zarówno piękne, jak i funkcjonalne.
              Każdy projekt to unikalna historia pisana materiałem, światłem
              i formą. Specjalizuję się w projektach premium, gdzie każdy
              detal ma swoje znaczenie.
            </p>
            <p>
              Bazuję w Krakowie, ale realizacje prowadzę na terenie całej Polski.
            </p>

          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="svc-sec">
        <header className="sec-hdr reveal">
          <span className="eyebrow">Usługi</span>
          <h2>Co Oferuję</h2>
          <div className="gold-bar" />
        </header>
        <div className="svc-grid">
          {[
            { icon: '◈', h: 'Projekt Wnętrza',     b: 'Kompleksowe projekty mieszkań i domów – od koncepcji po realizację.' },
            { icon: '◇', h: 'Dobór Materiałów',    b: 'Selekcja materiałów premium dopasowanych do stylu i budżetu klienta.' },
            { icon: '◆', h: 'Nadzór Realizacji',   b: 'Koordynacja wykonawców i pełny nadzór nad pracami wykończeniowymi.' },
            { icon: '◉', h: 'Metamorfoza Wnętrza', b: 'Odświeżenie przestrzeni bez generalnego remontu – szybko i efektownie.' },
          ].map((s, i) => (
            <div key={i} className="svc-card reveal" style={{ '--d': `${i * 0.1}s` }}>
              <span className="svc-ico">{s.icon}</span>
              <h3>{s.h}</h3>
              <p>{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="cta-sec">
        <div className="cta-inner reveal">
          <span className="eyebrow">Kontakt</span>
          <h2>Porozmawiajmy</h2>
          <div className="gold-bar" />
          <p className="cta-sub">
            Każdy wielki projekt zaczyna się od rozmowy.
            Skontaktuj się, aby umówić bezpłatną konsultację.
          </p>
          <div className="cta-links">
            <a href="tel:+48 515 037 371" className="cta-link">+48 515 037 371</a>
            <span className="cta-dot">·</span>
            <a href="mailto:studio@rove.pl" className="cta-link">studio@rove.pl</a>
          </div>
          <div className="socials">
            <a href="https://www.instagram.com/rove.architektura/" className="soc" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.behance.net/rove_studio_" className="soc" target="_blank" rel="noopener noreferrer">Behance</a>
          </div>
        </div>
      </section>

      <footer className="ft">
        <span>© 2025 ROVE Studio</span>
        <span className="ft-dot">·</span>
        <span>Wszelkie prawa zastrzeżone</span>
      </footer>

    </div>
  );
}
