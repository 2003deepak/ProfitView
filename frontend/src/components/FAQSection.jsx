import React from "react";
import { motion } from "framer-motion";
import themeStore from "../store/themeStore"; // adjust if needed

const FAQSection = () => {
  const { theme } = themeStore();
  const isDark = theme === 'dark';

  // 🎨 Theme-based styles
  const sectionBg = isDark ? "bg-[#0f172a]" : "bg-white";
  const cardBg = isDark ? "bg-[#1e293b]" : "bg-gray-50";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-600";
  const badgeBg = isDark ? "bg-cyan-900 text-cyan-200" : "bg-blue-100 text-blue-600";
  const cardTitle = isDark ? "text-white" : "text-gray-900";
  const cardAnswer = isDark ? "text-gray-400" : "text-gray-700";

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const faqs = [
    {
      question: "Is Profit View completely free to use?",
      answer:
        "Yes, our basic plan is completely free to use. You can access real-time market data, paper trading, and basic portfolio tracking without paying anything. We also offer premium plans with advanced features for more serious traders.",
    },
    {
      question: "How accurate is your market data?",
      answer:
        "We provide real-time market data with minimal delay. Our data is sourced from reliable providers to ensure accuracy and timeliness, giving you a realistic trading experience.",
    },
    {
      question: "Can I use Profit View on mobile devices?",
      answer:
        "Yes, Profit View is fully responsive and works on all devices including smartphones and tablets. We also have dedicated mobile apps for iOS and Android for an optimized mobile experience.",
    },
    {
      question: "How do I transition from paper trading to real trading?",
      answer:
        "While Profit View focuses on paper trading, we provide educational resources and guidance on how to transition to real trading. We also have partnerships with several brokers to make the transition seamless.",
    },
  ];

  return (
    <section className={`py-16 md:py-24 transition-colors duration-300 ${sectionBg}`}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${badgeBg}`}>
            FAQ
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textPrimary}`}>
            Frequently Asked Questions
          </h2>
          <p className={`text-lg ${textSecondary}`}>
            Find answers to common questions about Profit View.
          </p>
        </motion.div>

        {/* FAQ Cards */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`rounded-lg p-6 shadow-md transition-colors duration-300 ${cardBg}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <h3 className={`text-lg font-bold mb-3 ${cardTitle}`}>
                {faq.question}
              </h3>
              <p className={`${cardAnswer}`}>{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
