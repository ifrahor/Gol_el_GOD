import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Attendence';
import Attendence from './components/Attendence';
import Users from './components/Users';
import { Navigate } from 'react-router-dom';
import './App.css';

function App() {
  const [isAuthenticated,setIsAuthenticated] = useState(false) ;

  return (
    <>
    <Router>
    {isAuthenticated ? <Navigate to="/users" /> : <Navigate to="/"/>}
      <Routes>
       
        <Route path="/" element={<Login onSuccess={()=>setIsAuthenticated(true)} />} />
        <Route path="/register" element={<Register />} />       
        <Route path="/users" element={isAuthenticated? <Users/>: <h1>Illegal</h1>}/>
        <Route path="/attend" element={isAuthenticated?<Attendence/>: <h1>Illegal</h1>}/>
      
      </Routes>
    </Router>

     </>
  );
}

export default App;
