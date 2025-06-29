import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Your Firebase config
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function Register({ setIsRegister }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, telephone, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // 1. Create user in Authentication
      await createUserWithEmailAndPassword(auth, email, password);

      // 2. Create user document in Firestore עם השדה role ושמירה לפי מייל
      await setDoc(doc(db, 'users', email), {
        firstName,
        lastName,
        telephone,
        email,
        role: 'coach', // ברירת מחדל - מאמן
      });

      setIsRegister(false);
      alert('Registration successful!');

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        telephone: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      alert(`Registration failed: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          name="telephone"
          type="text"
          placeholder="Telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button type="submit" style={{ width: '100%' }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
