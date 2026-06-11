import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '../components/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const CERTIFICATIONS = [
  {
    image: '/images/deloitte-cyber.png',
    title: 'Deloitte Australia Cyber Job Simulation',
    issuer: 'Deloitte',
    date: '2026',
  },
  {
    image: '/images/deloitte-data.png',
    title: 'Deloitte Data Analytics',
    issuer: 'Deloitte',
    date: '2026',
  },
  {
    image: '/images/ey-risk.png',
    title: 'EY Technology Risk Virtual Job Simulation',
    issuer: 'EY',
    date: '2026',
  },
  {
    image: '/images/telstra-cyber.png',
    title: 'Cybersecurity Job Simulation',
    issuer: 'Telstra',
    date: '2025',
  },
  {
    image: '/images/sap.png',
    title: 'SAP Dual Study Program (S/4HANA Cloud)',
    issuer: 'SAP',
    date: '2025-2026',
  },
  {
    image: '/images/cisco-cpp.png',
    title: 'C++ Essentials 1',
    issuer: 'Cisco Networking Academy',
    date: '',
  },
  {
    image: '/images/ict.png',
    title: 'Ranked Top 1 in IGCSE ICT',
    issuer: 'Gulf English School',
    date: 'Class of 2022',
  },
];

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const row = rowRef.current;
    if (!section || !row) return;

    const cards = row.querySelectorAll('.cert-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      cards,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      style={{ backgroundColor: '#121212', padding: '120px 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading label="ACCREDITATIONS" heading="Certifications & Awards" />

        {/* Desktop: horizontal scroll row */}
        <div
          ref={rowRef}
          className="flex md:flex-row flex-col gap-5 md:overflow-x-auto pb-4 md:snap-x md:snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.title}
              className="cert-card p-6 rounded flex-shrink-0 transition-all duration-300 md:min-w-[320px] md:snap-start"
              style={{
                backgroundColor: '#1E1E1E',
                borderLeft: '3px solid #C8A45C',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderLeftWidth = '5px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderLeftWidth = '3px';
              }}
            >
              <div className="flex items-start gap-4">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-20 h-20 rounded object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div>
                  <h4
                    className="font-body text-base font-semibold mb-1 leading-snug"
                    style={{ color: '#F5F5F5' }}
                  >
                    {cert.title}
                  </h4>
                  <p
                    className="font-body text-[13px] mb-1"
                    style={{ color: '#9E9E9E' }}
                  >
                    {cert.issuer}
                  </p>
                  {cert.date && (
                    <span
                      className="font-mono text-xs"
                      style={{ color: '#C8A45C' }}
                    >
                      {cert.date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
