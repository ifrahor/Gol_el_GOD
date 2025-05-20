import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Adjust the path to your firebase config
import { collection, onSnapshot } from "firebase/firestore";

const Attendance = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "attendance"),
      (snapshot) => {
        const attendanceData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(attendanceData);
      },
      (error) => {
        console.error("Error fetching attendance data:", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
      <ul className="space-y-2">
        {records.map(({ id, user, date }) => (
          <li key={id} className="border p-3 rounded shadow-sm">
            <p><strong>User:</strong> {user}</p>
            <p><strong>Date:</strong> {date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Attendance;
