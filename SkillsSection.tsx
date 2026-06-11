import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '../components/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const SKILL_CATEGORIES = [
  {
    title: 'Development',
    skills: [
      'Python',
      'JavaScript',
      'Flutter',
      'HTML/CSS',
      'SQL',
      'API Integration',
      'GitHub',
      'Shopify',
      'Responsive Design',
    ],
  },
  {
    title: 'Security',
    skills: [
      'Cybersecurity',
      'API Security',
      'AES-256 Encryption',
      'Role-Based Access Control',
      'Penetration Testing',
      'Threat Detection',
      'CompTIA Cloud+',
    ],
  },
  {
    title: 'Design & Tools',
    skills: [
      'UI/UX Design',
      'Figma',
      'SAP S/4HANA',
      'Microsoft Office',
      'Data Analysis',
      'Project Management',
    ],
  },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    const cardEls = cards.querySelectorAll('.skill-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      cardEls,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{ backgroundColor: '#121212', padding: '120px 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading label="EXPERTISE" heading="Technical Skills" />

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SKILL_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="skill-card p-8 rounded"
              style={{
                backgroundColor: '#1E1E1E',
                borderTop: '2px solid #C8A45C',
              }}
            >
              <h3
                className="font-body text-lg font-semibold mb-4"
                style={{ color: '#F5F5F5' }}
              >
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-body text-sm px-3.5 py-1.5 rounded"
                    style={{
                      backgroundColor: 'rgba(200,164,92,0.08)',
                      color: '#9E9E9E',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div
          className="skill-card mt-8 p-8 rounded"
          style={{
            backgroundColor: '#1E1E1E',
            borderTop: '2px solid #C8A45C',
          }}
        >
          <h3
            className="font-body text-lg font-semibold mb-4"
            style={{ color: '#F5F5F5' }}
          >
            Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Arabic (Fluent)', 'English (Fluent)'].map((lang) => (
              <span
                key={lang}
                className="font-body text-sm px-3.5 py-1.5 rounded"
                style={{
                  backgroundColor: 'rgba(200,164,92,0.08)',
                  color: '#9E9E9E',
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
