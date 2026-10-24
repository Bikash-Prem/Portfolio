import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './App.css'
import cubeStoreHero from './assets/cube-store-hero.png'
import missingManual from './assets/missing-manual.png'
import voiceops1 from './assets/voiceops-1.png'
import bhuDrishtiShot from './assets/bhu-drishti.png'
import geoagenticShot from './assets/geoagentic.webp'
import smartCampusShot from './assets/smart-campus.png'
import profilePhoto from './assets/profile-photo.jpeg'

const GITHUB_URL = 'https://github.com/Bikash-Prem'
const LINKEDIN_URL = 'https://www.linkedin.com/in/bikash--kumar-sah'
const EMAIL = 'bikashkumar.bks44@gmail.com'
// Opens Gmail's compose window directly; mailto: would hand off to the visitor's default mail app
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`

gsap.registerPlugin(ScrollTrigger, useGSAP)

// three.js is loaded on demand so it doesn't block the first paint
const ScrollScene = lazy(() => import('./ScrollScene.jsx'))

const roles = ['AI-powered applications', 'geospatial pipelines', 'backend APIs']

const projects = [
  {
    id: 'bhudrishti',
    number: '01',
    title: 'Bhu-Drishti',
    tagline: 'Satellite intelligence for every district of India',
    context: 'Tech-Shodha hackathon · Team Code with Beyond Z',
    description:
      'A natural-language interface for satellite-data analysis. Ask a plain-language question, such as how much cropland flooded or how many fires were detected, and get an answer from Sentinel-1/2 and NASA Earthdata with confidence intervals.',
    highlights: [
      'Built the Node.js/Fastify backend: JWT auth, a scheduler that re-runs saved questions on new satellite passes, PDF report generation, and email/webhook delivery of approved reports',
      'Connected the React/TypeScript frontend to the Python/FastAPI analysis engine, about 1-2 minutes per query',
      'Set up Docker Compose deployment and CI that runs every test suite against the full stack, with 19 automated backend tests',
    ],
    tags: ['Python', 'FastAPI', 'Node.js', 'Fastify', 'React', 'TypeScript', 'PostGIS'],
    link: { href: 'https://github.com/Bikash-Prem/Bhu-Drishti', label: 'View on GitHub' },
    shot: { src: bhuDrishtiShot, url: 'satquery / district analysis', alt: 'Bhu-Drishti analysis screen: a district map of analysed tiles beside the certified answer, confidence interval and run statistics' },
  },
  {
    id: 'geoagentic',
    number: '02',
    title: 'GeoAgentic Framework',
    tagline: 'Dispatcher copilot for emergency vehicle movement',
    context: 'Girl Geeks program, IEEE Bangalore Section · Team Code with ChaiPani',
    description:
      'A decision-support system that helps dispatchers route emergency vehicles. I built the ETA-prediction and routing components.',
    highlights: [
      'ETA prediction model: heuristic baseline with calibrated uncertainty intervals',
      'Incident-aware A* routing that also returns alternative routes',
      'On a seeded synthetic benchmark of 300 scenarios: 1.73 min RMSE vs. 3.37 min for a free-flow-only estimate, with 34 automated tests',
    ],
    tags: ['Python', 'FastAPI', 'React', 'A*'],
    metric: { value: '1.73', unit: 'min RMSE', compare: '3.37 min free-flow baseline' },
    shot: { src: geoagenticShot, url: 'geo-agentic / overview', alt: 'GeoAgentic overview screen: a Bengaluru map with incidents, hospitals and a recommended ambulance route with its ETA' },
  },
  {
    id: 'smartcampus',
    number: '03',
    title: 'Smart AI Campus',
    tagline: 'An assistant that learns each student without a profile form',
    context: 'Team project',
    description:
      'An AI assistant for university students that learns their interests silently across sessions. I built the memory layer.',
    highlights: [
      'Memory layer on Hindsight (agent memory with semantic retrieval): typed retain/recall of events, clubs and deadlines',
      'LLM-based interest-drift and avoidance detection, plus decay-based interest scoring',
      'Groq (Llama 3.3 70B) as the LLM, with Pydantic v2 models',
    ],
    tags: ['Python', 'Groq', 'Hindsight', 'Pydantic v2', 'JavaScript'],
    link: { href: 'https://github.com/Bikash-Prem/Smart_Ai_College', label: 'View on GitHub' },
    shot: { src: smartCampusShot, url: 'smart-campus / assistant', alt: 'Illustrative Smart AI Campus screen: a chat assistant recommending events next to the interests it has learned' },
  },
]

const otherWork = [
  { title: 'Missing Manual', note: 'Internship · scroll-led React product site for building drones', image: missingManual, tags: ['React', 'Vite', 'UI/UX'] },
  { title: 'Cube Store', note: 'Full-stack speed-cube store with cart, stock and checkout flows', image: cubeStoreHero, tags: ['PHP', 'SQL', 'AJAX'] },
  { title: 'VoiceOPS AI', note: 'Voice-first business OS concept turning speech into records', image: voiceops1, tags: ['Kotlin', 'Spring Boot', 'AI'] },
]

const skills = [
  { group: 'AI / ML', items: ['Machine Learning', 'PyTorch', 'Generative AI', 'LLM integration (Groq)', 'Retrieval-Augmented Generation (RAG)', 'Agent memory (Hindsight)', 'Retrieval-based recall', 'ETA prediction with calibrated uncertainty', 'Graph routing (A*)', 'Geospatial Analysis', 'Remote Sensing', 'Satellite data (Sentinel-1/2, NASA Earthdata)'] },
  { group: 'Languages', items: ['Python', 'Java', 'C', 'JavaScript', 'TypeScript', 'SQL'] },
  { group: 'Backend & data', items: ['FastAPI', 'Node.js', 'Fastify', 'React', 'PostgreSQL', 'PostGIS', 'API Development'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'Docker', 'Linux', 'REST APIs', 'System Design'] },
]

const timeline = [
  { period: '2026 – now', title: 'Vice Chair', org: 'IEEE Bangalore Chapter Computer Science Society, Cambridge Institute of Technology', kind: 'Leadership' },
  { period: '2024 – 2028', title: 'B.E. Computer Science and Engineering', org: 'Cambridge Institute of Technology, Bengaluru · CGPA 8.75 · no active backlogs', kind: 'Education' },
  { period: '2021 – 2023', title: 'Higher Secondary (PCMC) 89% · Secondary 99%', org: "Shree Sukdev's School with Pre-University", kind: 'Education' },
]

const certs = [
  { name: 'Python certification, NPTEL', href: 'https://lnkd.in/p/dFFsS-AH' },
  { name: 'Java certification, Infosys' },
]

const marquee = ['Python', 'FastAPI', 'Node.js', 'Fastify', 'React', 'TypeScript', 'PostGIS', 'Groq', 'Hindsight', 'Docker', 'Java']

function GithubIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M8 0C3.58 0 0 3.65 0 8.16c0 3.61 2.29 6.67 5.47 7.75.4.08.55-.18.55-.4 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.2-3.64-.9-3.64-4.02 0-.89.31-1.62.82-2.19-.08-.2-.36-1.03.08-2.15 0 0 .67-.22 2.2.83a7.4 7.4 0 0 1 4 0c1.53-1.06 2.2-.83 2.2-.83.44 1.12.16 1.95.08 2.15.51.57.82 1.29.82 2.19 0 3.13-1.87 3.82-3.65 4.02.29.26.54.76.54 1.53 0 1.11-.01 2-.01 2.27 0 .22.15.48.55.4A8.18 8.18 0 0 0 16 8.16C16 3.65 12.42 0 8 0" clipRule="evenodd" /></svg>
  )
}

function LinkedinIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
  )
}

function MailIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
  )
}

function CopyIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
  )
}

function CheckIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
  )
}

function ArrowIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
  )
}

function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  return <Tag className={`reveal ${className}`} {...rest}>{children}</Tag>
}

function RotatingRole() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="role-swap">
      <span className="sr-only">{roles.join(', ')}</span>
      {roles.map((role, i) => (
        <span key={role} className={`role-word ${i === index ? 'active' : ''}`} aria-hidden="true">{role}</span>
      ))}
    </span>
  )
}

function ProjectVisual({ project }) {
  const { shot, metric } = project
  return (
    <div className="shot">
      <div className="shot-bar"><i /><i /><i /><span>{shot.url}</span></div>
      <div className="shot-screen"><img src={shot.src} alt={shot.alt} loading="lazy" /></div>
      {metric && (
        <div className="shot-badge">
          <span className="metric-value">{metric.value}</span>
          <span className="metric-unit">{metric.unit}</span>
          <span className="metric-compare">vs. {metric.compare}</span>
        </div>
      )}
    </div>
  )
}

function useAnimations(scope) {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })

      gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.1 } })
        .from('.hero-anim', { y: 48, opacity: 0, stagger: 0.09 })
        .from('.photo-frame', { y: 40, scale: 0.9, rotate: -3, opacity: 0, duration: 1.3 }, 0.2)
        .from('.photo-tag', { x: -24, opacity: 0 }, 0.7)

      // Hero drifts up and fades as the page scrolls past it
      gsap.to('.hero-inner', { yPercent: -12, opacity: 0.4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, { y: 48, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
      })

      gsap.utils.toArray('.project').forEach((project) => {
        gsap.fromTo(project.querySelector('.project-visual'), { y: 50 }, { y: -50, ease: 'none', scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: true } })
        gsap.from(project.querySelectorAll('.highlights li, .tags span'), {
          x: -18, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: project, start: 'top 65%' },
        })
      })

      // Screenshots wipe open from the bottom
      gsap.utils.toArray('.shot').forEach((shot) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: shot, start: 'top 80%' } })
          .from(shot.querySelector('.shot-screen'), { clipPath: 'inset(100% 0 0 0)', duration: 1.1, ease: 'expo.inOut' })
        const badge = shot.querySelector('.shot-badge')
        if (badge) tl.from(badge, { y: 24, opacity: 0, duration: 0.7, ease: 'back.out(1.8)' }, '-=0.4')
      })

      gsap.utils.toArray('.skill-card').forEach((card) => {
        gsap.from(card.querySelectorAll('li'), { y: 14, scale: 0.9, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'back.out(1.6)', scrollTrigger: { trigger: card, start: 'top 85%' } })
      })

      gsap.from('.timeline li', { x: 30, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.timeline', start: 'top 80%' } })
    })

    // Magnetic buttons, only for mouse users
    mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
      const cleanups = gsap.utils.toArray('.magnetic').map((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
        const move = (e) => {
          const r = el.getBoundingClientRect()
          xTo((e.clientX - r.left - r.width / 2) * 0.25)
          yTo((e.clientY - r.top - r.height / 2) * 0.35)
        }
        const leave = () => { xTo(0); yTo(0) }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
      })
      return () => cleanups.forEach((fn) => fn())
    })
  }, { scope })
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy my email address:', EMAIL)
    }
  }
  return (
    <button className="ghost-btn" onClick={copy} aria-live="polite">
      {copied ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy email</>}
    </button>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const rootRef = useRef(null)
  useAnimations(rootRef)

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
    <div ref={rootRef}>
      <Suspense fallback={null}><ScrollScene /></Suspense>
      <div className="scroll-progress" aria-hidden="true" />
      <a className="skip-link" href="#work">Skip to projects</a>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} aria-label="Primary">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="Back to top">
          <span className="brand-mark">BKS</span><span className="brand-name">Bikash Kumar Sah</span>
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
          <span className={`burger ${menuOpen ? 'open' : ''}`}><i /><i /><i /></span>
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <button onClick={() => scrollTo('work')}>Projects</button>
          <button onClick={() => scrollTo('skills')}>Skills</button>
          <button onClick={() => scrollTo('about')}>About</button>
          <a className="nav-icon" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={18} /></a>
          <a className="nav-icon" href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={17} /></a>
          <button className="nav-cta" onClick={() => scrollTo('contact')}>Contact</button>
        </div>
      </nav>

      <main>
        <section id="top" className="hero section-pad">
          <div className="hero-bg" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-copy">
              <h1>
                <span className="hero-name hero-anim">Bikash Kumar Sah</span>
                <span className="hero-line hero-anim">I build <RotatingRole /></span>
              </h1>
              <p className="hero-text hero-anim">
                Computer Science undergraduate at Cambridge Institute of Technology, Bengaluru. I built the backend and API layer of
                <strong> Bhu-Drishti</strong>, a natural-language interface for satellite data, and the ETA-prediction and routing components of an emergency-vehicle decision-support system. I'm also Vice Chair of the IEEE Bangalore Chapter Computer Science Society at my college.
              </p>
              <div className="hero-actions hero-anim">
                <button className="primary-btn magnetic" onClick={() => scrollTo('work')}>View projects <ArrowIcon /></button>
                <a className="ghost-btn magnetic" href={GMAIL_COMPOSE} target="_blank" rel="noreferrer"><MailIcon /> Email me</a>
                <a className="icon-btn" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub profile"><GithubIcon size={18} /></a>
                <a className="icon-btn" href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><LinkedinIcon size={17} /></a>
              </div>
            </div>
            <div className="hero-photo">
              <div className="photo-dots" aria-hidden="true" />
              <div className="photo-frame"><img src={profilePhoto} alt="Portrait of Bikash Kumar Sah" width="340" height="425" /></div>
              <div className="photo-tag"><span>Bengaluru, IN</span><span>CSE '28</span></div>
            </div>
          </div>
        </section>

        <div className="marquee-wrap" aria-hidden="true">
          <div className="marquee">
            <div className="marquee-track">
              {[...marquee, ...marquee].map((s, i) => <span key={i}>{s}</span>)}
            </div>
          </div>
        </div>

        <section id="work" className="section-pad work-section">
          <Reveal className="section-heading">
            <span className="eyebrow-label">// Selected projects</span>
            <h2>AI systems, geospatial pipelines and the APIs that hold them together.</h2>
          </Reveal>

          <div className="project-list">
            {projects.map((project) => (
              <Reveal as="article" className="project" key={project.id}>
                <div className="project-visual"><ProjectVisual project={project} /></div>
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
                    {project.link && (
                      <a className="code-link" href={project.link.href} target="_blank" rel="noreferrer">{project.link.label} <ArrowIcon /></a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="other-work">
            <span className="eyebrow-label">// Earlier builds</span>
            <div className="other-grid">
              {otherWork.map((w) => (
                <article className="other-card" key={w.title}>
                  <div className="other-thumb"><img src={w.image} alt={`${w.title} screenshot`} loading="lazy" /></div>
                  <div className="other-body">
                    <h3>{w.title}</h3>
                    <p>{w.note}</p>
                    <div className="tags small">{w.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="skills" className="section-pad skills-section">
          <Reveal className="section-heading">
            <span className="eyebrow-label">// Skills</span>
            <h2>What I work with.</h2>
          </Reveal>
          <div className="skills-grid">
            {skills.map((s, i) => (
              <Reveal className={`skill-card ${i === 0 ? 'is-wide' : ''}`} key={s.group}>
                <h3>{s.group}</h3>
                <ul>{s.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="about" className="section-pad about-section">
          <Reveal className="section-heading">
            <span className="eyebrow-label">// About</span>
            <h2>Education, leadership and certifications.</h2>
          </Reveal>
          <div className="about-grid">
            <Reveal className="about-copy">
              <p className="big-copy">I like the part of a project where a model meets the real world: the API around it, the tests that keep it honest, and the numbers that show whether it works.</p>
              <p>Most of my recent work has been in hackathon and program teams, where I take ownership of the backend, the data pipeline or the prediction component and ship it with tests and CI.</p>
              <div className="certs">
                <span className="eyebrow-label muted">Certifications</span>
                <ul>
                  {certs.map((c) => (
                    <li key={c.name}>
                      {c.href ? <a href={c.href} target="_blank" rel="noreferrer">{c.name} <ArrowIcon size={12} /></a> : c.name}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal as="ol" className="timeline">
              {timeline.map((t) => (
                <li key={t.title}>
                  <span className="t-period">{t.period} · {t.kind}</span>
                  <h3>{t.title}</h3>
                  <p>{t.org}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </section>

        <section id="contact" className="contact-section section-pad">
          <Reveal className="contact-card">
            <span className="eyebrow-label">// Contact</span>
            <h2>Hiring for an Applied AI internship?</h2>
            <p>I'd be glad to talk about a role, a project, or anything on this page.</p>
            <div className="contact-actions">
              <a className="primary-btn magnetic" href={GMAIL_COMPOSE} target="_blank" rel="noreferrer"><MailIcon /> {EMAIL}</a>
              <CopyEmail />
              <a className="ghost-btn" href={LINKEDIN_URL} target="_blank" rel="noreferrer"><LinkedinIcon /> LinkedIn</a>
              <a className="ghost-btn" href={GITHUB_URL} target="_blank" rel="noreferrer"><GithubIcon /> GitHub</a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer>
        <span>© 2026 Bikash Kumar Sah</span>
        <span>Applied AI · Geospatial · Backend</span>
        <button onClick={() => scrollTo('top')}>Back to top ↑</button>
      </footer>
    </div>
  )
}

export default App
