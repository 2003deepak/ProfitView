import React,{useEffect} from 'react'
import themeStore from '../store/themeStore';
import authStore from '../store/authStore';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import CTASection from '../components/CTASection';
import PricingSection from '../components/PricingSection';
import TestimonialSection from '../components/TestimonialSection';
import FAQSection from '../components/FAQSection';

const Landing = () => {

  // Theme Switcher (Got Values from themeStore (Zustand))
  const {theme} = themeStore((state) => state);
  const {isLoggedIn} = authStore((state) => state);


  return (

    <>

        <HeroSection />
        <FeatureSection />
        <PricingSection/>
        <TestimonialSection/>
        <CTASection />
        <FAQSection/>
    
    
    
    </>

       
    
  )
}

export default Landing;