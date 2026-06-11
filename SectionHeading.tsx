import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  label: string;
  heading: string;
  light?: boolean;
}

export default function SectionHeading({ label, heading, light = false }: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      labelRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    )
      .fromTo(
        lineRef.current,
        { width: 0 },
        { width: 40, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.2'
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="mb-12">
      <span
        ref={labelRef}
        className="font-mono text-[11px] uppercase tracking-[0.12em] block mb-3"
        style={{ color: light ? '#9E9E9E' : '#C8A45C' }}
      >
        {label}
      </span>
      <div
        ref={lineRef}
        className="h-[2px] mb-4"
        style={{ backgroundColor: '#C8A45C', width: 0 }}
      />
      <h2
        ref={headingRef}
        className="font-display text-[36px] md:text-[48px] leading-[1.1] font-normal"
        style={{ color: light ? '#121212' : '#F5F5F5' }}
      >
        {heading}
      </h2>
    </div>
  );
}
