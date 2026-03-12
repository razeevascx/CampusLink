import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-mortarboard-fill me-2" style={{fontSize:'1.1rem', verticalAlign:'middle'}}></i>
          CampusLink
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
            {!user && (
              <>
                <li className="nav-item">
                  <Link className={isActive('/login')} to="/login">
                    <i className="bi bi-person me-1"></i>Student Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-person-plus me-1"></i>Register
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-sm px-3 py-2" to="/admin/login"
                    style={{background:'rgba(255,255,255,0.12)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'8px',fontWeight:600,fontSize:'0.8rem'}}>
                    <i className="bi bi-shield-lock me-1"></i>Admin
                  </Link>
                </li>
              </>
            )}

            {user && user.role === 'student' && (
              <>
                <li className="nav-item"><Link className={isActive('/dashboard')} to="/dashboard"><i className="bi bi-grid me-1"></i>Dashboard</Link></li>
                <li className="nav-item"><Link className={isActive('/study-buddies')} to="/study-buddies"><i className="bi bi-people me-1"></i>Buddies</Link></li>
                <li className="nav-item"><Link className={isActive('/groups')} to="/groups"><i className="bi bi-diagram-3 me-1"></i>Groups</Link></li>
                <li className="nav-item"><Link className={isActive('/events')} to="/events"><i className="bi bi-calendar-event me-1"></i>Events</Link></li>
                <li className="nav-item"><Link className={isActive('/saved-events')} to="/saved-events"><i className="bi bi-bookmark me-1"></i>Saved</Link></li>
                <li className="nav-item"><Link className={isActive('/profile')} to="/profile"><i className="bi bi-person-circle me-1"></i>Profile</Link></li>
                <li className="nav-item ms-lg-1 d-flex align-items-center px-1">
                  <NotificationBell />
                </li>
                <li className="nav-item ms-lg-1">
                  <button className="btn btn-link nav-link" onClick={handleLogout} style={{color:'rgba(255,255,255,0.6)'}}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            )}

            {user && user.role === 'admin' && (
              <>
                <li className="nav-item"><Link className={isActive('/admin/dashboard')} to="/admin/dashboard"><i className="bi bi-speedometer2 me-1"></i>Dashboard</Link></li>
                <li className="nav-item ms-lg-1">
                  <button className="btn btn-link nav-link" onClick={handleLogout} style={{color:'rgba(255,255,255,0.6)'}}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
