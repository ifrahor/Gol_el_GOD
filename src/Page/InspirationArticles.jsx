import React from 'react';
import Navbar from '../components/Navbar';
import Layout from '../components/Layout';

function InspirationArticles() {
  // אפשר להעביר תפקיד ומשתמש לדוגמה ל־Navbar
  const userRole = 'manager';  // או 'coach' בהתאם למשתמש
  const userName = 'Oralia';
  const userPhotoURL = ''; // קישור לתמונה אם יש

  return (
    <Layout>
      <Navbar role={userRole} userName={userName} userPhotoURL={userPhotoURL} onLogout={() => {/* הוספת לוגיקה להתנתקות */}} />
      <div style={{ padding: '20px', marginTop: '70px' }}>
        <h1>Inspiration Articles</h1>
        <p>כאן התוכן של המאמרים</p>
      </div>
    </Layout>
  );
}

export default InspirationArticles;
