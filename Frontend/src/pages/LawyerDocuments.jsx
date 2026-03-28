import { motion } from 'framer-motion';
import { FileText, Folder, Download, Search, Upload } from 'lucide-react';

export default function LawyerDocuments() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <FileText className="w-12 h-12 text-slate-600" />
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Documents</h1>
          <p className="text-xl text-slate-600">Manage case files and legal documents</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Folder className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Case Documents</h2>
                <p className="text-slate-600">Organized by case</p>
              </div>
              <button className="ml-auto flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </div>
            <div className="space-y-4">
              {/* Document list */}
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 line-clamp-1">Case Agreement Document {i+1}.pdf</p>
                    <p className="text-sm text-slate-500">Smith v. Johnson - 2.4 MB</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 shadow-xl border border-emerald-200">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-2xl font-bold">
                <span>124</span>
                <span className="text-emerald-700">Total Docs</span>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-3">
                <div className="bg-emerald-600 h-3 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 shadow-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-blue-800">Search Documents</h3>
            </div>
            <input type="text" placeholder="Search by case name..." className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none focus:ring-4 ring-blue-100/50 transition-all shadow-inner" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

