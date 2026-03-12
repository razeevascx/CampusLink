import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?';
const avatarColors = ['#4f46e5','#0891b2','#059669','#d97706','#dc2626'];
const getColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ savedEvents: [], incomingRequests: [], outgoingRequests: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/dashboard').then(({ data }) => { setSummary(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Saved Events', value: summary.savedEvents.length, icon: 'bi-bookmark-fill', color: '#4f46e5', bg: '#eef2ff', link: '/saved-events' },
    { label: 'Incoming Requests', value: summary.incomingRequests.length, icon: 'bi-person-fill-add', color: '#0891b2', bg: '#ecfeff', link: '/study-buddies' },
    { label: 'Outgoing Requests', value: summary.outgoingRequests.length, icon: 'bi-send-fill', color: '#059669', bg: '#f0fdf4', link: '/study-buddies' },
  ];

  if (loading) return <div className="loading-spinner"><div className="spinner-border text-primary"></div><span>Loading dashboard...</span></div>;

  return (
    <div>
      <div className="welcome-card mb-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',fontWeight:800,color:'#fff',flexShrink:0}}>
            {getInitials(user?.full_name)}
          </div>
          <div>
            <div className="welcome-name">Welcome back, {user?.full_name?.split(' ')[0]}!</div>
            <div className="welcome-sub">{user?.course} · {user?.email}</div>
          </div>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/study-buddies" className="hero-btn-secondary" style={{fontSize:'0.85rem',padding:'0.5rem 1.1rem'}}>
            <i className="bi bi-people-fill"></i> Find Buddies
          </Link>
          <Link to="/events" className="hero-btn-secondary" style={{fontSize:'0.85rem',padding:'0.5rem 1.1rem'}}>
            <i className="bi bi-calendar-event-fill"></i> Browse Events
          </Link>
          <Link to="/saved-events" className="hero-btn-secondary" style={{fontSize:'0.85rem',padding:'0.5rem 1.1rem'}}>
            <i className="bi bi-bookmark-fill"></i> Saved Events
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="col-md-4">
            <Link to={s.link} style={{textDecoration:'none'}}>
              <div className="stat-card" style={{background:`linear-gradient(135deg,${s.color},${s.color}cc)`,color:'#fff'}}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div style={{width:44,height:44,background:'rgba(255,255,255,0.2)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.25rem'}}>
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <i className="bi bi-arrow-right" style={{opacity:0.6}}></i>
                </div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {summary.incomingRequests.filter(r => r.status === 'pending').length > 0 && (
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.25rem'}}>
          <div className="section-label"><i className="bi bi-bell-fill me-2" style={{color:'#f59e0b'}}></i>Pending Buddy Requests</div>
          {summary.incomingRequests.filter(r => r.status === 'pending').map(r => (
            <div key={r.id} className="d-flex align-items-center gap-3 py-2" style={{borderBottom:'1px solid var(--border)'}}>
              <div className="student-avatar" style={{width:36,height:36,fontSize:'0.9rem',background:getColor(r.sender_name)}}>{getInitials(r.sender_name)}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:'0.9rem'}}>{r.sender_name}</div>
                <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{r.course}</div>
              </div>
              <Link to="/study-buddies" className="btn btn-sm btn-outline-primary">Respond</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
