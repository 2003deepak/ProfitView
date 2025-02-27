import React,{useEffect} from 'react'
import themeStore from '../store/themeStore';
import authStore from '../store/authStore';

const Landing = () => {

  // Theme Switcher (Got Values from themeStore (Zustand))
  const {theme} = themeStore((state) => state);
  const {isLoggedIn} = authStore((state) => state);


  return (
    <div className={`w-full h-[80vh] flex justify-center items-center ${
        theme === 'dark'
          ? 'bg-[#121212] border-gray-600 text-white'
          : 'bg-white border-gray-200 text-black'
      }`}>
        
        
     <h1 className={`text-4xl font-bold ${
        theme === 'dark' ? 'text-gray-400 hover:text-[#6a4dfa]' : 'text-gray-600 hover:text-[#6a4dfa]'
        }`}>
        Welcome to ProfitView {isLoggedIn ? "True" : "False"}
        </h1>

    </div>
  )
}

export default Landing;