import React from 'react';
import Layout from '../components/Layout'; // או הנתיב הנכון אל Layout

function MyGroups() {
  const userRole = 'manager';
  const userName = 'Oralia';
  const userPhotoURL = '';

  return (
    <Layout>
       <Navbar role={userRole} userName={userName} userPhotoURL={userPhotoURL} onLogout={() => {/* הוספת לוגיקה להתנתקות */}} />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">הקבוצות שלי</h2>
        <p>כאן יופיעו כל הקבוצות שלך בעתיד.</p>
      </div>
    </Layout>
  );
}

export default MyGroups;
