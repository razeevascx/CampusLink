import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.user.role !== 'student') {
        setError('Please use the admin login page for admin access.');
        setLoading(false);
        return;
      }
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="row justify-content-center w-100">
        <div className="col-md-5 col-lg-4">
          <div className="auth-card">
            <div className="auth-card-header">
              <div style={{width:44,height:44,background:'rgba(255,255,255,0.15)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',marginBottom:'0.75rem'}}>
                <i className="bi bi-person-fill"></i>
              </div>
              <h2>Student Login</h2>
              <p>Sign in to access your campus dashboard</p>
            </div>
            <div className="auth-card-body">
              {error && <div className="alert alert-danger"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{background:'#f8fafc',border:'1.5px solid var(--border)',borderRight:'none',borderRadius:'10px 0 0 10px'}}>
                      <i className="bi bi-envelope" style={{color:'var(--text-muted)'}}></i>
                    </span>
                    <input className="form-control" name="email" type="email" placeholder="you@university.edu"
                      onChange={onChange} required style={{borderLeft:'none',borderRadius:'0 10px 10px 0'}} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{background:'#f8fafc',border:'1.5px solid var(--border)',borderRight:'none',borderRadius:'10px 0 0 10px'}}>
                      <i className="bi bi-lock" style={{color:'var(--text-muted)'}}></i>
                    </span>
                    <input className="form-control" name="password" type="password" placeholder="••••••••"
                      onChange={onChange} required style={{borderLeft:'none',borderRadius:'0 10px 10px 0'}} />
                  </div>
                </div>
                <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</> : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>}
                </button>
              </form>
              <p className="text-center mt-3 mb-0" style={{fontSize:'0.875rem',color:'var(--text-muted)'}}>
                Don't have an account? <Link to="/register" style={{color:'var(--primary)',fontWeight:600}}>Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
