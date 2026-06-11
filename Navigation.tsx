import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'Work', href: '#projects' },
  { label: 'Certs', href: '#certifications' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Section theme detection
    const lightSections = document.querySelectorAll('[data-theme="light"]');
    const triggers: ScrollTrigger[] = [];

    lightSections.forEach((section) => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 64px',
        end: 'bottom 64px',
        onEnter: () => setIsLight(true),
        onLeave: () => setIsLight(false),
        onEnterBack: () => setIsLight(true),
        onLeaveBack: () => setIsLight(false),
      });
      triggers.push(trigger);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const textColor = isLight ? '#121212' : '#F5F5F5';
  const mutedColor = isLight ? '#666666' : '#9E9E9E';

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        height: 64,
        backgroundColor: scrolled ? 'rgba(18,18,18,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-mono text-sm uppercase tracking-[0.15em] font-normal transition-colors duration-300"
          style={{ color: scrolled ? '#F5F5F5' : textColor }}
        >
          SF
        </a>
        <div className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-body text-sm font-medium transition-colors duration-300 hover:opacity-100"
              style={{
                color: scrolled ? '#9E9E9E' : mutedColor,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = scrolled ? '#F5F5F5' : textColor;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = scrolled ? '#9E9E9E' : mutedColor;
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
