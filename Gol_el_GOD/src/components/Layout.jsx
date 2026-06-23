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
    // הוספת סגנונות רוחב מלא כדי לשבור את הגבול הדפוק בכל הדפדפנים
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f0f8ff', 
      minHeight: '100vh',
      width: '100vw',
      maxWidth: '100%',
      display: 'block' 
    }}>
      {/* סרגל הניווט למעלה */}
      <Navbar
        role={userData?.role}
        onLogout={handleLogout}
        userPhotoURL={auth.currentUser?.photoURL}
        userName={userData?.firstName}
      />

      {/* תוכן הדף מתחת לסרגל - משוחרר לרוחב מלא ומיושר לימין בדיוק */}
      <main style={{ 
        padding: '30px', 
        marginTop: '55px', 
        width: '100%', 
        boxSizing: 'border-box',
        display: 'block'
      }}>
        {/* העטיפה הזו דואגת שהתוכן הפנימי ייפתח לרוחב מקסימלי (max-w-6xl) ולא יימחץ באמצע */}
        <div className="w-full max-w-6xl mx-auto" style={{ width: '100%', maxWidth: '1200px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;