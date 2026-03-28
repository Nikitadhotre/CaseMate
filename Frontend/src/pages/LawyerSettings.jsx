import { motion } from 'framer-motion';
import { Settings, User, Shield, Bell, CreditCard, Lock, LogOut, Download } from 'lucide-react';

export default function LawyerSettings() {
  return (
    <div className="max-w-4xl space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Settings className="w-12 h-12 text-slate-600" />
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
          <p className="text-xl text-slate-600 mt-1">Manage your account & preferences</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <User className="w-8 h-8 text-slate-600" />
            Profile
          </h2>
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Full Name</label>
              <input type="text" defaultValue="Advocate Jane Doe" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-slate-500 focus:outline-none focus:ring-4 ring-slate-100 transition-all shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Email</label>
              <input type="email" defaultValue="jane.doe@lawfirm.com" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-slate-500 focus:outline-none focus:ring-4 ring-slate-100 transition-all shadow-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Phone</label>
                <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-slate-500 focus:outline-none focus:ring-4 ring-slate-100 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Bar Number</label>
                <input type="text" defaultValue="LAW789012" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-slate-500 focus:outline-none focus:ring-4 ring-slate-100 transition-all shadow-sm" />
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:from-slate-900 hover:to-slate-950 transition-all duration-300">
              Save Profile
            </button>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Bell className="w-8 h-8 text-slate-600" />
            Notifications
          </h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Hearing Reminders</h4>
                <p className="text-sm text-slate-600">Email & SMS 24hrs before hearings</p>
              </div>
              <div className="ml-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Payment Alerts</h4>
                <p className="text-sm text-slate-600">Notify on payment due dates</p>
              </div>
              <div className="ml-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Lock className="w-8 h-8 text-slate-600" />
            Security
          </h2>
          <div className="space-y-6">
            <button className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
              <span className="font-semibold text-slate-900">Change Password</span>
              <Download className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
              <span className="font-semibold text-slate-900">2FA Setup</span>
              <Shield className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
              <span className="font-semibold text-slate-900">Session Management</span>
              <LogOut className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-10 border border-slate-200 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Download className="w-8 h-8 text-slate-600" />
            Data Export
          </h2>
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-200">
              <Download className="w-5 h-5 text-slate-600" />
              <span className="font-semibold text-slate-900">Export All Cases</span>
              <span className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">CSV</span>
            </button>
            <button className="w-full flex items-center gap-3 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-200">
              <Download className="w-5 h-5 text-slate-600" />
              <span className="font-semibold text-slate-900">Export Clients</span>
              <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Excel</span>
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-12 border-t border-slate-200">
        <button className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-12 py-5 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:from-slate-950 hover:to-slate-900 transition-all duration-300">
          Save All Changes
          <Check className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}

