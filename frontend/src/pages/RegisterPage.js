import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ fullName:'', email:'', password:'', confirmPassword:'', course:'', interests:'', bio:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center my-4">
      <div className="col-md-8 col-lg-7">
        <div className="auth-card">
          <div className="auth-card-header">
            <div style={{width:44,height:44,background:'rgba(255,255,255,0.15)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',marginBottom:'0.75rem'}}>
              <i className="bi bi-person-plus-fill"></i>
            </div>
            <h2>Create Student Account</h2>
            <p>Join CampusLink and start connecting with peers</p>
          </div>
          <div className="auth-card-body">
            {error && <div className="alert alert-danger"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" name="fullName" placeholder="e.g. Alex Johnson" onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">University Email</label>
                  <input className="form-control" name="email" type="email" placeholder="you@university.edu" onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <input className="form-control" name="password" type="password" placeholder="Min. 6 characters" onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Confirm Password</label>
                  <input className="form-control" name="confirmPassword" type="password" placeholder="Re-enter password" onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Course / Programme</label>
                  <input className="form-control" name="course" placeholder="e.g. Computer Science" onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Interests</label>
                  <input className="form-control" name="interests" placeholder="e.g. AI, Web Dev, Music" onChange={onChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Short Bio <span style={{fontWeight:400,textTransform:'none',color:'var(--text-muted)',fontSize:'0.75rem'}}>(optional)</span></label>
                  <textarea className="form-control" name="bio" rows="3" placeholder="Tell others a bit about yourself..." onChange={onChange} />
                </div>
              </div>
              <button className="btn btn-primary w-100 mt-4 py-2" type="submit" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</> : <><i className="bi bi-rocket-takeoff me-2"></i>Create Account</>}
              </button>
            </form>
            <p className="text-center mt-3 mb-0" style={{fontSize:'0.875rem',color:'var(--text-muted)'}}>
              Already have an account? <Link to="/login" style={{color:'var(--primary)',fontWeight:600}}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
