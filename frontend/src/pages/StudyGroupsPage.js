import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?';
const avatarColors = ['#4f46e5','#0891b2','#059669','#d97706','#dc2626'];
const getColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

function StudyGroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [acting, setActing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', course: '', description: '', max_members: 10 });
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');

  const fetchGroups = () =>
    api.get('/groups').then(({ data }) => { setGroups(data); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => { fetchGroups(); }, []);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const handleJoin = async (groupId) => {
    setActing(groupId);
    try {
      await api.post(`/groups/${groupId}/join`);
      showToast('Joined group!', 'success');
      await fetchGroups();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not join group', 'danger');
    } finally {
      setActing(null);
    }
  };

  const handleLeave = async (groupId) => {
    setActing(groupId);
    try {
      await api.delete(`/groups/${groupId}/leave`);
      showToast('Left group', 'info');
      await fetchGroups();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not leave group', 'danger');
    } finally {
      setActing(null);
    }
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm('Delete this group? This cannot be undone.')) return;
    setActing(groupId);
    try {
      await api.delete(`/groups/${groupId}`);
      showToast('Group deleted', 'info');
      await fetchGroups();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete group', 'danger');
    } finally {
      setActing(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/groups', form);
      showToast('Study group created!', 'success');
      setForm({ name: '', course: '', description: '', max_members: 10 });
      setShowForm(false);
      await fetchGroups();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not create group', 'danger');
    } finally {
      setCreating(false);
    }
  };

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.course.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-spinner"><div className="spinner-border text-primary"></div><span>Loading groups...</span></div>;

  return (
    <div>
      <div className="page-header">
        <h2><i className="bi bi-people-fill me-2" style={{color:'var(--primary)'}}></i>Study Groups</h2>
        <p>{groups.length} group{groups.length !== 1 ? 's' : ''} available</p>
      </div>

      {toast.msg && (
        <div className={`alert alert-${toast.type} d-flex align-items-center gap-2`}>
          <i className={`bi bi-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {toast.msg}
        </div>
      )}

      <div className="d-flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          className="form-control"
          style={{maxWidth:300}}
          placeholder="Search by name or course..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className={`bi bi-${showForm ? 'x-lg' : 'plus-lg'} me-1`}></i>
          {showForm ? 'Cancel' : 'Create Group'}
        </button>
      </div>

      {showForm && (
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.5rem',marginBottom:'1.5rem'}}>
          <h5 style={{fontWeight:700,marginBottom:'1rem'}}>Create a Study Group</h5>
          <form onSubmit={handleCreate}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Group Name *</label>
                <input className="form-control" placeholder="e.g. CS Finals Squad" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Course *</label>
                <input className="form-control" placeholder="e.g. Computer Science" value={form.course}
                  onChange={e => setForm({...form, course: e.target.value})} required />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold">Description</label>
                <input className="form-control" placeholder="What will your group focus on?" value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Max Members</label>
                <input type="number" className="form-control" min={2} max={50} value={form.max_members}
                  onChange={e => setForm({...form, max_members: Number(e.target.value)})} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? <><span className="spinner-border spinner-border-sm me-1"></span>Creating...</> : 'Create Group'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-people"></i>
          <p>{search ? 'No groups match your search.' : 'No study groups yet. Be the first to create one!'}</p>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((group) => {
            const isFull = Number(group.member_count) >= group.max_members;
            const isCreator = group.creator_id === user?.id;
            return (
              <div key={group.id} className="col-md-6">
                <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.25rem',height:'100%',display:'flex',flexDirection:'column'}}>
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div style={{width:44,height:44,borderRadius:12,background:getColor(group.name),display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'1rem',flexShrink:0}}>
                      {getInitials(group.name)}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <h6 style={{margin:0,fontWeight:700,fontSize:'0.95rem'}}>{group.name}</h6>
                        {isCreator && <span className="badge bg-primary" style={{fontSize:'0.7rem'}}>Your group</span>}
                        {isFull && <span className="badge bg-secondary" style={{fontSize:'0.7rem'}}>Full</span>}
                      </div>
                      <div style={{fontSize:'0.8rem',color:'var(--text-muted)',marginTop:'0.1rem'}}>
                        <i className="bi bi-mortarboard me-1"></i>{group.course}
                      </div>
                    </div>
                  </div>

                  {group.description && (
                    <p style={{fontSize:'0.875rem',color:'var(--text-muted)',lineHeight:'1.5',marginBottom:'0.75rem',flex:1}}>
                      {group.description}
                    </p>
                  )}

                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-auto pt-2" style={{borderTop:'1px solid var(--border)'}}>
                    <div className="d-flex gap-3" style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>
                      <span><i className="bi bi-people me-1"></i>{group.member_count}/{group.max_members} members</span>
                      <span><i className="bi bi-person me-1"></i>by {group.creator_name}</span>
                    </div>
                    <div className="d-flex gap-2">
                      {isCreator ? (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(group.id)} disabled={acting === group.id}>
                          {acting === group.id ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-trash me-1"></i>Delete</>}
                        </button>
                      ) : group.is_member ? (
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleLeave(group.id)} disabled={acting === group.id}>
                          {acting === group.id ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-box-arrow-left me-1"></i>Leave</>}
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleJoin(group.id)} disabled={acting === group.id || isFull}>
                          {acting === group.id ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-plus-circle me-1"></i>Join</>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudyGroupsPage;
