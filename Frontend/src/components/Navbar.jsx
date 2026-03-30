import { Scale, Menu, X, User, LogOut, UserCircle, ChevronDown, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Count for notification badge (simplified - in real app, fetch from API)
  const [upcomingHearingsCount, setUpcomingHearingsCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Simulated - in real app, fetch from API
      setUpcomingHearingsCount(0);
    }
  }, [user]);

  const publicMenuItems = [
    { name: 'Home', path: '/' },
    { name: 'Find Lawyers', path: '/lawyers' },
    { name: 'AI Assistant', path: '/ai-chatbot' },
  ];

  const menuItems = publicMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Scale className="w-8 h-8 text-slate-800" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-slate-800">CaseMate</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`transition-colors font-medium ${
                  location.pathname === item.path
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => navigate('/lawyer-dashboard?view=notifications')}
                    className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {upcomingHearingsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {upcomingHearingsCount > 9 ? '9+' : upcomingHearingsCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50"
                      >
                        <Link
                          to={`/${user.role}-profile`}
                          className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => {
                            console.log('Navigating to profile:', `/${user.role}-profile`);
                            setProfileDropdownOpen(false);
                          }}
                        >
                          Profile
                        </Link>
                        {user.role === 'client' && (
                          <Link
                            to="/client-dashboard"
                            className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            Dashboard
                          </Link>
                        )}
                        {user.role === 'lawyer' && (
                          <Link
                            to="/lawyer-dashboard"
                            className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            Dashboard
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link
                            to="/admin-dashboard"
                            className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button className="flex items-center space-x-2 bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-700 transition-all shadow-md hover:shadow-lg">
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block transition-colors font-medium py-2 ${
                    location.pathname === item.path
                      ? 'text-slate-900 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <Link
                    to={`/${user.role}-profile`}
                    className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>{user.name}</span>
                  </Link>
                  {user.role === 'client' && (
                    <Link
                      to="/client-dashboard"
                      className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'lawyer' && (
                    <Link
                      to="/lawyer-dashboard"
                      className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin-dashboard"
                      className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center space-x-2 bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-700 transition-all mt-4">
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
