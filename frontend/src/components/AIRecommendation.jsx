import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AIRecommendation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployeeAndInsights = async () => {
      try {
        setLoading(true);
        // First get employee details
        const empRes = await api.get(`/employees/${id}`);
        setEmployee(empRes.data.data);

        // Then get AI insights
        const aiRes = await api.post('/ai/recommend', { employeeId: id });
        setAiData(aiRes.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to fetch AI insights. Make sure AI_API_KEY is correct in backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeAndInsights();
  }, [id]);

  if (loading) {
    return (
      <div className="card text-center" style={{ padding: '3rem' }}>
        <h2>Analyzing Employee Data...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Our AI is reviewing performance metrics and experience.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-danger">{error}</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>AI Performance Insights: {employee?.name}</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Back</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '1rem' }}>
        <div>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Employee Profile</h3>
          <p><strong>Department:</strong> {employee?.department}</p>
          <p><strong>Experience:</strong> {employee?.experience} years</p>
          <p><strong>Performance Score:</strong> <span className={employee?.performanceScore >= 80 ? 'badge badge-success' : 'badge'}>{employee?.performanceScore}/100</span></p>
          
          <div style={{ marginTop: '1rem' }}>
            <strong>Skills:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {employee?.skills.map((skill, index) => (
                <span key={index} className="badge badge-primary">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {aiData && (
          <div className="ai-results">
            <h3>🤖 AI Recommendation Report</h3>
            
            <h4>Ranking</h4>
            <p><span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{aiData.employeeRanking}</span></p>
            
            <h4>Promotion Readiness</h4>
            <p>{aiData.promotionRecommendation}</p>
            
            <h4>Constructive Feedback</h4>
            <p>{aiData.feedback}</p>
            
            <h4>Suggested Training</h4>
            <ul>
              {aiData.trainingSuggestions?.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
