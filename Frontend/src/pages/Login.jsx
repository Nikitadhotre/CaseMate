import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  Shield,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const roles = [
  { id: 'client', name: 'Client', icon: User, description: 'Access your case dashboard' },
  { id: 'lawyer', name: 'Lawyer', icon: Briefcase, description: 'Manage your practice' },
  { id: 'admin', name: 'Admin', icon: Shield, description: 'System administration' },
];

export default function Login() {
  const [activeRole, setActiveRole] = useState('client');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;

      if (isLogin) {
        result = await login(formData.email, formData.password, activeRole);
      } else {
        result = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone,
          activeRole
        );
      }

      if (result.success) {
        const loggedInUser = result.user;

        const roleRoutes = {
          admin: '/admin-dashboard',
          lawyer: '/lawyer-dashboard',
          client: '/client-dashboard',
        };

        const finalRole = loggedInUser?.role || activeRole;
        const finalRoute = roleRoutes[finalRole] || '/';

        console.log('Login/Register success user:', loggedInUser);
        console.log('Redirecting to:', finalRoute);

        navigate(finalRoute, { replace: true });
      } else {
        setError(result.message || `${isLogin ? 'Login' : 'Registration'} failed`);
      }
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Registration'} error:`, error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const activeRoleData = roles.find((role) => role.id === activeRole);

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to your CaseMate account</p>
          </div>

          <div className="flex mb-8 bg-slate-100 rounded-lg p-1">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRole(role.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                  activeRole === role.id
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <role.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{role.name}</span>
              </button>
            ))}
          </div>

          <motion.div
            key={activeRole}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-6"
          >
            <p className="text-slate-600 text-sm">{activeRoleData.description}</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Sign Up'} as {activeRoleData.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '', phone: '' });
              }}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}