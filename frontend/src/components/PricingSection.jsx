import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import themeStore from "../store/themeStore";

export default function PricingSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { theme } = themeStore();
  const isDark = theme === 'dark';

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for beginners to learn the basics",
      features: [
        "Real-time market data (15-min delay)",
        "Basic paper trading",
        "Limited portfolio tracking",
        "Access to basic learning resources",
        "1 virtual portfolio",
      ],
      cta: "Get started",
      ctaLink: "/signup",
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For serious traders looking to improve",
      features: [
        "Real-time market data (no delay)",
        "Advanced paper trading tools",
        "Detailed portfolio analytics",
        "Full access to learning resources",
        "Multiple virtual portfolios",
        "Strategy backtesting",
        "Email support",
      ],
      cta: "Start 7-day free trial",
      ctaLink: "/signup",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration features",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "Priority support",
        "Training sessions",
      ],
      cta: "Contact sales",
      ctaLink: "#contact",
    },
  ];

  return (
    <section id="pricing" className={`py-20 px-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}
          >
            Start for free, upgrade as you grow. No hidden fees or surprises.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isHovered = hoveredIndex === index;
            const bgColor = isHovered ? 'bg-blue-600 text-white border-2 border-blue-600' : isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-gray-100 text-gray-900 border border-gray-200';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl p-8 transition-all duration-500 relative ${bgColor}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {isHovered && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-bold">{plan.name}</h3>

                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm ml-1 opacity-80">/{plan.period}</span>
                </div>

                <p className={`mb-6 ${isHovered ? 'opacity-80' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check
                        className={`h-5 w-5 mr-2 flex-shrink-0 ${isHovered ? 'text-white' : 'text-blue-600'}`}
                      />
                      <span className={`${isHovered ? 'text-white/90' : ''}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.ctaLink}
                  className={`block w-full py-2 px-4 rounded-lg text-center font-medium transition-colors ${
                    isHovered
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>All plans include a 30-day money-back guarantee</p>
        </div>
      </div>
    </section>
  );
}
