import { motion } from 'framer-motion';

const technologies = [
  { name: 'React.js', icon: '⚛️' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Express', icon: '🚂' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'MySQL', icon: '🐬' },
  { name: 'Razorpay', icon: '💳' },
  { name: 'Firebase', icon: '🔥' },
  { name: 'TypeScript', icon: '📘' },
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Built With Modern Technology
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powered by industry-leading technologies for optimal performance and reliability
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="bg-slate-50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center"
            >
              <div className="text-5xl mb-4">{tech.icon}</div>
              <h3 className="text-lg font-bold text-slate-900">{tech.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
