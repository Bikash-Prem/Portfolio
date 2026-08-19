import { useEffect, useRef, useState } from 'react'
import './App.css'
import cubeStoreHero from './assets/cube-store-hero.png'
import missingManual from './assets/missing-manual.png'
import voiceops1 from './assets/voiceops-1.png'
import voiceops2 from './assets/voiceops-2.png'
import profilePhoto from './assets/profile-photo.jpeg'

const GITHUB_URL = 'https://github.com/Bikash-Prem'

const roles = ['web experiences', 'full-stack products', 'AI / ML interfaces']

const projects = [
  {
    id: 'missingmanual',
    number: '01',
    title: 'Missing Manual',
    tagline: 'A visual product experience for building drones',
    context: 'Internship project',
    description:
      'A scroll-led technical product site designed to make a complex drone-building journey visual, understandable and exciting.',
    highlights: [
      'Responsive React experience with a strong editorial layout and intentional motion',
      'Visual storytelling that turns technical information into a guided product journey',
      'UI/UX focused on hierarchy, clarity and interaction rather than dense documentation',
    ],
    tags: ['React', 'Vite', 'UI/UX'],
    kind: 'missing',
    images: [missingManual],
  },
  {
    id: 'cubestore',
    number: '02',
    title: 'Cube Store',
    tagline: 'A full-stack e-commerce experience',
    context: 'Personal project',
    description:
      'A speed-cube storefront built around real cart, stock, checkout and AJAX flows.',
    highlights: [
      'Server-side cart and stock-aware purchase flow',
      'AJAX interactions for a smoother shopping experience',
      'Responsive product browsing, search and checkout UI',
    ],
    tags: ['PHP', 'SQL', 'JavaScript', 'AJAX'],
    kind: 'browser',
    images: [cubeStoreHero],
  },
  {
    id: 'voiceops',
    number: '03',
    title: 'VoiceOPS AI',
    tagline: 'A voice-first AI business product',
    context: 'AI product',
    description:
      'A voice-first business OS concept that turns everyday spoken activity into structured business intelligence.',
    highlights: [
      'Voice-first interface designed around low-friction business actions',
      'AI-assisted business records, credit signals and insights',
      'Mobile-first product thinking across UI, backend and AI workflows',
    ],
    tags: ['Kotlin', 'Spring Boot', 'AI'],
    kind: 'phone',
    images: [voiceops1, voiceops2],
  },
]

