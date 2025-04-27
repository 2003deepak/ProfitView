import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { LineChart, Activity, Shield, BookOpen } from 'lucide-react';
import themeStore from '../store/themeStore';

const FeatureCard = ({ icon, title, description, delay, isDark }) => {
  return (
    <motion.div
      className={`p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${
          isDark ? 'bg-blue-900' : 'bg-blue-100'
        }`}
      >
        {icon}
      </div>
      <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h3>
      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
    </motion.div>
  );
};

const FeatureSection = () => {
  const { theme } = themeStore();
  const isDark = theme === 'dark';

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Why Choose Profit View?
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            The perfect platform for learning to trade without risking your capital.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<LineChart className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />}
            title="Real-time Stock Data"
            description="Access up-to-the-minute market data to make informed trading decisions."
            delay={0.1}
            isDark={isDark}
          />
          <FeatureCard
            icon={<Shield className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />}
            title="Zero-Risk Paper Trading"
            description="Practice trading with virtual money before risking your real capital."
            delay={0.2}
            isDark={isDark}
          />
          <FeatureCard
            icon={<Activity className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />}
            title="Track Your Portfolio"
            description="Monitor your performance with detailed analytics and reports."
            delay={0.3}
            isDark={isDark}
          />
          <FeatureCard
            icon={<BookOpen className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />}
            title="Learn Market Strategies"
            description="Access educational resources to help you become a better trader."
            delay={0.4}
            isDark={isDark}
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
