import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Adjust path as needed
import { collection, onSnapshot } from "firebase/firestore";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <ul className="space-y-2">
        {users.map(({ id, name, email }) => (
          <li key={id} className="border p-3 rounded shadow-sm">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
