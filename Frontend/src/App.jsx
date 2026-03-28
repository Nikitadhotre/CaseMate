import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Layout from './components/Layout';
import Home from './pages/Home';
import LawyerSearch from './pages/LawyerSearch';
import LawyerProfile from './pages/LawyerProfile';
import LawyerProfilePage from './pages/LawyerProfilePage';
import LawyerDashboard from './pages/LawyerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UpdateCase from './pages/UpdateCase';
import ViewCaseDetails from './pages/ViewCaseDetails';
import ClientProfile from './pages/ClientProfile';
import EditClientProfile from './pages/EditClientProfile';
import AdminProfile from './pages/AdminProfile';
import EditLawyerProfile from './pages/EditLawyerProfile';
import EditAdminProfile from './pages/EditAdminProfile';
import Payment from './pages/Payment';
import AIChatbot from './pages/AIChatbot';
import Login from './pages/Login';
import LawyerCases from './pages/LawyerCases';
import LawyerClients from './pages/LawyerClients';
import LawyerDocuments from './pages/LawyerDocuments';
import LawyerCalendar from './pages/LawyerCalendar';
import LawyerSettings from './pages/LawyerSettings';

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Routes that should NOT show the footer (dashboard pages)
  const noFooterRoutes = [
    '/lawyer-dashboard', 
    '/client-dashboard', 
    '/admin-dashboard', 
    '/lawyer-profile', 
    '/client-profile', 
    '/admin-profile', 
    '/edit-lawyer-profile', 
    '/edit-client-profile', 
    '/edit-admin-profile', 
    '/update-case', 
    '/view-case', 
    '/payment',
    '/lawyer-cases',
    '/lawyer-clients',
    '/lawyer-documents',
    '/lawyer-calendar',
    '/lawyer-settings',
  ];
  const showFooter = !noFooterRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to={getDashboardRoute(user.role)} /> : <Login />} />
        <Route path="/lawyers" element={<LawyerSearch />} />
        <Route path="/lawyer/:id" element={<LawyerProfilePage />} />
        <Route
          path="/lawyer-dashboard"
          element={
            <ProtectedRoute allowedRoles={['lawyer']}>
              <Layout>
                <LawyerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <Layout>
                <ClientDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lawyer-profile"
          element={
            <ProtectedRoute allowedRoles={['lawyer']}>
              <LawyerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-profile"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-client-profile"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <EditClientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-lawyer-profile"
          element={
            <ProtectedRoute allowedRoles={['lawyer']}>
              <EditLawyerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-admin-profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditAdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-case/:caseId"
          element={
            <ProtectedRoute allowedRoles={['lawyer']}>
              <UpdateCase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-case/:caseId"
          element={
            <ProtectedRoute allowedRoles={['lawyer', 'client']}>
              <ViewCaseDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lawyer-cases"
          element={
            <ProtectedRoute allowedRoles={['lawyer']}>
              <Layout>
                <LawyerCases />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lawyer-clients"
          element={
            <ProtectedRoute allowedRoles={['lawyer']}>
              <Layout>
                <LawyerClients />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lawyer-documents"
          element={
            <ProtectedRoute allowedRoles={['lawyer']}>
              <Layout>
                <LawyerDocuments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lawyer-calendar"
          element={
            <ProtectedRoute allowedRoles={['lawyer']}>
              <Layout>
                <LawyerCalendar />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lawyer-settings"
          element={
            <ProtectedRoute allowedRoles={['lawyer']}>
              <Layout>
                <LawyerSettings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/ai-chatbot" element={<AIChatbot />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

function getDashboardRoute(role) {
  switch (role) {
    case 'admin':
      return '/admin-dashboard';
    case 'lawyer':
      return '/lawyer-dashboard';
    case 'client':
      return '/client-dashboard';
    default:
      return '/';
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
