import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from './firebase';

import Login from './Page/Login';
import Register from './Page/Register';
import Attendance from './Page/Attendance';
import Users from './components/Users';
import HomePage from './Page/HomePage';
import AttendanceReport from './Page/AttendanceReport';
import InspirationArticles from './Page/InspirationArticles';
import ParashaArchive from './Page/ParashaArchive';
import MyGroups from './Page/MyGroups';
import InfoUser from './Page/InfoUser';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.email);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const role = data.role || null;
            setUserRole(role);
            setIsAuthenticated(true);
            console.log("User logged in with role (from Firestore):", role);
          } else {
            console.warn("No user document found for", user.email);
            setUserRole(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error getting user role from Firestore:", error);
          setUserRole(null);
          setIsAuthenticated(false);
        } finally {
          setLoadingAuthState(false);
        }
      } else {
        setUserRole(null);
        setIsAuthenticated(false);
        setLoadingAuthState(false);
        console.log("No user logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  if (loadingAuthState) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* דפים ללא Layout */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* הרשאות לפי תפקיד */}
        <Route
          path="/users"
          element={
            isAuthenticated && userRole === "manager" ? (
              <Users />
            ) : (
              <h1>Access Denied</h1>
            )
          }
        />
        <Route
          path="/Attendance"
          element={
            isAuthenticated && userRole === "coach" ? (
              <Attendance />
            ) : (
              <h1>Access Denied</h1>
            )
          }
        />
        <Route
          path="/AttendanceReport"
          element={
            isAuthenticated && userRole === "manager" ? (
              <AttendanceReport />
            ) : (
              <h1>Access Denied</h1>
            )
          }
        />

        {/* זמינים לכל משתמש מחובר */}
        <Route
          path="/HomePage"
          element={isAuthenticated ? <HomePage /> : <h1>Illegal</h1>}
        />
        <Route
          path="/InspirationArticles"
          element={isAuthenticated ? <InspirationArticles /> : <h1>Illegal</h1>}
        />
        <Route
          path="/ParashaArchive"
          element={isAuthenticated ? <ParashaArchive /> : <h1>Illegal</h1>}
        />
        <Route
          path="/MyGroups"
          element={isAuthenticated ? <MyGroups /> : <h1>Illegal</h1>}
        />
        <Route
          path="/InfoUser"
          element={isAuthenticated ? <InfoUser /> : <h1>Illegal</h1>}
        />
      </Routes>
    </Router>
  );
}

export default App;
