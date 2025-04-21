import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <div>
      <Header />
      <Outlet /> {/* This is where your public route content will appear */}
      <Footer />
    </div>
  );
};

export default PublicLayout;