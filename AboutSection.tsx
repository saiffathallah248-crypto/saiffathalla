import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '../components/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    if (!section || !image || !text) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      image,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    const textEls = text.querySelectorAll('.animate-in');
    tl.fromTo(
      textEls,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' },
      '-=0.4'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      data-theme="light"
      style={{ backgroundColor: '#F5F5F5', padding: '120px 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
          {/* Image */}
          <div ref={imageRef} className="w-full md:w-[45%]">
            <div
              className="overflow-hidden rounded"
              style={{ borderLeft: '3px solid #C8A45C' }}
            >
              <img
                src="/images/saif-hero.png"
                alt="Saif Fathalla"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text */}
          <div ref={textRef} className="w-full md:w-[55%]">
            <div className="animate-in">
              <SectionHeading
                label="ABOUT ME"
                heading="Bridging Security & Development"
                light
              />
            </div>
            <p
              className="animate-in font-body text-base leading-[1.7] mb-5"
              style={{ color: '#121212' }}
            >
              I'm a Cybersecurity and Web Development student at the University of
              East London, with hands-on experience building secure, scalable web
              applications, AI systems, and UI/UX driven platforms.
            </p>
            <p
              className="animate-in font-body text-base leading-[1.7] mb-5"
              style={{ color: '#121212' }}
            >
              Skilled in Python, JavaScript, Flutter, Figma, and SAP, with strong
              expertise in cybersecurity, API security, and full-stack development.
              I've delivered real-world projects, worked with international freelance
              clients, and earned award-winning certifications focused on
              performance, security, and user experience.
            </p>
            <p
              className="animate-in font-body text-base leading-[1.7] mb-8"
              style={{ color: '#121212' }}
            >
              Fluent in Arabic and English. Based in Cairo, Egypt. Open to
              opportunities worldwide.
            </p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="animate-in font-body text-base transition-all duration-300 hover:underline inline-block"
              style={{ color: '#C8A45C' }}
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
