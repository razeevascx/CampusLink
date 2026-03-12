import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const categories = ['Academic', 'Tech', 'Wellbeing', 'Career', 'Social', 'Sport', 'Other'];

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', eventDate:'', eventTime:'', location:'', category:'', description:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/events').then(({ data }) => {
      const selected = data.find((evt) => String(evt.id) === String(id));
      if (!selected) return;
      setForm({
        title: selected.title,
        eventDate: selected.event_date?.slice(0, 10),
        eventTime: selected.event_time,
        location: selected.location,
        category: selected.category,
        description: selected.description,
      });
    });
  }, [id]);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.put(`/admin/events/${id}`, form);
    navigate('/admin/dashboard');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',overflow:'hidden',boxShadow:'var(--shadow)'}}>
          <div style={{background:'linear-gradient(135deg,#1a1a2e,#0f3460)',padding:'1.75rem'}}>
            <h2 style={{color:'#fff',fontWeight:800,margin:0,letterSpacing:'-0.5px'}}>
              <i className="bi bi-pencil-square me-2"></i>Edit Event
            </h2>
            <p style={{color:'rgba(255,255,255,0.6)',margin:'0.25rem 0 0',fontSize:'0.875rem'}}>Update the event details below</p>
          </div>

          <div style={{padding:'1.75rem'}}>
            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Event Title</label>
                  <input className="form-control" name="title" value={form.title} onChange={onChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Date</label>
                  <input className="form-control" type="date" name="eventDate" value={form.eventDate} onChange={onChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Time</label>
                  <input className="form-control" type="time" name="eventTime" value={form.eventTime} onChange={onChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category" value={form.category} onChange={onChange} required>
                    <option value="" disabled>Select category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Location</label>
                  <input className="form-control" name="location" value={form.location} onChange={onChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" rows="4" value={form.description} onChange={onChange} required />
                </div>
              </div>
              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="bi bi-check2 me-2"></i>Save Changes</>}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/admin/dashboard')}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEventPage;
