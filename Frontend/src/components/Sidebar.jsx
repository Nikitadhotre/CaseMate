import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  Users, 
  Calendar, 
  ChevronLeft,
  ChevronDown,
  Briefcase,
  CreditCard,
  MessageSquare,
  LogOut,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Navigation items based on user role
const getNavItems = (role) => {
  switch (role) {
    case 'lawyer':
      return [
        { 
          id: 'add-case', 
          label: 'Add New Case', 
          icon: Plus, 
          path: '/lawyer-dashboard',
          isButton: true,
        },
        { 
          id: 'cases', 
          label: 'My Cases', 
          icon: FolderOpen, 
          children: [
            { id: 'open', label: 'Open Cases', icon: AlertCircle, path: '/lawyer-dashboard?filter=Open' },
            { id: 'inprogress', label: 'In Progress', icon: Clock, path: '/lawyer-dashboard?filter=In Progress' },
            { id: 'completed', label: 'Completed', icon: CheckCircle, path: '/lawyer-dashboard?filter=Closed' },
            { id: 'all', label: 'All Cases', icon: FolderOpen, path: '/lawyer-cases' },
          ]
        },
        { id: 'clients', label: 'Clients', icon: Users, path: '/lawyer-clients' },
        { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/lawyer-calendar' },
        { id: 'chatbot', label: 'AI Assistant', icon: MessageSquare, path: '/ai-chatbot' },
      ];
    case 'client':
      return [
        { 
          id: 'cases', 
          label: 'My Cases', 
          icon: FolderOpen, 
          children: [
            { id: 'open', label: 'Open Cases', icon: AlertCircle, path: '/client-dashboard?filter=Open' },
            { id: 'inprogress', label: 'In Progress', icon: Clock, path: '/client-dashboard?filter=In Progress' },
            { id: 'completed', label: 'Completed', icon: CheckCircle, path: '/client-dashboard?filter=Closed' },
            { id: 'all', label: 'All Cases', icon: FolderOpen, path: '/client-dashboard?filter=all' },
          ]
        },
        { id: 'lawyers', label: 'Find Lawyers', icon: Briefcase, path: '/lawyers' },
        { id: 'payments', label: 'Payments', icon: CreditCard, path: '/payment' },
        { id: 'chatbot', label: 'AI Assistant', icon: MessageSquare, path: '/ai-chatbot' },
      ];
    case 'admin':
      return [
        { 
          id: 'lawyers', 
          label: 'Manage Lawyers', 
          icon: Briefcase, 
          children: [
            { id: 'all-lawyers', label: 'All Lawyers', icon: Users, path: '/admin-dashboard?tab=lawyers' },
            { id: 'pending-approvals', label: 'Pending Approvals', icon: Clock, path: '/admin-dashboard?tab=pending' },
          ]
        },
        { 
          id: 'clients', 
          label: 'Manage Clients', 
          icon: Users, 
          children: [
            { id: 'all-clients', label: 'All Clients', icon: Users, path: '/admin-dashboard?tab=clients' },
          ]
        },
        { 
          id: 'cases', 
          label: 'All Cases', 
          icon: FolderOpen, 
          children: [
            { id: 'open-cases', label: 'Open Cases', icon: AlertCircle, path: '/admin-dashboard?filter=Open' },
            { id: 'closed-cases', label: 'Closed Cases', icon: CheckCircle, path: '/admin-dashboard?filter=Closed' },
          ]
        },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin-dashboard' },
      ];
    default:
      return [];
  }
};

const Sidebar = ({ isCollapsed: externalCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Use external state if provided, otherwise use internal state
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const handleToggle = onToggle || (() => setInternalCollapsed(!internalCollapsed));

  // State for dropdown menus
  const [openDropdown, setOpenDropdown] = useState(null);

  const navItems = getNavItems(user?.role || 'lawyer');

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleNavClick = (item) => {
    if (item.isButton && item.path) {
      navigate(`${item.path}?action=add-case`);
    } else if (item.children) {
      toggleDropdown(item.id);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleChildClick = (path) => {
    navigate(path);
    setOpenDropdown(null);
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  // Get role display name
  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'lawyer': return 'Attorney';
      case 'client': return 'Client';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  return (
    <>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 shadow-xl transition-all duration-300 flex flex-col"
      >
        {/* Toggle button */}
        <button
          onClick={handleToggle}
          className="absolute -right-3 top-4 z-10 p-2.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white border border-slate-200 hover:shadow-lg transition-all duration-300 shadow-md"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </motion.div>
        </button>

        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-white/100 backdrop-blur-sm">
          
          {/* User Info Section */}
          <motion.div 
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
            style={{ maxWidth: isCollapsed ? 0 : 240 }}
            onClick={() => navigate(`/${user?.role}-profile`)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user?.role === 'lawyer' ? <Briefcase className="w-5 h-5" /> : user?.role === 'admin' ? <Shield className="w-5 h-5" /> : getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{getRoleDisplay()}</p>
            </div>
          </motion.div>
        </div>

        {/* Nav links */}
        <nav className="mt-4 px-4 pb-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.id}>
              <motion.button
                whileHover={{ x: isCollapsed ? 2 : 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick(item)}
                className={`group relative w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 ${
                  item.isButton 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                    : isActive(item.path)
                      ? 'bg-slate-200 text-slate-800 font-medium'
                      : 'text-slate-700'
                }`}
                aria-current={isActive(item.path) ? 'page' : undefined}
                aria-label={item.label}
              >
                <item.icon 
                  className={`w-6 h-6 flex-shrink-0 transition-all duration-300 ${
                    item.isButton 
                      ? 'text-white' 
                      : isActive(item.path) 
                        ? 'text-slate-800' 
                        : 'text-slate-500 group-hover:text-slate-700'
                  }`} 
                />
                
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isCollapsed ? 'icon-only' : item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`font-semibold text-sm transition-all duration-300 whitespace-nowrap overflow-hidden ${
                      isCollapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'
                    }`}
                    style={{ maxWidth: isCollapsed ? 0 : 120 }}
                  >
                    {item.label}
                  </motion.span>
                </AnimatePresence>

                {/* Dropdown arrow */}
                {item.children && !isCollapsed && (
                  <motion.div
                    animate={{ rotate: openDropdown === item.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-auto"
                  >
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </motion.div>
                )}

              </motion.button>

              {/* Dropdown children */}
              <AnimatePresence>
                {item.children && openDropdown === item.id && !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 mt-1 space-y-1 overflow-hidden"
                  >
                    {item.children.map((child) => (
                      <motion.button
                        key={child.id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChildClick(child.path);
                        }}
                        className={`group w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                          isActive(child.path)
                            ? 'bg-slate-100 text-slate-800 font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <child.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{child.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
          <motion.button
            whileHover={{ x: isCollapsed ? 2 : 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="group relative w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 overflow-hidden hover:shadow-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200"
            aria-label="Logout"
          >
            <LogOut 
              className="w-6 h-6 flex-shrink-0 transition-all duration-300 text-red-500 group-hover:text-red-600" 
            />
            
            <AnimatePresence mode="wait">
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`font-semibold text-sm transition-all duration-300 whitespace-nowrap overflow-hidden ${
                  isCollapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'
                }`}
                style={{ maxWidth: isCollapsed ? 0 : 160 }}
              >
                Logout
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;

