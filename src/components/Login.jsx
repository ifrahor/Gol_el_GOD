import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Register from './Register';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false) ;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('התחברת בהצלחה!');
    } catch (error) {
      alert(`שגיאה בהתחברות: ${error.message}`);
    }
  };

  const handleRegisterClick= () => {
    setIsRegister(true) ;
  }

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', padding: '1rem' }}>
   
    { isRegister && <Register setIsRegister={setIsRegister}/>}
    { !isRegister &&
    <div>
     <h1>התחברות</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>
        <button type="submit" style={{ width: '100%' }}>התחבר</button>
      </form>
      <button onClick={handleRegisterClick}>Register</button>
    </div>
}
</div>
  )
}

export default Login;
