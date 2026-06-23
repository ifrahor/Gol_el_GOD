import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, StopCircle, Timer } from "lucide-react";
import { format } from "date-fns";

export default function ActiveLessonModal({ isOpen, onFinish, startTime }) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isOpen || !startTime) {
      setElapsedTime(0);
      return;
    }

    setElapsedTime(Math.floor((new Date() - startTime) / 1000));

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, startTime]);

  if (!isOpen) return null; // לא מציגים את המודל אם הוא סגור

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // עיצוב פשוט למודל עם מעט CSS inline
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background:
            "linear-gradient(to bottom right, #bfdbfe, #6366f1)",
          borderRadius: "1rem",
          padding: "2rem",
          width: "320px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          textAlign: "center",
          color: "#111827",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            margin: "0 auto 1.5rem auto",
            borderRadius: "50%",
            background:
              "linear-gradient(to right, #3b82f6, #4f46e5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 0 15px rgba(59,130,246,0.6)",
          }}
        >
          <Timer color="white" size={40} />
        </div>

        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 8 }}>
          Lesson in Progress
        </h2>
        <p style={{ marginBottom: "1.5rem", color: "#4b5563" }}>
          Started at {startTime ? format(startTime, "HH:mm") : "--:--"}
        </p>

        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
              color: "#6366f1",
            }}
          >
            <Clock size={24} />
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#4b5563",
              }}
            >
              Elapsed Time
            </span>
          </div>
          <div
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              fontFamily: "monospace",
              color: "#111827",
              letterSpacing: "-0.05em",
            }}
          >
            {formatTime(elapsedTime)}
          </div>
          <div
            style={{ fontSize: "1.125rem", color: "#4b5563", marginTop: 4 }}
          >
            {formatDuration(elapsedTime)}
          </div>
        </motion.div>

        <button
          onClick={onFinish}
          style={{
            background:
              "linear-gradient(to right, #ef4444, #b91c1c)",
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "1rem",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(220,38,38,0.6)",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "1.125rem",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(220,38,38,0.8)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(220,38,38,0.6)";
          }}
        >
          <StopCircle size={20} />
          Finish Lesson
        </button>
      </motion.div>
    </div>
  );
}
