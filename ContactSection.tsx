import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '../components/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      content,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      data-theme="light"
      style={{ backgroundColor: '#F5F5F5', padding: '120px 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div ref={contentRef} className="text-center">
          <SectionHeading
            label="LET'S CONNECT"
            heading="Ready to build something secure?"
            light
          />

          <p
            className="font-body text-base leading-[1.6] mx-auto mb-8"
            style={{ color: '#9E9E9E', maxWidth: 480 }}
          >
            Open for freelance projects, internships, and full-time opportunities
            in cybersecurity and web development.
          </p>

          <a
            href="mailto:saiffathallah248@gmail.com"
            className="font-body text-xl md:text-2xl font-medium block mb-3 transition-all duration-300 hover:underline"
            style={{ color: '#C8A45C' }}
          >
            saiffathallah248@gmail.com
          </a>

          <p
            className="font-body text-base mb-6"
            style={{ color: '#121212' }}
          >
            +20 112 428 7186
          </p>

          <div className="flex items-center justify-center gap-6 mb-4">
            <a
              href="https://www.linkedin.com/in/saif-fathallah-775a0034b"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm transition-colors duration-300"
              style={{ color: '#9E9E9E' }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#121212';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '#9E9E9E';
              }}
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/saiffathallah248"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm transition-colors duration-300"
              style={{ color: '#9E9E9E' }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#121212';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '#9E9E9E';
              }}
            >
              GitHub
            </a>
          </div>

          <p className="font-body text-sm" style={{ color: '#9E9E9E' }}>
            Cairo, Egypt
          </p>
        </div>
      </div>
    </section>
  );
}
