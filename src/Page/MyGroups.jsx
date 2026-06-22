import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function MyGroups() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [fileName, setFileName] = useState(''); // שומר את שם הקובץ שנבחר
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

  // פונקציה שמטפלת בבחירת הקובץ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      console.log("הקובץ נבחר בהצלחה:", file.name);
      // כאן בהמשך, אם תרצו, נוכל להוסיף את הקוד שמעלה את הקובץ ל-Firebase Storage
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>טוען...</div>;

  return (
    <Layout userData={userData}>
      <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        
        {/* ממשק למאמן בלבד */}
        {userData.role === 'coach' && (
          <div style={{ backgroundColor: '#f0f7ff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#1e3a8a', fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}>רשימת התלמידים</h2>
      
            {/* כפתור/אזור העלאה */}
            <label style={{
              display: 'flex',
              flexDirection: 'col',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: '120px',
              border: '2px dashed #3b82f6',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              padding: '20px',
              boxSizing: 'border-box',
              transition: 'background-color 0.2s'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* אייקון פשוט של ענן/העלאה */}
                <svg style={{ width: '36px', height: '36px', color: '#3b82f6', marginBottom: '10px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  {fileName ? `קובץ שנבחר: ${fileName}` : 'לחץ לבחירת קובץ PDF'}
                </span>
                {!fileName && <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>PDF בלבד</span>}
              </div>
              <input 
                type="file" 
                accept=".pdf" 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
              />
            </label>
          </div>
        )}

        {/* הודעת שגיאה למנהל */}
        {userData.role === 'manager' && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '20px', borderRadius: '8px', border: '1px solid #fca5a5' }}>
            אין גישה למנהל. אם הגעת לדף הזה כאשר אתה מנהל, צריך לתקן את הקוד למנהל.
          </div>
        )}
        
      </div>
    </Layout>
  );
}

export default MyGroups;