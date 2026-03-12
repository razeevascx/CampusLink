import { useEffect, useRef, useState } from 'react';
import api from '../services/api';

const typeIcon = (type) => ({
  buddy_request: 'bi-person-fill-add text-primary',
  buddy_response: 'bi-people-fill text-success',
  group_join: 'bi-people text-info',
}[type] || 'bi-bell text-secondary');

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

function NotificationBell() {
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifs = () =>
    api.get('/notifications').then(({ data }) => setNotifs(data)).catch(() => {});

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifs.filter(n => !n.read).length;

  const markAll = async () => {
    await api.put('/notifications/read-all').catch(() => {});
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const markOne = async (id) => {
    await api.put(`/notifications/${id}/read`).catch(() => {});
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div ref={ref} style={{position:'relative'}}>
      <button
        className="btn btn-link nav-link p-0 position-relative"
        style={{color:'rgba(255,255,255,0.85)',fontSize:'1.15rem',lineHeight:1}}
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <i className="bi bi-bell-fill"></i>
        {unread > 0 && (
          <span style={{
            position:'absolute', top:-4, right:-6,
            background:'#ef4444', color:'#fff',
            borderRadius:'50%', width:16, height:16,
            fontSize:'0.65rem', display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:700, lineHeight:1
          }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <div style={{
          position:'absolute', right:0, top:'calc(100% + 10px)', width:320,
          background:'#fff', border:'1px solid var(--border)',
          borderRadius:'var(--radius)', boxShadow:'0 8px 32px rgba(0,0,0,0.12)',
          zIndex:1000, overflow:'hidden'
        }}>
          <div style={{padding:'0.75rem 1rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span style={{fontWeight:700, fontSize:'0.9rem'}}>Notifications</span>
            {unread > 0 && (
              <button className="btn btn-link p-0" style={{fontSize:'0.78rem',color:'var(--primary)'}} onClick={markAll}>
                Mark all read
              </button>
            )}
          </div>

          <div style={{maxHeight:320, overflowY:'auto'}}>
            {notifs.length === 0 ? (
              <div style={{padding:'2rem 1rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.875rem'}}>
                <i className="bi bi-bell-slash" style={{fontSize:'1.5rem',display:'block',marginBottom:'0.5rem'}}></i>
                No notifications yet
              </div>
            ) : (
              notifs.map(n => (
                <div
                  key={n.id}
                  onClick={() => markOne(n.id)}
                  style={{
                    padding:'0.75rem 1rem', cursor:'pointer',
                    borderBottom:'1px solid var(--border)',
                    background: n.read ? '#fff' : '#f0f4ff',
                    display:'flex', gap:'0.75rem', alignItems:'flex-start',
                    transition:'background 0.15s'
                  }}
                >
                  <i className={`bi ${typeIcon(n.type)}`} style={{fontSize:'1rem',marginTop:2,flexShrink:0}}></i>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'0.83rem',color:'#1e293b',lineHeight:'1.4'}}>{n.message}</div>
                    <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:'0.2rem'}}>{timeAgo(n.created_at)}</div>
                  </div>
                  {!n.read && <div style={{width:7,height:7,borderRadius:'50%',background:'var(--primary)',flexShrink:0,marginTop:5}}></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
