import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import Register from './Register';
import { useNavigate } from 'react-router-dom';

function Login({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onSuccess) onSuccess();  // <-- וידוא שקוראים רק אם קיימת פונקציה
      alert('התחברת בהצלחה!');
      navigate('/HomePage');
    } catch (error) {
      alert(`שגיאה בהתחברות: ${error.message}`);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('אנא הזן את כתובת האימייל שלך קודם');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('קישור לאיפוס סיסמה נשלח לאימייל שלך');
    } catch (error) {
      alert(`שגיאה: ${error.message}`);
    }
  };

  const handleRegisterClick = () => {
    setIsRegister(true);
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', padding: '1rem' }}>
      {isRegister && <Register setIsRegister={setIsRegister} />}
      {!isRegister && (
        <div>
          <h1>התחברות</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <button type="submit" style={{ width: '100%', marginBottom: '10px' }}>התחבר</button>
          </form>
          <button onClick={handleForgotPassword} style={{ width: '70%', marginBottom: '10px' }}>
            שכחתי סיסמה
          </button>
          <button onClick={handleRegisterClick} style={{ width: '70%' }}>הרשמה</button>
        </div>
      )}
    </div>
  );
}

export default Login;
