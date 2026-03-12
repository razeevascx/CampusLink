import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const catClass = (cat) => `cat-${['Academic','Tech','Wellbeing','Career'].includes(cat) ? cat : 'default'}`;
const catIcon = (cat) => ({ Academic:'bi-book-fill', Tech:'bi-cpu-fill', Wellbeing:'bi-heart-fill', Career:'bi-briefcase-fill' }[cat] || 'bi-calendar-fill');
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '';

function SavedEventsPage() {
  const [savedEvents, setSavedEvents] = useState([]);
  const [removing, setRemoving] = useState(null);

  const fetchSaved = () => api.get('/events/saved').then(({ data }) => setSavedEvents(data));
  useEffect(() => { fetchSaved(); }, []);

  const removeSaved = async (eventId) => {
    setRemoving(eventId);
    await api.delete(`/events/save/${eventId}`);
    await fetchSaved();
    setRemoving(null);
  };

  return (
    <div>
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <h2><i className="bi bi-bookmark-fill me-2" style={{color:'var(--primary)'}}></i>Saved Events</h2>
          <p>{savedEvents.length} bookmarked event{savedEvents.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/events" className="btn btn-outline-primary btn-sm">
          <i className="bi bi-plus me-1"></i>Browse More
        </Link>
      </div>

      {savedEvents.length === 0 ? (
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'3rem',textAlign:'center'}}>
          <i className="bi bi-bookmark" style={{fontSize:'3rem',color:'#d1d5db',display:'block',marginBottom:'1rem'}}></i>
          <h5 style={{color:'var(--text)',marginBottom:'0.5rem'}}>No saved events yet</h5>
          <p style={{color:'var(--text-muted)',marginBottom:'1.5rem',fontSize:'0.9rem'}}>Bookmark campus events to keep track of what's coming up.</p>
          <Link to="/events" className="btn btn-primary"><i className="bi bi-calendar-event me-2"></i>Browse Events</Link>
        </div>
      ) : (
        <div className="row g-3">
          {savedEvents.map((event) => (
            <div key={event.id} className="col-md-6">
              <div className="event-card">
                <div className="event-card-header">
                  <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                    <div style={{width:36,height:36,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem'}}
                      className={catClass(event.category)}>
                      <i className={`bi ${catIcon(event.category)}`}></i>
                    </div>
                    <h6 style={{margin:0,fontWeight:700,fontSize:'0.95rem'}}>{event.title}</h6>
                  </div>
                  <span className={`badge ${catClass(event.category)}`}>{event.category}</span>
                </div>
                <div className="event-card-body">
                  <div className="event-meta">
                    <div className="event-meta-item"><i className="bi bi-calendar3"></i>{formatDate(event.event_date)}</div>
                    <div className="event-meta-item"><i className="bi bi-geo-alt-fill"></i>{event.location}</div>
                  </div>
                  <p style={{fontSize:'0.875rem',color:'var(--text-muted)',margin:'0 0 1rem',lineHeight:'1.6'}}>{event.description}</p>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => removeSaved(event.id)} disabled={removing === event.id}>
                    {removing === event.id
                      ? <><span className="spinner-border spinner-border-sm me-1"></span>Removing...</>
                      : <><i className="bi bi-bookmark-x me-1"></i>Remove</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedEventsPage;
