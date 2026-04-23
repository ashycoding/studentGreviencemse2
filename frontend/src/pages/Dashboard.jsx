import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [grievances, setGrievances] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Academic' });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchGrievances = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/grievances`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setGrievances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchGrievances = async () => {
    if(!searchQuery.trim()) return fetchGrievances();
    try {
      const res = await axios.get(`${API_URL}/api/grievances/search?title=${searchQuery}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setGrievances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchGrievances();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/grievances/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/api/grievances`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }
      setFormData({ title: '', description: '', category: 'Academic' });
      fetchGrievances();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (grievance) => {
    setEditingId(grievance._id);
    setFormData({ title: grievance.title, description: grievance.description, category: grievance.category });
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this?')) {
      try {
        await axios.delete(`${API_URL}/api/grievances/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchGrievances();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <button onClick={logout} className="btn-logout">Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="grievance-form-container">
          <h2>{editingId ? 'Edit Grievance' : 'Submit a Grievance'}</h2>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={onChange}>
                <option value="Academic">Academic</option>
                <option value="Hostel">Hostel</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={onChange} required rows="5"></textarea>
            </div>
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Submit'}</button>
            {editingId && <button type="button" className="btn-cancel" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', category: 'Academic' }); }}>Cancel</button>}
          </form>
        </div>

        <div className="grievances-list-container">
          <div className="list-header">
            <h2>Your Grievances</h2>
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="grievances-list">
            {grievances.length === 0 ? <p>No grievances found.</p> : null}
            {grievances.map((g) => (
              <div key={g._id} className="grievance-card">
                <div className="grievance-header">
                  <h3>{g.title}</h3>
                  <span className={`status badge-${g.status.toLowerCase()}`}>{g.status}</span>
                </div>
                <p className="category"><strong>Category:</strong> {g.category}</p>
                <p className="description">{g.description}</p>
                <p className="date">Submitted on: {new Date(g.createdAt).toLocaleDateString()}</p>
                
                <div className="card-actions">
                  <button onClick={() => handleEdit(g)} className="btn-edit" disabled={g.status === 'Resolved'}>Edit</button>
                  <button onClick={() => handleDelete(g._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
