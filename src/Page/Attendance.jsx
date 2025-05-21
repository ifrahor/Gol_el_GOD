import React from 'react';
import Navbar from '../components/Navbar';
import Layout from '../components/Layout';// ודאי שהנתיב נכון

function Attendance() {
  const userRole = 'coach';
  const userName = 'Oralia';
  const userPhotoURL = '';
  return (
    <Layout>

      <Navbar role={userRole} userName={userName} userPhotoURL={userPhotoURL} onLogout={() => { }} />
      <div style={{ padding: '20px', marginTop: '70px' }}>
        <h1>כאן יהיה דו"ח נוכחות של המאמן </h1>
       
      </div>      
    </Layout>
  );
}

export default Attendance;