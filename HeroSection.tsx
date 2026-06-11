import ThreeCanvas from '../components/ThreeCanvas';

export default function HeroSection() {
  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector('#projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
    >
      <ThreeCanvas />

      {/* Text overlay */}
      <div
        className="absolute z-10 px-6 md:px-0"
        style={{
          left: '8vw',
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: 520,
        }}
      >
        <span
          className="font-mono text-[11px] uppercase tracking-[0.12em] block mb-5"
          style={{ color: '#C8A45C' }}
        >
          CYBERSECURITY & WEB DEVELOPER
        </span>
        <h1
          className="font-display text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] font-normal mb-5"
          style={{
            color: '#F5F5F5',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
          }}
        >
          Saif Fathalla
        </h1>
        <p
          className="font-body text-base md:text-lg leading-[1.6] mb-8"
          style={{
            color: '#9E9E9E',
            maxWidth: 400,
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          Securing the digital world, one line of code at a time.
        </p>
        <div className="flex items-center gap-5 flex-wrap">
          <button
            onClick={handleScrollToProjects}
            className="font-body text-sm font-medium px-7 py-3 rounded-full transition-all duration-300 hover:scale-[1.03]"
            style={{
              backgroundColor: '#C8A45C',
              color: '#121212',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#D4B76A';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#C8A45C';
            }}
          >
            View My Work
          </button>
          <a
            href="/Saif-Fathalla-CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm transition-all duration-300 hover:underline"
            style={{ color: '#9E9E9E' }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = '#F5F5F5';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = '#9E9E9E';
            }}
          >
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
}
