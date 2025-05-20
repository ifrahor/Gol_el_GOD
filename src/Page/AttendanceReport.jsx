import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const AttendanceReport = () => {

  return (
     <Layout userData={userData}>
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Attendance Report</h1>
      <p>This is the page where you will generate and view attendance reports.</p>
    </div>
    </Layout>
  );
};

export default AttendanceReport;
