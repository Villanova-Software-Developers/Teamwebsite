import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import { Home, Members, Projects, Faq, Team, SubmitIdea } from './pages';
import { AdminDashboard, TeamManagement, ProjectManagement } from './pages/admin';
import JoinRequestsManagement from './pages/admin/JoinRequestsManagement';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/auth//Login';
import Register from './pages/auth/Register';
import JoinUs from './pages/JoinUs';
import ProjectManager from './pages/admin/ProjectManager';
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
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
       < Route path="/join-us" element={<JoinUs />} />
        <Route path="/submit-idea" element={<SubmitIdea />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin/register"
        element={
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="projects" element={<ProjectManagement />} />
        <Route path="join-requests" element={<JoinRequestsManagement />} />
        <Route path="project-manager" element={<ProjectManager />} />

      </Route>
    </Routes>
  );
}

export default App;