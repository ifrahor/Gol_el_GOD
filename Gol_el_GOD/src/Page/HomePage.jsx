import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // כאן משתמשים ב-email כי המסמכים בקולקשן users נשמרים לפי מייל
        const userDocRef = doc(db, 'users', currentUser.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.warn('לא נמצא משתמש במסד הנתונים');
          setUserData({});
        }
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
        navigate('/'); // מפנים לדף ההתחברות אם לא מחוברים
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  if (loading) return <div>טוען...</div>;

  return (
    <Layout userData={userData}>
      <main style={{ padding: '20px' }}>
        {userData.role === 'coach' && <div>תכנים למאמן</div>}
        {userData.role === 'manager' && <div>תכנים למנהל</div>}
        {!userData.role && <div>אין תפקיד מוגדר</div>}
      </main>
    </Layout>
  );
}

export default HomePage;
