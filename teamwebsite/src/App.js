import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import { Home, Members, Projects, Faq, Team, SubmitIdea } from './pages';
import { AdminDashboard, TeamManagement, ProjectManagement } from './pages/admin';
import JoinRequestsManagement from './pages/admin/JoinRequestsManagement';
import { useAuth } from './contexts/AuthContext';
import { db } from './contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JoinUs from './pages/JoinUs';
import ProjectManager from './pages/admin/ProjectManager';
import { useNavigate } from 'react-router-dom';
import MemberRegistration from './pages/MemberRegistration'; // Add this import
import PendingMembers from './pages/admin/PendingMembers'; // Add this import
import MedicalQA from './pages/Medicalqa';
import WeeklyTasks from './pages/WeeklyTasks';
import BasicLayout from './components/layout/BasicLayout';
import TimeAvailability from './pages/teamavail';
import TimeAvailabilityAdmin from './pages/admin/avail';
import Star from './pages/star';
import ActivityAndChatPage from './pages/s';
import ResultsAnalysisPage from './pages/trick';
import VoiceAssistant from './pages/voice';
import Sign from './pages/sign';// Enhanced Protected Route Component
import FinLitApp from './pages/finlit';
import FinancialLiteracyGameMap from './pages/gamify';
import BudgetGame from './pages/budget';//test
//sd
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Auth Check - Current User:", user); // Debug log

      if (!user) {
        console.log("No user - redirecting to login"); // Debug log
        setIsLoading(false);
        navigate('/admin/login');
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        console.log("Admin Doc Data:", adminDoc.data()); // Debug log

        if (adminDoc.exists()) {
          console.log("Admin verified"); // Debug log
          setIsAuthorized(true);
        } else {
          console.log("Not an admin - redirecting"); // Debug log
          navigate('/admin/login');
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate('/admin/login');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">
          Verifying access...
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
};
// Session timeout HOC
const withSessionTimeout = (WrappedComponent) => {
  return (props) => {
    const { user, logout } = useAuth();
    const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

    useEffect(() => {
      if (!user) return;

      let timeoutId;
      const resetTimeout = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          await logout();
        }, TIMEOUT_DURATION);
      };

      // Set up event listeners
      const events = ['mousedown', 'mousemove', 'keypress'];
      events.forEach(event => {
        document.addEventListener(event, resetTimeout);
      });

      // Initial timeout
      resetTimeout();

      // Cleanup
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        events.forEach(event => {
          document.removeEventListener(event, resetTimeout);
        });
      };
    }, [user, logout]);

    return <WrappedComponent {...props} />;
  };
};

const AdminLayoutWithTimeout = withSessionTimeout(AdminLayout);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Members />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/team" element={<Team />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/submit-idea" element={<SubmitIdea />} />
        <Route path="/register-member" element={<MemberRegistration />} /> 
        <Route path="/weekly-tasks" element={<WeeklyTasks />} /> {/* Add this route */}
        <Route path="/availability" element={<TimeAvailability />} /> {/* Add this route */}
        <Route path="/voice" element={<VoiceAssistant />} /> {/* Add this route */}
        <Route path="/sign" element={<Sign />} /> {/* Add this route */}

    



      </Route>
       {/* Route without navbar */}
       <Route element={<BasicLayout />}>
        <Route path="/medical-qa" element={<MedicalQA />} />
        <Route path="/s" element={<Star />} />
          <Route path="/ss" element={<ActivityAndChatPage />} />
          <Route path="/f" element={<ResultsAnalysisPage />} />
          <Route path="/fin" element={<FinLitApp />} /> {/* Add this route */}
          <Route path="/game" element={<FinancialLiteracyGameMap />} /> {/* Add this route */}
          <Route path="/bud" element={<BudgetGame />} /> {/* Add this route */}



      </Route>

      {/* Auth Routes */}
      <Route path="/admin/login" element={<Login />} />
      
      {/* Protected Admin Routes */}
      <Route
        path="/admin/register"
        element={
          <ProtectedRoute requiredRole="SUPER_ADMIN">
            <Register />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayoutWithTimeout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route 
          path="team" 
          element={
            <ProtectedRoute requiredRole="SUPER_ADMIN">
              <TeamManagement />
            </ProtectedRoute>
          } 
        />
        <Route path="projects" element={<ProjectManagement />} />
        <Route path="join-requests" element={<JoinRequestsManagement />} />
        <Route path="project-manager" element={<ProjectManager />} />
        <Route path="avail" element={<TimeAvailabilityAdmin />} />

        <Route 
          path="pending-members" 
          element={
            <ProtectedRoute requiredRole="SUPER_ADMIN">
              <PendingMembers />
            </ProtectedRoute>
          }
        /> {/* Add this route */}
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
