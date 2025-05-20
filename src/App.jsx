import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  // קורא מהlocalStorage במידה ויש שם את ההתחברות
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // בכל פעם שמשנים את מצב ההתחברות, שומרים בlocalStorage
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* דפים ללא layout */}
        <Route path="/" element={<Login onSuccess={() => setIsAuthenticated(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={isAuthenticated ? <Users /> : <h1>Illegal</h1>} />
        <Route path="/Attendance" element={isAuthenticated ? <Attendance /> : <h1>Illegal</h1>} />
        <Route path="/HomePage" element={isAuthenticated ? <HomePage /> : <h1>Illegal</h1>} />
        <Route path="/InspirationArticles" element={isAuthenticated ? <InspirationArticles /> : <h1>Illegal</h1>} />
        <Route path="/ParashaArchive" element={isAuthenticated ? <ParashaArchive /> : <h1>Illegal</h1>} />
        <Route path="/MyGroups" element={isAuthenticated ? <MyGroups /> : <h1>Illegal</h1>} />
        <Route path="/AttendanceReport" element={isAuthenticated ? <AttendanceReport /> : <h1>Illegal</h1>} />
        <Route path="/InfoUser" element={isAuthenticated ? <InfoUser /> : <h1>Illegal</h1>} />
        
      </Routes>
    </Router>
  );
}

export default App;
