import React from 'react';
import Layout from '../components/Layout'; // ודאי שהנתיב נכון

function InfoUser() {
  
  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">פרופיל משתמש</h2>
        <p>כאן יופיעו פרטי המשתמש שלך.</p>
      </div>
    </Layout>
  );
}

export default InfoUser;
