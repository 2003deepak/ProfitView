import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import themeStore from '../store/themeStore';

const CTASection = () => {
  const { theme } = themeStore();
  const isDark = theme === 'dark';

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: isDark
        ? "0px 5px 15px rgba(255, 255, 255, 0.2)"
        : "0px 5px 15px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
    bounce: {
      y: [0, -10, 0],
      transition: {
        delay: 1,
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 5,
      },
    },
  };

  return (
    <section className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Build your trading skills today – no risks attached.
        </motion.h2>

        <motion.p
          className={`text-lg mb-8 max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Join thousands of traders who are developing their skills with real market data and zero financial risk.
        </motion.p>

        <motion.div
          initial="initial"
          // whileHover="hover"
          whileTap="tap"
          animate="bounce"
          variants={buttonVariants}
        >
          <Link
            to="/signup"
            className={`inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full transition 
              ${isDark
                ? 'text-gray-900 bg-white hover:bg-gray-100'
                : 'text-white bg-blue-600 hover:bg-blue-700'
              }`}
          >
            Create Free Account
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
