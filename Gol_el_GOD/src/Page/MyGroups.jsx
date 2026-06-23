import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function MyGroups() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [fileName, setFileName] = useState(''); 
  const [uploading, setUploading] = useState(false); 
  const [fileUrl, setFileUrl] = useState(''); 
  
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
          const data = userDocSnap.data();
          setUserData(data);
          
          if (data.studentListUrl) {
            setFileUrl(data.studentListUrl);
          }
          if (data.studentListName) {
            setFileName(data.studentListName);
          }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setFileName(file.name);
    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file); 
    
    reader.onload = async () => {
      try {
        const base64Url = reader.result;
        
        const userDocRef = doc(db, 'users', user.email);
        await updateDoc(userDocRef, {
          studentListUrl: base64Url,
          studentListName: file.name
        });

        setFileUrl(base64Url);
        console.log("הקובץ נשמר בהצלחה בבסיס הנתונים!");
      } catch (error) {
        console.error("Error saving file to Firestore:", error);
        alert("השמירה נכשלה, ודאי שחוקי הגישה ב-Firestore פתוחים.");
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("שגיאה בקריאת הקובץ מהמחשב");
      setUploading(false);
    };
  };

  const handleRemoveFile = async () => {
    if (!user) return;

    const confirmDelete = window.confirm("האם אתה בטוח שברצונך למחוק את קובץ רשימת התלמידים?");
    if (!confirmDelete) return;

    setUploading(true);

    try {
      const userDocRef = doc(db, 'users', user.email);
      await updateDoc(userDocRef, {
        studentListUrl: null,
        studentListName: null
      });

      setFileUrl('');
      setFileName('');
      alert("הקובץ הוסר בהצלחה!");
    } catch (error) {
      console.error("Error deleting file from Firestore:", error);
      alert("מחיקת הקובץ נכשלה.");
    } finally {
      setUploading(false);
    }
  };

  // פונקציה חדשה שעוקפת את חסימת האבטחה של הדפדפן ומציגה את ה-Base64 PDF
  const handleOpenFile = () => {
    if (!fileUrl) return;
    
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe src="${fileUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
      newWindow.document.title = fileName || "רשימת תלמידים";
    } else {
      alert("הדפדפן חסם את פתיחת החלון. אנא אפשרי פופ-אפים באתר זה.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>טוען...</div>;

  return (
    <Layout userData={userData}>
      <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        
        {userData.role === 'coach' && (
          <div style={{ backgroundColor: '#f0f7ff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#1e3a8a', fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>רשימת התלמידים</h2>
      
            {!fileUrl && !uploading && (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: '120px',
                border: '2px dashed #3b82f6',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                padding: '20px',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg style={{ width: '36px', height: '36px', color: '#3b82f6', marginBottom: '10px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>לחץ לבחירת קובץ PDF</span>
                </div>
                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>
            )}

            {uploading && <p style={{ color: '#2563eb', fontSize: '14px', marginTop: '15px' }}>מבצע פעולה, אנא המתיני...</p>}

            {fileUrl && !uploading && (
              <div style={{ marginTop: '10px', padding: '15px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <p style={{ color: '#374151', fontSize: '14px', marginBottom: '12px', fontWeight: '500', wordBreak: 'break-all' }}>
                  📄 {fileName}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                  {/* הכפתור עודכן ל-button שמפעיל את הפונקציה החדשה */}
                  <button 
                    onClick={handleOpenFile}
                    style={{ backgroundColor: '#22c55e', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                  >
                    פתיחת קובץ
                  </button>
                  <button 
                    onClick={handleRemoveFile}
                    style={{ backgroundColor: '#ef4444', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                  >
                    הסרת קובץ
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

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