import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const catClass = (cat) => `cat-${['Academic','Tech','Wellbeing','Career'].includes(cat) ? cat : 'default'}`;
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '';

function AdminDashboardPage() {
  const [events, setEvents] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const loadEvents = () => api.get('/events').then(({ data }) => setEvents(data));
  useEffect(() => { loadEvents(); }, []);

  const deleteEvent = async (id) => {
    setDeleting(id);
    await api.delete(`/admin/events/${id}`);
    await loadEvents();
    setDeleting(null);
    setConfirm(null);
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h2><i className="bi bi-speedometer2 me-2"></i>Admin Dashboard</h2>
          <p style={{color:'rgba(255,255,255,0.6)',margin:'0.25rem 0 0',fontSize:'0.875rem'}}>{events.length} event{events.length !== 1 ? 's' : ''} on campus</p>
        </div>
        <Link className="btn btn-sm px-4 py-2" to="/admin/events/add"
          style={{background:'rgba(255,255,255,0.15)',color:'#fff',border:'1px solid rgba(255,255,255,0.25)',borderRadius:10,fontWeight:600}}>
          <i className="bi bi-plus-lg me-2"></i>Add Event
        </Link>
      </div>

      {confirm && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between mb-3">
          <span><i className="bi bi-exclamation-triangle-fill me-2"></i>Delete <strong>{events.find(e => e.id === confirm)?.title}</strong>? This cannot be undone.</span>
          <div className="d-flex gap-2 ms-3">
            <button className="btn btn-danger btn-sm" onClick={() => deleteEvent(confirm)} disabled={deleting === confirm}>
              {deleting === confirm ? <span className="spinner-border spinner-border-sm"></span> : 'Delete'}
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="empty-state"><i className="bi bi-calendar-x"></i><p>No events yet. Add one to get started.</p></div>
      ) : (
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',overflow:'hidden',boxShadow:'var(--shadow-sm)'}}>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th style={{textAlign:'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td style={{fontWeight:600,maxWidth:200}}>{event.title}</td>
                    <td style={{whiteSpace:'nowrap'}}>{formatDate(event.event_date)}</td>
                    <td>{event.event_time?.slice(0,5)}</td>
                    <td style={{color:'var(--text-muted)',fontSize:'0.875rem'}}>{event.location}</td>
                    <td><span className={`badge ${catClass(event.category)}`}>{event.category}</span></td>
                    <td style={{textAlign:'right',whiteSpace:'nowrap'}}>
                      <Link className="btn btn-sm btn-outline-primary me-2" to={`/admin/events/edit/${event.id}`}>
                        <i className="bi bi-pencil me-1"></i>Edit
                      </Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirm(event.id)}>
                        <i className="bi bi-trash me-1"></i>Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
