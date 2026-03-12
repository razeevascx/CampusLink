import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?';
const avatarColors = ['#4f46e5','#0891b2','#059669','#d97706','#7c3aed','#db2777'];
const getColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

const statusBadge = (status) => ({
  pending:  <span className="badge" style={{background:'#fef3c7',color:'#b45309'}}>Pending</span>,
  accepted: <span className="badge" style={{background:'#d1fae5',color:'#065f46'}}>Accepted</span>,
  rejected: <span className="badge" style={{background:'#fee2e2',color:'#b91c1c'}}>Rejected</span>,
}[status] || <span className="badge bg-secondary">{status}</span>);

function StudyBuddiesPage() {
  const [filters, setFilters] = useState({ course: '', interest: '' });
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [sending, setSending] = useState(null);

  const showToast = (msg, type = 'info') => { setToast({ msg, type }); setTimeout(() => setToast({ msg:'', type:'' }), 3000); };

  const fetchStudents = useCallback(async () => {
    const { data } = await api.get('/users/search', { params: filters });
    setStudents(data);
  }, [filters]);

  const fetchRequests = useCallback(async () => {
    const { data } = await api.get('/buddies/requests');
    setRequests(data);
  }, []);

  useEffect(() => { fetchStudents(); fetchRequests(); }, [fetchStudents, fetchRequests]);

  const sendRequest = async (receiverId) => {
    setSending(receiverId);
    try {
      await api.post('/buddies/request', { receiverId });
      showToast('Buddy request sent!', 'success');
      fetchRequests();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not send request', 'danger');
    } finally {
      setSending(null);
    }
  };

  const updateRequest = async (requestId, status) => {
    await api.put(`/buddies/requests/${requestId}`, { status });
    fetchRequests();
  };

  const onSearch = (e) => { e.preventDefault(); fetchStudents(); };

  const sentIds = new Set(requests.outgoing.map(r => r.receiver_id));

  return (
    <div>
      <div className="page-header">
        <h2><i className="bi bi-people-fill me-2" style={{color:'var(--primary)'}}></i>Study Buddy Finder</h2>
        <p>Discover classmates to study with and manage your connection requests</p>
      </div>

      {toast.msg && (
        <div className={`alert alert-${toast.type} d-flex align-items-center gap-2`}>
          <i className={`bi bi-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {toast.msg}
        </div>
      )}

      <div className="search-bar">
        <form className="row g-2 align-items-end" onSubmit={onSearch}>
          <div className="col-md-5">
            <label className="form-label">Filter by Course</label>
            <input className="form-control" placeholder="e.g. Computer Science" value={filters.course}
              onChange={(e) => setFilters(p => ({ ...p, course: e.target.value }))} />
          </div>
          <div className="col-md-5">
            <label className="form-label">Filter by Interest</label>
            <input className="form-control" placeholder="e.g. Machine Learning" value={filters.interest}
              onChange={(e) => setFilters(p => ({ ...p, interest: e.target.value }))} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" type="submit">
              <i className="bi bi-search me-1"></i>Search
            </button>
          </div>
        </form>
      </div>

      {students.length === 0
        ? <div className="empty-state mb-4"><i className="bi bi-people"></i><p>No students match your search. Try different filters.</p></div>
        : (
          <div className="row g-3 mb-4">
            {students.map((student) => (
              <div key={student.id} className="col-md-6 col-lg-4">
                <div className="student-card">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="student-avatar" style={{background:getColor(student.full_name)}}>
                      {getInitials(student.full_name)}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:'0.95rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{student.full_name}</div>
                      <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{student.course}</div>
                    </div>
                  </div>
                  <div style={{marginBottom:'0.75rem'}}>
                    {student.interests?.split(',').map(i => i.trim()).filter(Boolean).map(tag => (
                      <span key={tag} className="profile-tag" style={{fontSize:'0.72rem'}}>{tag}</span>
                    ))}
                  </div>
                  {student.bio && <p style={{fontSize:'0.82rem',color:'var(--text-muted)',margin:'0 0 0.75rem',lineHeight:1.5}}>{student.bio}</p>}
                  <button className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => sendRequest(student.id)} disabled={sending === student.id || sentIds.has(student.id)}>
                    {sentIds.has(student.id)
                      ? <><i className="bi bi-check2 me-1"></i>Request Sent</>
                      : sending === student.id
                      ? <><span className="spinner-border spinner-border-sm me-1"></span>Sending...</>
                      : <><i className="bi bi-person-plus me-1"></i>Send Request</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      <div className="row g-3">
        <div className="col-md-6">
          <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.25rem'}}>
            <div className="section-label"><i className="bi bi-inbox me-2" style={{color:'var(--primary)'}}></i>Incoming Requests ({requests.incoming.length})</div>
            {requests.incoming.length === 0
              ? <div style={{textAlign:'center',padding:'1.5rem',color:'var(--text-muted)',fontSize:'0.875rem'}}><i className="bi bi-inbox" style={{fontSize:'1.75rem',display:'block',marginBottom:'0.5rem',opacity:0.3}}></i>No incoming requests</div>
              : requests.incoming.map((r) => (
                  <div key={r.id} className="request-item">
                    <div className="d-flex align-items-center gap-2" style={{flex:1,minWidth:0}}>
                      <div className="student-avatar" style={{width:36,height:36,fontSize:'0.85rem',flexShrink:0,background:getColor(r.sender_name)}}>{getInitials(r.sender_name)}</div>
                      <div style={{minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:'0.875rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.sender_name}</div>
                        <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{r.course}</div>
                      </div>
                    </div>
                    {r.status === 'pending'
                      ? <div className="d-flex gap-1 flex-shrink-0">
                          <button className="btn btn-success btn-sm" onClick={() => updateRequest(r.id, 'accepted')}><i className="bi bi-check2"></i></button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => updateRequest(r.id, 'rejected')}><i className="bi bi-x"></i></button>
                        </div>
                      : statusBadge(r.status)
                    }
                  </div>
                ))
            }
          </div>
        </div>

        <div className="col-md-6">
          <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.25rem'}}>
            <div className="section-label"><i className="bi bi-send me-2" style={{color:'var(--secondary)'}}></i>Outgoing Requests ({requests.outgoing.length})</div>
            {requests.outgoing.length === 0
              ? <div style={{textAlign:'center',padding:'1.5rem',color:'var(--text-muted)',fontSize:'0.875rem'}}><i className="bi bi-send" style={{fontSize:'1.75rem',display:'block',marginBottom:'0.5rem',opacity:0.3}}></i>No outgoing requests</div>
              : requests.outgoing.map((r) => (
                  <div key={r.id} className="request-item">
                    <div className="d-flex align-items-center gap-2" style={{flex:1,minWidth:0}}>
                      <div className="student-avatar" style={{width:36,height:36,fontSize:'0.85rem',flexShrink:0,background:getColor(r.receiver_name)}}>{getInitials(r.receiver_name)}</div>
                      <div style={{minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:'0.875rem'}}>{r.receiver_name}</div>
                        <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{r.course}</div>
                      </div>
                    </div>
                    {statusBadge(r.status)}
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyBuddiesPage;
