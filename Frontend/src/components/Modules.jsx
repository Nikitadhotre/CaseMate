import { UserCircle, Briefcase, Eye, CreditCard, Bell, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const modules = [
  {
    icon: UserCircle,
    title: 'Client Login',
    description: 'Secure client portal for case access',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Briefcase,
    title: 'Lawyer Dashboard',
    description: 'Comprehensive lawyer management tools',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Eye,
    title: 'Case Tracking',
    description: 'Real-time case progress monitoring',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: CreditCard,
    title: 'Payment Gateway',
    description: 'Secure online payment processing',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Automated alerts and reminders',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Bot,
    title: 'AI Chatbot',
    description: 'Intelligent legal assistance 24/7',
    color: 'from-cyan-500 to-cyan-600',
  },
];

export default function Modules() {
  return (
    <section id="modules" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Core Modules
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Integrated modules designed to streamline your legal workflow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all h-full">
                <div className={`bg-gradient-to-br ${module.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <module.icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{module.title}</h3>
                <p className="text-slate-600">{module.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
