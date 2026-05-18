import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import AIRecommendation from '../components/AIRecommendation';

const Dashboard = ({ setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <nav className="navbar">
        <div className="navbar-brand">AI HR Analytics</div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Employees</Link>
          <Link to="/dashboard/add" className="nav-link">Add Employee</Link>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add" element={<EmployeeForm />} />
          <Route path="/edit/:id" element={<EmployeeForm />} />
          <Route path="/ai-recommendation/:id" element={<AIRecommendation />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
