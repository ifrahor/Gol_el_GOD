import React from "react";
import { Clock, Calendar, TrendingUp, Award } from "lucide-react";

export default function MonthlyStats({ lessons, currentMonth }) {
  const totalHours = lessons.reduce((total, lesson) => {
    const [hours, minutes] = lesson.total_work_time
      .split(/[hm]/)
      .map((s) => parseInt(s.trim()) || 0);
    return total + hours + minutes / 60;
  }, 0);

  const averagePerLesson =
    lessons.length > 0 ? totalHours / lessons.length : 0;

  const stats = [
    {
      title: "Total Lessons",
      value: lessons.length,
      icon: Calendar,
      colorStart: "#3b82f6", // blue-500
      colorEnd: "#2563eb", // blue-600
    },
    {
      title: "Total Hours",
      value: `${Math.floor(totalHours)}h ${Math.round(
        (totalHours % 1) * 60
      )}m`,
      icon: Clock,
      colorStart: "#22c55e", // green-500
      colorEnd: "#16a34a", // green-600
    },
    {
      title: "Average/Lesson",
      value: `${Math.floor(averagePerLesson)}h ${Math.round(
        (averagePerLesson % 1) * 60
      )}m`,
      icon: TrendingUp,
      colorStart: "#8b5cf6", // purple-500
      colorEnd: "#7c3aed", // purple-600
    },
    {
      title: "This Month",
      value: currentMonth,
      icon: Award,
      colorStart: "#f97316", // orange-500
      colorEnd: "#ea580c", // orange-600
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
        gap: 24,
        marginBottom: 32,
      }}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: 16,
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              overflow: "hidden",
              padding: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backdropFilter: "blur(8px)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#4b5563", // gray-600
                  marginBottom: 4,
                }}
              >
                {stat.title}
              </p>
              <p
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#111827", // gray-900
                }}
              >
                {stat.value}
              </p>
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: `linear-gradient(to right, ${stat.colorStart}, ${stat.colorEnd})`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: `0 0 10px ${stat.colorEnd}`,
              }}
            >
              <Icon color="white" size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
