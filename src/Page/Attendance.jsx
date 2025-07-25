import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Play, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";

import ActiveLessonModal from "../components/ActiveLessonModal";
import LessonsList from "../components/LessonsList";
import MonthlyStats from "../components/MonthlyStats";
import Layout from "../components/Layout";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Attendance() {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [lessonStartTime, setLessonStartTime] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.email);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userDataFromDb = userSnapshot.data();

            setCurrentUser({
              ...user,
              ...userDataFromDb,
            });
          } else {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadLessons();
    }
  }, [currentUser, currentMonth]);

  const loadLessons = async () => {
    setIsLoading(true);
    try {
      const monthStart = Timestamp.fromDate(startOfMonth(currentMonth));
      const monthEnd = Timestamp.fromDate(endOfMonth(currentMonth));

      const q = query(
        collection(db, "attendanceReports"),
        where("trainer_email", "==", currentUser.email),
        where("date", ">=", monthStart),
        where("date", "<=", monthEnd)
      );

      const querySnapshot = await getDocs(q);
      const lessonsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        let totalWorkTime = "";
        if (data.start_time && data.end_time && data.start_time.toDate && data.end_time.toDate) {
          const startDate = data.start_time.toDate();
          const endDate = data.end_time.toDate();
          const durationMs = endDate - startDate;
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
          totalWorkTime = `${hours}h ${minutes}m`;
        }

        return {
          id: doc.id,
          ...data,
          total_work_time: totalWorkTime,
        };
      });

      setLessons(lessonsData);
    } catch (error) {
      console.error("Error loading lessons:", error);
      setLessons([]);
    }
    setIsLoading(false);
  };

  const startLesson = () => {
    setLessonStartTime(new Date());
    setIsLessonActive(true);
  };

  const finishLesson = async () => {
    if (!lessonStartTime || !currentUser) return;

    const endTime = new Date();

    const lessonData = {
      date: Timestamp.fromDate(lessonStartTime),
      start_time: Timestamp.fromDate(lessonStartTime),
      end_time: Timestamp.fromDate(endTime),
      trainer_email: currentUser.email,
    };

    try {
      await addDoc(collection(db, "attendanceReports"), lessonData);
    } catch (err) {
      console.error("Error saving lesson:", err);
    }

    setIsLessonActive(false);
    setLessonStartTime(null);
    loadLessons();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  if (currentUser === null) {
    return <div>Loading ...</div>;
  }

  return (
    <Layout userData={currentUser}>
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f9fafb 0%, #dbeafe 50%, #e0e7ff 100%)",
          padding: 24,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 1024, width: "100%" }}>
          {/* כותרת ו-Welcome אחד מתחת לשני */}
          <div style={{ marginBottom: 8 }}>
            <h1
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: "#111827",
                margin: 0,
              }}
            >
              Trainer Attendance
            </h1>
            <p
              style={{
                fontSize: 20,
                color: "#4b5563",
                marginTop: 8,
                marginBottom: 24,
              }}
            >
              Welcome back, {currentUser?.firstName || currentUser?.displayName || "Trainer"}
            </p>
          </div>

          {/* כפתור התחל שיעור */}
          <div style={{ marginBottom: 48 }}>
            <button
              onClick={startLesson}
              disabled={isLessonActive}
              style={{
                background: "linear-gradient(90deg, #2563eb, #4f46e5)",
                color: "white",
                padding: "18px 48px",
                borderRadius: 30,
                fontWeight: "bold",
                fontSize: 20,
                border: "none",
                cursor: isLessonActive ? "not-allowed" : "pointer",
                opacity: isLessonActive ? 0.5 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                boxShadow: "0 10px 20px rgba(59, 130, 246, 0.5)",
                transition: "all 0.3s ease",
              }}
            >
              <Play size={32} />
              {isLessonActive ? "Lesson in Progress..." : "Start Lesson"}
            </button>
          </div>

          {/* Month Navigation */}
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: 16,
              padding: 16,
              marginBottom: 32,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#111827",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Calendar size={28} color="#4f46e5" />
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={goToPreviousMonth}
                style={navButtonStyle}
                aria-label="Previous Month"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToCurrentMonth}
                style={{
                  ...navButtonStyle,
                  fontWeight: "600",
                  padding: "6px 16px",
                  minWidth: 130,
                }}
              >
                Today
              </button>
              <button
                onClick={goToNextMonth}
                style={navButtonStyle}
                aria-label="Next Month"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Monthly Stats */}
          <MonthlyStats
            lessons={lessons}
            currentMonth={format(currentMonth, "MMMM yyyy")}
          />

          {/* Lessons List */}
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 16,
                color: "#111827",
              }}
            >
              Lessons for {format(currentMonth, "MMMM yyyy")}
            </h2>
            <LessonsList lessons={lessons} isLoading={isLoading} />
          </div>

          {/* Active Lesson Modal */}
          <ActiveLessonModal
            isOpen={isLessonActive}
            onFinish={finishLesson}
            startTime={lessonStartTime}
          />
        </div>
      </div>
    </Layout>
  );
}

const navButtonStyle = {
  backgroundColor: "white",
  border: "1px solid #d1d5db",
  borderRadius: 12,
  padding: 8,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.2s ease",
};

export default Attendance;
