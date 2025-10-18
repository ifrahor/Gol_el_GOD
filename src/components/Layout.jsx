import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children, userData }) => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/'));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      {/* סרגל הניווט למעלה */}
      <Navbar
        role={userData?.role}
        onLogout={handleLogout}
        userPhotoURL={auth.currentUser?.photoURL}
        userName={userData?.firstName}
      />

      {/* תוכן הדף מתחת לסרגל */}
      <main style={{ padding: '30px', marginTop: '55px' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
