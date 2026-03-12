import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const categories = ['Academic', 'Tech', 'Wellbeing', 'Career', 'Social', 'Sport', 'Other'];

function AddEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', eventDate:'', eventTime:'', location:'', category:'', description:'' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/admin/events', form);
    navigate('/admin/dashboard');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',overflow:'hidden',boxShadow:'var(--shadow)'}}>
          <div style={{background:'linear-gradient(135deg,#1a1a2e,#0f3460)',padding:'1.75rem'}}>
            <h2 style={{color:'#fff',fontWeight:800,margin:0,letterSpacing:'-0.5px'}}>
              <i className="bi bi-calendar-plus me-2"></i>Add Campus Event
            </h2>
            <p style={{color:'rgba(255,255,255,0.6)',margin:'0.25rem 0 0',fontSize:'0.875rem'}}>Create a new event for students to discover</p>
          </div>

          <div style={{padding:'1.75rem'}}>
            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Event Title</label>
                  <input className="form-control" name="title" placeholder="e.g. Exam Prep Sprint" onChange={onChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Date</label>
                  <input className="form-control" type="date" name="eventDate" onChange={onChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Time</label>
                  <input className="form-control" type="time" name="eventTime" onChange={onChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category" onChange={onChange} required defaultValue="">
                    <option value="" disabled>Select category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Location</label>
                  <input className="form-control" name="location" placeholder="e.g. Library Seminar Hall" onChange={onChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" rows="4" placeholder="Describe the event..." onChange={onChange} required />
                </div>
              </div>
              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating...</> : <><i className="bi bi-plus-circle me-2"></i>Create Event</>}
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

export default AddEventPage;
