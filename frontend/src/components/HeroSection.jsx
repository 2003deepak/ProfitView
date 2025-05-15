import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import themeStore from '../store/themeStore'; // assuming this exists

const HeroSection = () => {
  const { theme } = themeStore();
  const isDark = theme === 'dark';

  // 🌗 Theme-based Colors
  const bgGradient = isDark
    ? 'bg-gradient-to-b from-[#0f172a] to-[#1e293b]'
    : 'bg-gradient-to-b from-blue-800 to-blue-600';

  const textPrimary = isDark ? 'text-white' : 'text-white';
  const textSecondary = isDark ? 'text-slate-300' : 'text-blue-100';
  const highlightText = isDark ? 'text-cyan-300' : 'text-blue-200';
  const cardBg = isDark ? 'bg-[#1e293b]' : 'bg-white';
  const cardTitle = isDark ? 'text-white' : 'text-gray-900';
  const cardSubtitle = isDark ? 'text-gray-400' : 'text-gray-500';

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  const highlightVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.6, duration: 0.8, ease: 'easeOut' },
    },
    blink: {
      textShadow: [
        '0 0 0px rgba(66, 135, 245, 0)',
        '0 0 10px rgba(66, 135, 245, 0.8)',
        '0 0 0px rgba(66, 135, 245, 0)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  return (
    <section
      className={`relative min-h-screen flex items-center overflow-hidden pt-16 transition-colors duration-300 ${bgGradient}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            ref={ref}
            className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.h1
              className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 ${textPrimary}`}
              variants={itemVariants}
            >
              Trade Stocks Risk-Free with Real-Time Data
            </motion.h1>

            <motion.p
              className={`text-xl mb-8 ${textSecondary}`}
              variants={itemVariants}
            >
              Master the markets without risking real money.
            </motion.p>

            <motion.div
              variants={highlightVariants}
              animate={isInView ? ['visible', 'blink'] : 'hidden'}
              className={`text-2xl font-bold mb-8 ${highlightText}`}
            >
              Learn Before You Earn
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="inline-block"
              >
                <Link
                  to="/signup"
                  className={`px-8 py-4 rounded-full font-medium text-lg shadow-lg transition-colors ${
                    isDark
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Start Trading Free
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <div
                className={`rounded-xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300 ${cardBg}`}
              >
                <img
                  src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Trading Dashboard"
                  className="w-full h-auto"
                />
              </div>

              <motion.div
                className={`absolute -bottom-6 -left-6 p-4 rounded-lg shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300 ${cardBg}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${cardTitle}`}>
                      Real-time Trading
                    </p>
                    <p className={`text-xs ${cardSubtitle}`}>
                      Without financial risk
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
