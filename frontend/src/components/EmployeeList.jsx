import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchDept, setSearchDept] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async (dept = '') => {
    try {
      setLoading(true);
      const url = dept ? `/employees/search?department=${dept}` : '/employees';
      const res = await api.get(url);
      setEmployees(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchDept);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Employee Directory</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search department..."
            className="form-control"
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
            style={{ width: '200px' }}
          />
          <button type="submit" className="btn btn-secondary">Search</button>
          {searchDept && (
            <button type="button" className="btn btn-secondary" onClick={() => { setSearchDept(''); fetchEmployees(''); }}>
              Clear
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Score</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id}>
                  <td>
                    <div><strong>{emp.name}</strong></div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                  </td>
                  <td><span className="badge badge-primary">{emp.department}</span></td>
                  <td>{emp.performanceScore}/100</td>
                  <td>{emp.experience} yrs</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/dashboard/edit/${emp._id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>Edit</Link>
                      <button onClick={() => handleDelete(emp._id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>Delete</button>
                      <Link to={`/dashboard/ai-recommendation/${emp._id}`} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>AI Insights</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
