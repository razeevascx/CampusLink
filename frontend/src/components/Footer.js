function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
          <span className="footer-brand">
            <i className="bi bi-mortarboard-fill me-2"></i>CampusLink
          </span>
          <small style={{fontSize:'0.8rem'}}>Secure Study Buddy &amp; Campus Events Platform</small>
          <div className="d-flex gap-3" style={{fontSize:'0.8rem'}}>
            <span><i className="bi bi-shield-check me-1" style={{color:'#10b981'}}></i>JWT Secured</span>
            <span><i className="bi bi-database me-1" style={{color:'#60a5fa'}}></i>PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
