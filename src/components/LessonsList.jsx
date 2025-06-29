import React from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, Timer } from "lucide-react";
import { format } from "date-fns";

export default function LessonsList({ lessons, isLoading }) {
  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[0, 1, 2].map((_, i) => (
          <div
            key={i}
            style={{
              height: 96,
              backgroundColor: "#f3f4f6",
              borderRadius: 16,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        ))}

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div
        style={{
          border: "2px dashed #d1d5db",
          borderRadius: 16,
          padding: 48,
          textAlign: "center",
          color: "#6b7280",
          backgroundColor: "#f9fafb",
        }}
      >
        <Timer size={48} style={{ marginBottom: 16, color: "#9ca3af" }} />
        <h3 style={{ fontSize: 18, fontWeight: "500", marginBottom: 8, color: "#111827" }}>
          No lessons yet
        </h3>
        <p>Start your first lesson to see it appear here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {lessons.map((lesson, index) => (
        <motion.div
          key={lesson.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: 16,
            boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
            padding: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: "linear-gradient(to right, #3b82f6, #6366f1)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
              }}
            >
              <Clock color="white" size={24} />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                  color: "#6b7280",
                  fontWeight: "600",
                }}
              >
                <Calendar size={16} />
                <span style={{ fontWeight: "600", color: "#111827" }}>
                  {format(new Date(lesson.date), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 14, color: "#4b5563" }}>
                <span>{lesson.start_time} - {lesson.end_time}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#d1fae5",
              color: "#065f46",
              borderRadius: 12,
              padding: "4px 12px",
              fontSize: 14,
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: 4,
              border: "1px solid #a7f3d0",
            }}
          >
            <Timer size={14} />
            {lesson.total_work_time}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
