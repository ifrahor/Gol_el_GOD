import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function InspirationArticles() {
  const [userData, setUserData] = useState({});
  const [articles, setArticles] = useState([]);
  const [parashaName, setParashaName] = useState("");
  const [articleLink, setArticleLink] = useState(""); // במקום קובץ - קישור
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

    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubscribeArticles = onSnapshot(q, (snapshot) => {
      setArticles(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubscribeAuth(); unsubscribeArticles(); };
  }, [auth, db, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!parashaName || !articleLink) return alert("נא למלא את כל השדות");

    await addDoc(collection(db, 'articles'), {
      title: parashaName,
      url: articleLink, // הקישור שהמנהל הדביק
      createdAt: serverTimestamp(),
      year: "2026"
    });

    setParashaName("");
    setArticleLink("");
    alert("המאמר נוסף בהצלחה!");
  };

  if (loading) return <div>טוען...</div>;

  return (
    <Layout userData={userData}>
      <div style={{ padding: '20px', direction: 'rtl' }}>
        <h1 style={{ textAlign: 'center' }}> פרשת שבוע</h1>

        {userData.role === 'manager' && (
          <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>הוספת מאמר חדש (קישור)</h3>
            <input 
              type="text" 
              placeholder="שם הפרשה" 
              value={parashaName} 
              onChange={(e) => setParashaName(e.target.value)} 
              style={{ marginLeft: '10px', padding: '5px' }}
            />
            <input 
              type="text" 
              placeholder="הדביקי כאן קישור למאמר (PDF או אתר)" 
              value={articleLink} 
              onChange={(e) => setArticleLink(e.target.value)} 
              style={{ width: '300px', padding: '5px', marginLeft: '10px' }}
            />
            <button type="submit">הוסף לאתר</button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {articles.map((art) => (
            <a key={art.id} href={art.url} target="_blank" rel="noreferrer" style={{
              backgroundColor: '#1a4a7c', color: 'white', height: '180px', borderRadius: '8px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textDecoration: 'none'
            }}>
              <span style={{ fontSize: '12px' }}>פרשת שבוע</span>
              <strong style={{ fontSize: '22px' }}>{art.title}</strong>
              <span>{art.year}</span>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default InspirationArticles;