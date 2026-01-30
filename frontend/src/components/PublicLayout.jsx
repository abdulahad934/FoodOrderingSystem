import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const PublicLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow-1 mt-5 pt-3">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
