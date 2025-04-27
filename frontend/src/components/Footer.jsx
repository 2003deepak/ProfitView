import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import themeStore from '../store/themeStore';

const Footer = () => {
  const { theme } = themeStore((state) => state);

  const isDark = theme === 'dark';

  const bgColor = isDark ? 'bg-gray-800' : 'bg-[#f5f7fa]';
  const textColor = isDark ? 'text-white' : 'text-black';
  const sectionTitleColor = isDark ? 'text-white' : 'text-gray-800';
  const mutedTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const hoverTextColor = isDark ? 'hover:text-white' : 'hover:text-black';
  const borderColor = isDark ? 'border-t border-gray-700' : 'border-t border-gray-200';
  const shadowStyle = isDark? 'shadow-[0_-2px_8px_rgba(255,255,255,0.05)]': 'shadow-[0_-4px_12px_rgba(0,0,0,0.05)]';

  return (
    
    <footer className={`${bgColor} ${textColor} ${shadowStyle} border-t ${borderColor} transition-colors duration-300`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <BarChart className="h-8 w-8 text-blue-400 mr-2" />
              <h3 className="text-xl font-bold">Profit View</h3>
            </div>
            <p className={`${mutedTextColor} text-sm mb-4`}>
              Your personal stock trading simulator for learning without financial risk.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`${mutedTextColor} ${hoverTextColor} transition-colors`}>
                <Facebook size={20} />
              </a>
              <a href="#" className={`${mutedTextColor} ${hoverTextColor} transition-colors`}>
                <Twitter size={20} />
              </a>
              <a href="#" className={`${mutedTextColor} ${hoverTextColor} transition-colors`}>
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-semibold ${sectionTitleColor} uppercase tracking-wider mb-4`}>Features</h3>
            <ul className="space-y-2">
              {['Stock Trading', 'Portfolio Tracking', 'Market Analysis', 'Learning Resources'].map((item) => (
                <li key={item}>
                  <a href="#" className={`${mutedTextColor} ${hoverTextColor} text-sm transition-colors`}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-semibold ${sectionTitleColor} uppercase tracking-wider mb-4`}>Resources</h3>
            <ul className="space-y-2">
              {['Blog', 'Trading Guides', 'Tutorials', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href="#" className={`${mutedTextColor} ${hoverTextColor} text-sm transition-colors`}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-semibold ${sectionTitleColor} uppercase tracking-wider mb-4`}>Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className={`${mutedTextColor} ${hoverTextColor} text-sm transition-colors flex items-center`}>
                  <Mail size={16} className="mr-2" />
                  support@profitview.com
                </a>
              </li>
              <li>
                <a href="#" className={`${mutedTextColor} ${hoverTextColor} text-sm transition-colors flex items-center`}>
                  <Phone size={16} className="mr-2" />
                  (123) 456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={`${borderColor} py-6`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className={`text-sm ${mutedTextColor}`}>&copy; 2025 Profit View. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <Link to="#" className={`text-sm ${mutedTextColor} ${hoverTextColor} mr-4 transition-colors`}>Privacy Policy</Link>
            <Link to="#" className={`text-sm ${mutedTextColor} ${hoverTextColor} transition-colors`}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
