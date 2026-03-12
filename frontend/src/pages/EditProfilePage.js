import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function EditProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName:'', course:'', interests:'', bio:'' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/users/profile').then(({ data }) => setForm({
      fullName: data.full_name || '',
      course: data.course || '',
      interests: data.interests || '',
      bio: data.bio || '',
    }));
  }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.put('/users/profile', form);
    setMessage('Profile updated successfully!');
    setTimeout(() => navigate('/profile'), 1000);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-7">
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',overflow:'hidden',boxShadow:'var(--shadow)'}}>
          <div style={{background:'linear-gradient(135deg,#1a1a2e,#0f3460)',padding:'1.75rem'}}>
            <h2 style={{color:'#fff',fontWeight:800,margin:0,letterSpacing:'-0.5px'}}>
              <i className="bi bi-pencil-square me-2"></i>Edit Profile
            </h2>
            <p style={{color:'rgba(255,255,255,0.6)',margin:'0.25rem 0 0',fontSize:'0.875rem'}}>Update your student profile information</p>
          </div>

          <div style={{padding:'1.75rem'}}>
            {message && <div className="alert alert-success"><i className="bi bi-check-circle me-2"></i>{message}</div>}

            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" name="fullName" value={form.fullName} onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Course / Programme</label>
                  <input className="form-control" name="course" value={form.course} onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Interests <span style={{fontWeight:400,textTransform:'none',fontSize:'0.75rem',color:'var(--text-muted)'}}>(comma-separated)</span></label>
                  <input className="form-control" name="interests" value={form.interests} onChange={onChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label">About Me</label>
                  <textarea className="form-control" name="bio" rows="4" value={form.bio} onChange={onChange} placeholder="Tell your peers about yourself..." />
                </div>
              </div>
              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="bi bi-check2 me-2"></i>Save Changes</>}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/profile')}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfilePage;