const stack = ['React', 'JavaScript', 'HTML / CSS', 'PHP', 'SQL', 'AJAX', 'Python', 'PyTorch', 'OpenCV', 'Git']

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el) } },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const [ref, visible] = useReveal()
  return (
    <Tag ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

function RotatingRole() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2400)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="role-swap">
      {roles.map((role, i) => (
        <span key={role} className={`role-word ${i === index ? 'active' : ''}`} aria-hidden={i !== index}>{role}</span>
      ))}
    </span>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <main>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <button className="brand" onClick={() => scrollTo('top')} aria-label="Back to top">Bikash<span>.</span></button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`burger ${menuOpen ? 'open' : ''}`}><i /><i /><i /></span>
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <button onClick={() => scrollTo('work')}>Work</button>
          <button onClick={() => scrollTo('about')}>About</button>
          <button onClick={() => scrollTo('contact')}>Contact</button>
          <a className="nav-github" href={GITHUB_URL} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M8 0C3.58 0 0 3.65 0 8.16c0 3.61 2.29 6.67 5.47 7.75.4.08.55-.18.55-.4 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.2-3.64-.9-3.64-4.02 0-.89.31-1.62.82-2.19-.08-.2-.36-1.03.08-2.15 0 0 .67-.22 2.2.83a7.4 7.4 0 0 1 4 0c1.53-1.06 2.2-.83 2.2-.83.44 1.12.16 1.95.08 2.15.51.57.82 1.29.82 2.19 0 3.13-1.87 3.82-3.65 4.02.29.26.54.76.54 1.53 0 1.11-.01 2-.01 2.27 0 .22.15.48.55.4A8.18 8.18 0 0 0 16 8.16C16 3.65 12.42 0 8 0" clipRule="evenodd" /></svg>
            GitHub
          </a>
          <button className="nav-cta" onClick={() => scrollTo('contact')}>Let's talk</button>
        </div>
      </nav>

      <section id="top" className="hero section-pad">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow"><span className="dot" /> Open to freelance &amp; collaborative work</div>
            <h1>I build <RotatingRole /></h1>
            <p className="hero-text">CSE student and builder working across AI products, full-stack web and voice interfaces — turning ideas into things that actually ship.</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => scrollTo('work')}>View my work</button>
              <a className="ghost-btn" href={GITHUB_URL} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M8 0C3.58 0 0 3.65 0 8.16c0 3.61 2.29 6.67 5.47 7.75.4.08.55-.18.55-.4 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.2-3.64-.9-3.64-4.02 0-.89.31-1.62.82-2.19-.08-.2-.36-1.03.08-2.15 0 0 .67-.22 2.2.83a7.4 7.4 0 0 1 4 0c1.53-1.06 2.2-.83 2.2-.83.44 1.12.16 1.95.08 2.15.51.57.82 1.29.82 2.19 0 3.13-1.87 3.82-3.65 4.02.29.26.54.76.54 1.53 0 1.11-.01 2-.01 2.27 0 .22.15.48.55.4A8.18 8.18 0 0 0 16 8.16C16 3.65 12.42 0 8 0" clipRule="evenodd" /></svg>
                @Bikash-Prem
              </a>
            </div>
          </div>
          <div className="hero-photo">
            <div className="photo-frame"><img src={profilePhoto} alt="Bikash" /></div>
            <div className="photo-ring" aria-hidden="true" />
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...stack, ...stack].map((s, i) => <span key={i}>{s}</span>)}
        </div>
      </div>

      <section id="work" className="section-pad work-section">
        <Reveal as="div" className="section-heading">
          <span className="eyebrow-label">Selected work</span>
          <h2>Three things I've built end to end.</h2>
        </Reveal>

        <div className="project-list">
          {projects.map((project, i) => (
            <Reveal as="article" className="project" key={project.id} delay={i * 60}>
              <div className={`project-visual ${project.kind === 'missing' ? 'is-missing' : project.kind === 'phone' ? 'is-phone' : 'is-browser'}`}>
                {project.kind === 'missing' && (
                  <div className="missing-showcase">
                    <div className="missing-image-wrap">
                      <img src={project.images[0]} alt="Missing Manual website project" loading="lazy" />
                    </div>
                    <span className="floating-label label-one">INTERNSHIP / 01</span>
                    <span className="floating-label label-two">WEB EXPERIENCE</span>
                  </div>
                )}
                {project.kind === 'browser' && (
                  <div className="device browser-device">
                    <div className="device-bar"><i /><i /><i /><span className="device-url">{project.title.toLowerCase().replace(/\s/g, '')}.app</span></div>
                    <div className="device-screen"><img src={project.images[0]} alt={`${project.title} screenshot`} loading="lazy" /></div>
                  </div>
                )}
                {project.kind === 'phone' && (
                  <div className="phone-pair">
                    {project.images.map((src, idx) => (
                      <div className="device phone-device" key={idx}>
                        <div className="phone-notch" />
                        <div className="device-screen"><img src={src} alt={`${project.title} screenshot ${idx + 1}`} loading="lazy" /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="project-info">
                <div className="project-meta">
                  <span className="project-number">{project.number}</span>
                  <span>{project.context}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="project-tagline">{project.tagline}</p>
                <p className="project-desc">{project.description}</p>
                <ul className="highlights">{project.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
                <div className="project-footer">
                  <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <a className="code-link" href={GITHUB_URL} target="_blank" rel="noreferrer">View on GitHub <span>↗</span></a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="about" className="section-pad about-section">
        <Reveal as="div" className="section-heading">
          <span className="eyebrow-label">About</span>
          <h2>Curious by default, careful by habit.</h2>
        </Reveal>
        <div className="about-grid">
          <Reveal as="div" className="about-copy" delay={80}>
            <p className="big-copy">I'm a CSE student who started with code, got pulled into AI and robotics, and now stress-tests every idea for whether it's actually novel and physically possible.</p>
            <p>I like projects where design, engineering and rigor meet — thinking through the interface, building the front end, wiring the backend, and understanding what's actually happening underneath. That's the standard I bring to freelance work too.</p>
            <a className="text-link" href={GITHUB_URL} target="_blank" rel="noreferrer">See more on GitHub ↗</a>
          </Reveal>
          <Reveal as="div" className="stack-panel" delay={160}>
            <span className="eyebrow-label">Tools &amp; stack</span>
            <div className="stack-grid">{stack.map((s) => <span key={s}>{s}</span>)}</div>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="contact-section section-pad">
        <Reveal>
          <span className="eyebrow-label light">Have a project?</span>
          <h2>Let's make something good.</h2>
          <p>Tell me what you're building, what isn't working, or simply what you have in mind.</p>
          <div className="contact-actions">
            <a className="contact-btn" href="mailto:bikashkumar.bks44@gmail.com">bikashkumar.bks44@gmail.com <span>↗</span></a>
            <a className="ghost-btn on-dark" href={GITHUB_URL} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M8 0C3.58 0 0 3.65 0 8.16c0 3.61 2.29 6.67 5.47 7.75.4.08.55-.18.55-.4 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.2-3.64-.9-3.64-4.02 0-.89.31-1.62.82-2.19-.08-.2-.36-1.03.08-2.15 0 0 .67-.22 2.2.83a7.4 7.4 0 0 1 4 0c1.53-1.06 2.2-.83 2.2-.83.44 1.12.16 1.95.08 2.15.51.57.82 1.29.82 2.19 0 3.13-1.87 3.82-3.65 4.02.29.26.54.76.54 1.53 0 1.11-.01 2-.01 2.27 0 .22.15.48.55.4A8.18 8.18 0 0 0 16 8.16C16 3.65 12.42 0 8 0" clipRule="evenodd" /></svg>
              github.com/Bikash-Prem
            </a>
          </div>
        </Reveal>
      </section>

      <footer>
        <span>© 2026 Bikash</span>
        <span>AI / Web / Robotics</span>
        <button onClick={() => scrollTo('top')}>Back to top ↑</button>
      </footer>
    </main>
  )
}

export default App
