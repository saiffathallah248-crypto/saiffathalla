import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '../components/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    title: 'CyberLearnHub',
    image: '/images/cyberlearn89.png',
    description:
      'Cybersecurity education platform with Red Team & Blue Team learning paths, progress tracking, and certification system.',
    tags: ['CYBERSECURITY', 'PLATFORM', 'EDUCATION'],
  },
  {
    title: 'SecureShare',
    image: '/images/secureshare-dashboard.png',
    description:
      'Secure file-sharing platform with AES-256 encryption, password protection, and time-limited access links. Role-based access control with real-time activity monitoring.',
    tags: ['SECURITY', 'FULL-STACK', 'ENCRYPTION'],
  },
  {
    title: 'Rotaract Golf Madinaty',
    image: '/images/rotaract-golf-madinaty.png',
    description:
      'Official website for the Rotaract community with membership applications, event showcases, and leadership sections.',
    tags: ['WEB DESIGN', 'COMMUNITY', 'RESPONSIVE'],
  },
  {
    title: 'API Abuse Detection',
    image: '/images/liveapi.png',
    description:
      'ML-powered API security monitoring system with real-time traffic analysis, anomaly detection, and interactive Streamlit dashboard.',
    tags: ['MACHINE LEARNING', 'API SECURITY', 'PYTHON'],
  },
  {
    title: 'Construction Management',
    image: '/images/constructio.png',
    description:
      'Web platform for construction teams with project timelines, workflow dashboards, and real-time progress monitoring.',
    tags: ['WEB APP', 'DASHBOARD', 'MANAGEMENT'],
  },
  {
    title: 'Freelance Portfolio',
    image: '/images/upworkfreelance.png',
    description:
      'International web development for clients across the US and Canada via Upwork and Freelancer platforms.',
    tags: ['FREELANCE', 'WEB DEV', 'INTERNATIONAL'],
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const cards = grid.querySelectorAll('.project-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      cards,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      data-theme="light"
      style={{ backgroundColor: '#F5F5F5', padding: '120px 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading label="FEATURED WORK" heading="Projects" light />

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {PROJECTS.map((project) => (
            <div
              key={project.title}
              className="project-card rounded overflow-hidden transition-all duration-400 cursor-default"
              style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
              }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3
                  className="font-body text-xl font-semibold mb-2"
                  style={{ color: '#121212' }}
                >
                  {project.title}
                </h3>
                <p
                  className="font-body text-sm leading-[1.6] mb-4 line-clamp-2"
                  style={{ color: '#9E9E9E' }}
                >
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] uppercase tracking-wider"
                      style={{ color: '#C8A45C' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
