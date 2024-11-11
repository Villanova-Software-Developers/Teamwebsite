
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import { Home, Members, Projects, Faq, Team, SubmitIdea } from './pages';
import { AdminDashboard, TeamManagement, ProjectManagement } from './pages/admin';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';

// Protected Route Component
const ProtectedRoute = ({ children }) => {

  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;

};

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Members />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/team" element={<Team />} />
        <Route path="/submit-idea" element={<SubmitIdea />} />
      </Route>

      {/* Admin Routes */}
      /*
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="projects" element={<ProjectManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
