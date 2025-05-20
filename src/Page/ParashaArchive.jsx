import React from 'react';
import Navbar from '../components/Navbar';
import Layout from '../components/Layout';

function ParashaArchive() {
  const userRole = 'manager';
  const userName = 'Oralia';
  const userPhotoURL = '';

  return (
    <Layout>
      <Navbar role={userRole} userName={userName} userPhotoURL={userPhotoURL} onLogout={() => {}} />
      <div style={{ padding: '20px', marginTop: '70px' }}>
        <h1>פרשת שבוע - Parasha Archive</h1>
        <p>כאן התוכן של ארכיון פרשת השבוע</p>
      </div>
    </Layout>
  );
}

export default ParashaArchive;
