import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const fetchEmployee = async () => {
        try {
          const res = await api.get(`/employees/${id}`);
          const emp = res.data.data;
          setFormData({
            ...emp,
            skills: emp.skills.join(', ')
          });
        } catch (err) {
          setError('Failed to fetch employee details');
        }
      };
      fetchEmployee();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      performanceScore: Number(formData.performanceScore),
      experience: Number(formData.experience)
    };

    try {
      if (isEditMode) {
        await api.put(`/employees/${id}`, payload);
      } else {
        await api.post('/employees', payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card-header">
        <h2>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Department</label>
          <input type="text" name="department" className="form-control" value={formData.department} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Skills (comma separated)</label>
          <input type="text" name="skills" className="form-control" value={formData.skills} onChange={handleChange} placeholder="React, Node, MongoDB" />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Performance Score (0-100)</label>
            <input type="number" name="performanceScore" className="form-control" value={formData.performanceScore} onChange={handleChange} min="0" max="100" required />
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label>Years of Experience</label>
            <input type="number" name="experience" className="form-control" value={formData.experience} onChange={handleChange} min="0" step="0.1" required />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Employee'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
