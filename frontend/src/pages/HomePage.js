import { Link } from 'react-router-dom';

const features = [
  {
    icon: 'bi-people-fill',
    color: '#4f46e5',
    bg: '#eef2ff',
    title: 'Find Study Buddies',
    desc: 'Search by course or shared interests. Send connection requests and build your academic network in seconds.',
  },
  {
    icon: 'bi-calendar-event-fill',
    color: '#0891b2',
    bg: '#ecfeff',
    title: 'Explore Campus Events',
    desc: 'Discover academic talks, tech meetups, wellness sessions, and career events. Bookmark what matters.',
  },
  {
    icon: 'bi-shield-fill-check',
    color: '#059669',
    bg: '#f0fdf4',
    title: 'Safe & Secure',
    desc: 'JWT authentication, bcrypt hashing, and role-based access ensure your data stays protected.',
  },
];

function HomePage() {
  return (
    <div>
      <div className="hero-section mb-4">
        <div className="hero-badge">
          <i className="bi bi-mortarboard-fill"></i> University Community Platform
        </div>
        <h1 className="hero-title">Connect. Study.<br />Thrive Together.</h1>
        <p className="hero-sub">
          CampusLink brings students together — find study partners, discover campus events,
          and stay engaged with everything university life has to offer.
        </p>
        <div className="hero-btn-group">
          <Link className="hero-btn-primary" to="/register">
            <i className="bi bi-rocket-takeoff"></i> Get Started Free
          </Link>
          <Link className="hero-btn-secondary" to="/login">
            <i className="bi bi-box-arrow-in-right"></i> Student Login
          </Link>
          <Link className="hero-btn-secondary" to="/admin/login" style={{fontSize:'0.85rem',padding:'0.6rem 1.25rem'}}>
            <i className="bi bi-shield-lock"></i> Admin
          </Link>
        </div>
      </div>

      <div className="row g-3">
        {features.map((f) => (
          <div key={f.title} className="col-md-4">
            <div className="feature-card">
              <div className="feature-icon" style={{background: f.bg, color: f.color}}>
                <i className={`bi ${f.icon}`}></i>
              </div>
              <h5 style={{fontWeight: 700, marginBottom: '0.5rem'}}>{f.title}</h5>
              <p style={{color:'var(--text-muted)', fontSize:'0.9rem', margin:0, lineHeight:'1.65'}}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mt-1">
        {[
          { value: '500+', label: 'Students Connected', icon: 'bi-people', color: '#4f46e5' },
          { value: '50+', label: 'Campus Events', icon: 'bi-calendar-check', color: '#0891b2' },
          { value: '100%', label: 'Secure Platform', icon: 'bi-shield-check', color: '#059669' },
        ].map((s) => (
          <div key={s.label} className="col-md-4">
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.25rem',textAlign:'center'}}>
              <i className={`bi ${s.icon}`} style={{fontSize:'1.5rem',color:s.color,marginBottom:'0.5rem',display:'block'}}></i>
              <div style={{fontSize:'1.75rem',fontWeight:800,letterSpacing:'-1px',color:'var(--text)'}}>{s.value}</div>
              <div style={{fontSize:'0.82rem',color:'var(--text-muted)',fontWeight:600}}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
