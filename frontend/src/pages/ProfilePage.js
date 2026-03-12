import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?';

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => { api.get('/users/profile').then(({ data }) => setProfile(data)); }, []);

  if (!profile) return <div className="loading-spinner"><div className="spinner-border text-primary"></div><span>Loading profile...</span></div>;

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-GB', { month:'long', year:'numeric' });

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-7">
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',overflow:'hidden',boxShadow:'var(--shadow)'}}>
          <div style={{background:'linear-gradient(135deg,#1a1a2e,#0f3460)',padding:'2rem',display:'flex',alignItems:'center',gap:'1.5rem'}}>
            <div className="profile-avatar-large" style={{margin:0}}>
              {getInitials(profile.full_name)}
            </div>
            <div style={{color:'#fff'}}>
              <h2 style={{fontWeight:800,fontSize:'1.5rem',margin:'0 0 0.25rem',letterSpacing:'-0.5px'}}>{profile.full_name}</h2>
              <div style={{color:'rgba(255,255,255,0.65)',fontSize:'0.875rem'}}><i className="bi bi-envelope me-2"></i>{profile.email}</div>
              <div style={{marginTop:'0.5rem'}}>
                <span style={{background:'rgba(255,255,255,0.15)',color:'#fff',borderRadius:100,padding:'0.2rem 0.75rem',fontSize:'0.78rem',fontWeight:600}}>
                  <i className="bi bi-mortarboard me-1"></i>Student
                </span>
                <span style={{background:'rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.75)',borderRadius:100,padding:'0.2rem 0.75rem',fontSize:'0.78rem',marginLeft:'0.5rem'}}>
                  <i className="bi bi-calendar me-1"></i>Since {memberSince}
                </span>
              </div>
            </div>
          </div>

          <div style={{padding:'1.75rem'}}>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="section-label"><i className="bi bi-book me-1"></i>Course / Programme</div>
                <div style={{fontWeight:600,color:'var(--text)'}}>{profile.course}</div>
              </div>
              <div className="col-md-6">
                <div className="section-label"><i className="bi bi-stars me-1"></i>Interests</div>
                <div>
                  {profile.interests?.split(',').map(i => i.trim()).filter(Boolean).map(tag => (
                    <span key={tag} className="profile-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="col-12">
                <div className="section-label"><i className="bi bi-person-lines-fill me-1"></i>About Me</div>
                <p style={{color:'var(--text)',lineHeight:1.7,margin:0}}>
                  {profile.bio || <span style={{color:'var(--text-muted)',fontStyle:'italic'}}>No bio added yet. Edit your profile to add one.</span>}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3" style={{borderTop:'1px solid var(--border)'}}>
              <Link className="btn btn-primary" to="/profile/edit">
                <i className="bi bi-pencil-square me-2"></i>Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
