import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

function AppRoutes() {
  const { user } = useAuth();

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
              <LawyerDashboard />
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
          path="/client-dashboard"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
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
          path="/edit-client-profile"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <EditClientProfile />
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
        <Route path="/ai-chatbot" element={<AIChatbot />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

function getDashboardRoute(role) {
  switch (role) {
    case 'admin':
      return '/admin-profile';
    case 'lawyer':
      return '/lawyer-profile';
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
