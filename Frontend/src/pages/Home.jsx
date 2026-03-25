import { ArrowRight, Scale, Gavel, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="pt-16">
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
                CaseMate – A Unified Legal Case Management System
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Search lawyers, track cases, get reminders, and access AI-powered legal guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/lawyers">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                  >
                    <Users className="w-5 h-5" />
                    <span>Find Lawyers</span>
                  </motion.button>
                </Link>
                <Link to="/client-dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-slate-800 text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 hover:text-white transition-all w-full sm:w-auto"
                  >
                    Login
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center items-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-12 shadow-2xl"
                >
                  <Scale className="w-40 h-40 text-white" strokeWidth={1.5} />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl"
                >
                  <Gavel className="w-20 h-20 text-slate-700" strokeWidth={1.5} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose CaseMate?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage legal cases efficiently and effectively
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Find Expert Lawyers',
                description: 'Search and connect with specialized lawyers for your legal needs',
                icon: Users,
              },
              {
                title: 'Track Your Cases',
                description: 'Monitor case progress with real-time updates and timeline tracking',
                icon: Scale,
              },
              {
                title: 'AI Legal Assistant',
                description: 'Get instant answers to legal questions with our AI chatbot',
                icon: Gavel,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-slate-50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all"
              >
                <div className="bg-slate-800 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
