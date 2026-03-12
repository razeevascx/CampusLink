import { useEffect, useState } from 'react';
import api from '../services/api';

const catClass = (cat) => `cat-${['Academic','Tech','Wellbeing','Career'].includes(cat) ? cat : 'default'}`;

const catIcon = (cat) => ({
  Academic: 'bi-book-fill',
  Tech: 'bi-cpu-fill',
  Wellbeing: 'bi-heart-fill',
  Career: 'bi-briefcase-fill',
}[cat] || 'bi-calendar-fill');

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
};

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [saving, setSaving] = useState(null);
  const [rsvping, setRsvping] = useState(null);

  const fetchEvents = () => api.get('/events').then(({ data }) => setEvents(data));

  useEffect(() => { fetchEvents(); }, []);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'' }), 3000);
  };

  const saveEvent = async (eventId) => {
    setSaving(eventId);
    try {
      await api.post(`/events/save/${eventId}`);
      showToast('Event bookmarked!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not save event', 'danger');
    } finally {
      setSaving(null);
    }
  };

  const toggleRsvp = async (event) => {
    setRsvping(event.id);
    try {
      if (event.rsvped) {
        await api.delete(`/events/rsvp/${event.id}`);
        showToast('RSVP cancelled', 'info');
      } else {
        await api.post(`/events/rsvp/${event.id}`);
        showToast("You're going! RSVP confirmed.", 'success');
      }
      await fetchEvents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update RSVP', 'danger');
    } finally {
      setRsvping(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2><i className="bi bi-calendar-event me-2" style={{color:'var(--primary)'}}></i>Campus Events</h2>
        <p>{events.length} upcoming event{events.length !== 1 ? 's' : ''} available</p>
      </div>

      {toast.msg && (
        <div className={`alert alert-${toast.type} d-flex align-items-center gap-2`}>
          <i className={`bi bi-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {toast.msg}
        </div>
      )}

      {events.length === 0 ? (
        <div className="empty-state"><i className="bi bi-calendar-x"></i><p>No events available right now.</p></div>
      ) : (
        <div className="row g-3">
          {events.map((event) => (
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
                    <div className="event-meta-item"><i className="bi bi-clock"></i>{event.event_time?.slice(0,5)}</div>
                    <div className="event-meta-item"><i className="bi bi-geo-alt-fill"></i>{event.location}</div>
                    <div className="event-meta-item">
                      <i className="bi bi-people-fill"></i>
                      {event.rsvp_count} going
                    </div>
                  </div>
                  <p style={{fontSize:'0.875rem',color:'var(--text-muted)',margin:'0 0 1rem',lineHeight:'1.6'}}>{event.description}</p>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className={`btn btn-sm ${event.rsvped ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => toggleRsvp(event)}
                      disabled={rsvping === event.id}
                    >
                      {rsvping === event.id
                        ? <><span className="spinner-border spinner-border-sm me-1"></span>Updating...</>
                        : event.rsvped
                          ? <><i className="bi bi-check-circle-fill me-1"></i>Going</>
                          : <><i className="bi bi-calendar-check me-1"></i>RSVP</>
                      }
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => saveEvent(event.id)} disabled={saving === event.id}>
                      {saving === event.id
                        ? <><span className="spinner-border spinner-border-sm me-1"></span>Saving...</>
                        : <><i className="bi bi-bookmark-plus me-1"></i>Bookmark</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;
