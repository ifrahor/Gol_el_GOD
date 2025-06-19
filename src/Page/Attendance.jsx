import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function MyGroups() {
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

        const userDocRef = doc(db, 'users', currentUser.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.warn('לא נמצא משתמש במסד הנתונים');
        }
        setLoading(false);
      } else {
        if (!loading) {
          navigate('/');
        }
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate, loading]);

  if (loading) return <div>טוען...</div>;

  return (
    <Layout userData={userData}>
      <h1>כאן יהיה מילוי דוח הנוכחות של המאמנים </h1>
      {userData.role === 'coach' && <div>כאן המאמן יוכל למלות פרטי דוחות נוכחות   למאמן</div>}
      {userData.role === 'manager' && <div>אסור גישה  למנהל אם הוא הגיע לפו אז צריך לתקן את הקוד</div>}
    </Layout>
  );
}

export default MyGroups;
