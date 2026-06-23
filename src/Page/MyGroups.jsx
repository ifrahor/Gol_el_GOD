import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function MyGroups() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [uploading, setUploading] = useState(false); 
  
  // שינוי הסטייט למערך שמכיל את כל קבוצות המאמן
  const [savedFiles, setSavedFiles] = useState([]); 
  
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
          
          // טעינת מערך הקבצים מה-DB במידה והוא קיים, אחרת מערך ריק
          if (data.studentLists && Array.isArray(data.studentLists)) {
            setSavedFiles(data.studentLists);
          } else if (data.studentListUrl) {
            // תמיכת לאחור: אם היה קובץ ישן בודד, נכניס אותו כמערך
            setSavedFiles([{ url: data.studentListUrl, name: data.studentListName || 'קבוצה ללא שם' }]);
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

  // פונקציית העלאה שמוסיפה קובץ חדש למערך בתוך ה-Firestore
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file); 
    
    reader.onload = async () => {
      try {
        const base64Url = reader.result;
        const newFileObject = {
          url: base64Url,
          name: file.name,
          uploadedAt: new Date().toISOString() // הוספת תאריך כדי שנוכל להבדיל ביניהם
        };

        const userDocRef = doc(db, 'users', user.email);
        
        // יצירת המערך המעודכן
        const updatedFiles = [...savedFiles, newFileObject];

        // עדכון בסיס הנתונים עם המערך החדש
        await updateDoc(userDocRef, {
          studentLists: updatedFiles
        });

        setSavedFiles(updatedFiles);
        console.log("הקובץ נוסף בהצלחה למערך הקבוצות!");
      } catch (error) {
        console.error("Error saving file to Firestore:", error);
        alert("השמירה נכשלה, ודאי שחוקי הגישה ב-Firestore פתוחים.");
      } finally {
        setUploading(false);
        e.target.value = ''; // איפוס ה-input כדי שיהיה אפשר להעלות את אותו הקובץ שוב אם נרצה
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("שגיאה בקריאת הקובץ מהמחשב");
      setUploading(false);
    };
  };

  // פונקציית מחיקה שמסירה קובץ ספציפי מהמערך לפי ה-URL שלו
  const handleRemoveFile = async (fileToRemove) => {
    if (!user) return;

    const confirmDelete = window.confirm(`האם אתה בטוח שברצונך למחוק את הקובץ: ${fileToRemove.name}?`);
    if (!confirmDelete) return;

    setUploading(true);

    try {
      // סינון הקובץ שרוצים למחוק מתוך המערך המקומי
      const updatedFiles = savedFiles.filter(file => file.url !== fileToRemove.url);

      const userDocRef = doc(db, 'users', user.email);
      // עדכון ה-DB עם המערך המקוצר
      await updateDoc(userDocRef, {
        studentLists: updatedFiles
      });

      setSavedFiles(updatedFiles);
      alert("הקובץ הוסר בהצלחה!");
    } catch (error) {
      console.error("Error deleting file from Firestore:", error);
      alert("מחיקת הקובץ נכשלה.");
    } finally {
      setUploading(false);
    }
  };

  // פונקציית הפתיחה המאובטחת שעובדת על קובץ ספציפי שנבחר
  const handleOpenFile = (file) => {
    if (!file || !file.url) return;
    
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe src="${file.url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
      newWindow.document.title = file.name || "רשימת תלמידים";
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
            <h2 style={{ color: '#1e3a8a', fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>רשימת התלמידים של הקבוצות שלי</h2>
      
            {/* כפתור ההעלאה תמיד גלוי, כדי שיהיה אפשר להוסיף עוד ועוד קבוצות */}
            {!uploading && (
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
                boxSizing: 'border-box',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg style={{ width: '36px', height: '36px', color: '#3b82f6', marginBottom: '10px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>לחצי להוספת קובץ PDF של קבוצה נוספת</span>
                </div>
                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>
            )}

            {uploading && <p style={{ color: '#2563eb', fontSize: '14px', marginTop: '15px', marginBottom: '15px' }}>מבצע פעולה, אנא המתיני...</p>}

            {/* לולאת Map שמציגה את כל הקבצים שהועלו אחד מתחת לשני */}
            {savedFiles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {savedFiles.map((file, index) => (
                  <div key={index} style={{ padding: '15px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'right' }}>
                    <p style={{ color: '#374151', fontSize: '14px', marginBottom: '12px', fontWeight: '500', wordBreak: 'break-all' }}>
                      📄 {file.name}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                      <button 
                        onClick={() => handleOpenFile(file)}
                        style={{ backgroundColor: '#22c55e', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                      >
                        פתיחת קובץ
                      </button>
                      <button 
                        onClick={() => handleRemoveFile(file)}
                        style={{ backgroundColor: '#ef4444', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                      >
                        הסרת קובץ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {savedFiles.length === 0 && !uploading && (
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '10px' }}>טרם הועלו קבצי קבוצות.</p>
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