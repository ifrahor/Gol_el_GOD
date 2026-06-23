import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function InfoUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.warn('לא נמצא משתמש במסד הנתונים');
          setUserData(null);
        }
        setLoading(false);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, db, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) return <div>טוען פרופיל...</div>;


  return (
    <Layout userData={userData}>
      <main style={{ maxWidth: '600px', margin: 'auto', padding: '20px', textAlign: 'right', fontFamily: 'Arial, sans-serif' }}>
        <h1>פרופיל משתמש</h1>
        <div style={{ marginBottom: '15px' }}>
          <strong>  שם פרטי:</strong> {userData.firstName || 'לא זמין'}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>שם משפחה:</strong> {userData.lastName || 'לא זמין'}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>אימייל:</strong> {user.email}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>תפקיד:</strong> {userData.role || 'לא מוגדר'}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>טלפון:</strong> {userData.telephone || 'לא זמין'}
        </div>
       
      </main>
    </Layout>
  );
}

export default InfoUser;
