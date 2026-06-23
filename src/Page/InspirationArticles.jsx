import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function ParashaArchive() {
  const [userData, setUserData] = useState({});
  const [parashot, setParashot] = useState([]);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.email));
        if (userDoc.exists()) setUserData(userDoc.data());
        setLoading(false);
      } else {
        navigate('/');
      }
    });

    // שימוש באוסף נפרד בשם 'parasha_archive' כדי לא לערבב עם המאמרים
    const q = query(collection(db, 'parasha_archive'), orderBy('createdAt', 'desc'));
    const unsubscribeParashot = onSnapshot(q, (snapshot) => {
      setParashot(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubscribeAuth(); unsubscribeParashot(); };
  }, [auth, db, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !link) return alert("נא למלא שם וקישור");

    await addDoc(collection(db, 'parasha_archive'), {
      title: name,
      url: link,
      createdAt: serverTimestamp(),
      type: "weekly"
    });

    setName("");
    setLink("");
    alert("הפרשה נוספה לארכיון!");
  };

  if (loading) return <div>טוען...</div>;

  return (
    <Layout userData={userData}>
      <div style={{ padding: '20px', direction: 'rtl' }}>
        <h1 style={{ textAlign: 'center', color: '#2e7d32' }}>ארכיון שבועי - גול על השם</h1>

        {userData.role === 'manager' && (
          <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #c8e6c9' }}>
            <h3>הוספת פרשה חדשה לארכיון</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="שם הפרשה" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input 
                type="text" 
                placeholder="קישור למאמר/קובץ" 
                value={link} 
                onChange={(e) => setLink(e.target.value)} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
              />
              <button type="submit" style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                הוסף לארכיון
              </button>
            </form>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: '20px' 
        }}>
          {parashot.map((item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noreferrer" style={{
              backgroundColor: '#2e7d32', // עיצוב ירוק שונה מהמאמרים
              color: 'white', 
              height: '180px', 
              borderRadius: '12px',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              borderBottom: '5px solid #1b5e20'
            }}>
              <span style={{ fontSize: '14px', marginBottom: '5px' }}>לימוד שבועי</span>
              <strong style={{ fontSize: '24px' }}>{item.title}</strong>
              <div style={{ marginTop: '15px', padding: '5px 15px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '12px' }}>
                לחצי לקריאה {'>'}
              </div>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default ParashaArchive;