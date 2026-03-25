import { Search, FolderOpen, BarChart3, Bot, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Search,
    title: 'Client–Lawyer Platform',
    description: 'Connect clients with experienced lawyers through our intelligent matching system.',
  },
  {
    icon: FolderOpen,
    title: 'Case Management with Reminders',
    description: 'Organize cases efficiently with automated reminders for hearings and deadlines.',
  },
  {
    icon: BarChart3,
    title: 'Case Tracking & Payments',
    description: 'Track case progress in real-time and manage secure payments seamlessly.',
  },
  {
    icon: Bot,
    title: 'AI Legal Chatbot',
    description: 'Get instant legal guidance and answers powered by advanced AI technology.',
  },
  {
    icon: Zap,
    title: 'Efficiency & Transparency',
    description: 'Streamline workflows and maintain complete transparency throughout the legal process.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to manage legal cases efficiently and effectively
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
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
  );
}
