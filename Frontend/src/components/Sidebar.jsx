import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
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
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const getNavItems = (role, stats = {}) => {
  switch (role) {
case 'lawyer':
      return [
        {
          id: 'overview',
          label: 'Overview',
          icon: Activity,
          path: '/lawyer-dashboard?view=dashboard',
        },
        {
          id: 'cases',
          label: 'My Cases',
          icon: FolderOpen,
          path: '/lawyer-dashboard?view=cases',
        },
        { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/lawyer-dashboard?view=calendar' },

        { id: 'clients', label: 'Clients', icon: Users, path: '/lawyer-dashboard?view=clients' },
      ];
    case 'client':
      return [
        {
          id: 'cases',
          label: 'My Cases',
          icon: FolderOpen,

        },
        { id: 'lawyers', label: 'Find Lawyers', icon: Briefcase, path: '/lawyers' },
        { id: 'payments', label: 'Payments', icon: CreditCard, path: '/payment' },
        { id: 'chatbot', label: 'AI Assistant', icon: MessageSquare, path: '/ai-chatbot' },
      ];
    case 'admin':
      return [
        { id: 'all-lawyers', label: 'Manage Lawyers', icon: Users, path: '/admin-dashboard?tab=lawyers' },
        { id: 'all-clients', label: 'Manage Clients', icon: Users, path: '/admin-dashboard?tab=clients' },

      ];
    default:
      return [];
  }
};

const formatBadgeCount = (count) => {
  if (!count) return null;
  return count > 99 ? '99+' : count;
};

const Sidebar = ({ isCollapsed: externalCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const handleToggle = onToggle || (() => setInternalCollapsed(!internalCollapsed));

  const navItems = useMemo(
    () => getNavItems(user?.role || 'lawyer'),
    [user?.role]
  );

  const [openDropdown, setOpenDropdown] = useState(null);

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

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'lawyer':
        return 'Attorney';
      case 'client':
        return 'Client';
      case 'admin':
        return 'Administrator';
      default:
        return 'User';
    }
  };

  const renderBadge = (count, isActiveItem = false, isPrimary = false) => {
    const formattedCount = formatBadgeCount(count);

    if (!formattedCount || isCollapsed) {
      return null;
    }

    return (
      <span
        className={`ml-auto inline-flex min-w-[1.75rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
          isPrimary
            ? 'bg-white/20 text-white'
            : isActiveItem
              ? 'bg-slate-800 text-white'
              : 'bg-slate-200 text-slate-700'
        }`}
      >
        {formattedCount}
      </span>
    );
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-16 left-0 z-40 flex h-[calc(100vh-4rem)] flex-col border-r border-slate-200 bg-white shadow-xl transition-all duration-300"
      >
        <button
          onClick={handleToggle}
          className="absolute -right-3 top-4 z-10 rounded-full border border-slate-200 bg-white/80 p-2.5 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-lg"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </motion.div>
        </button>

        <div className="border-b border-slate-200 bg-white/100 p-6 backdrop-blur-sm">
          <motion.div
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:bg-slate-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
            style={{ maxWidth: isCollapsed ? 0 : 240 }}
            onClick={() => {
              const rolePath = user?.role ? `/${user.role}-profile` : '/client-profile';
              navigate(rolePath);
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-md">
              {user?.role === 'lawyer' ? (
                <Briefcase className="h-5 w-5" />
              ) : user?.role === 'admin' ? (
                <Shield className="h-5 w-5" />
              ) : (
                getUserInitials()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
              <p className="truncate text-xs text-slate-500">{getRoleDisplay()}</p>
            </div>
          </motion.div>
        </div>

        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-4 pb-4">
          {navItems.map((item) => (
            <div key={item.id}>
              <motion.button
                whileHover={{ x: isCollapsed ? 2 : 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick(item)}
                className={`group relative flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-300 ${
                  item.isButton
                    ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
                    : isActive(item.path)
                      ? 'bg-slate-200 font-medium text-slate-800'
                      : 'text-slate-700'
                }`}
                aria-current={isActive(item.path) ? 'page' : undefined}
                aria-label={item.label}
              >
                <item.icon
                  className={`h-6 w-6 flex-shrink-0 transition-all duration-300 ${
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
                    className={`overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 ${
                      isCollapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'
                    }`}
                    style={{ maxWidth: isCollapsed ? 0 : 120 }}
                  >
                    {item.label}
                  </motion.span>
                </AnimatePresence>

                {renderBadge(item.badge, isActive(item.path), item.isButton)}

                {item.children && !isCollapsed && (
                  <motion.div
                    animate={{ rotate: openDropdown === item.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={item.badge ? '' : 'ml-auto'}
                  >
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </motion.div>
                )}
              </motion.button>

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
                        className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 ${
                          isActive(child.path)
                            ? 'bg-slate-100 font-medium text-slate-800'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <child.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{child.label}</span>
                        {renderBadge(child.badge, isActive(child.path))}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-sm">
          <motion.button
            whileHover={{ x: isCollapsed ? 2 : 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="group relative w-full overflow-hidden rounded-2xl border border-transparent p-4 text-left text-red-600 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:shadow-lg"
            aria-label="Logout"
          >
            <div className="flex items-center gap-4">
              <LogOut className="h-6 w-6 flex-shrink-0 text-red-500 transition-all duration-300 group-hover:text-red-600" />

              <AnimatePresence mode="wait">
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 ${
                    isCollapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'
                  }`}
                  style={{ maxWidth: isCollapsed ? 0 : 160 }}
                >
                  Logout
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
