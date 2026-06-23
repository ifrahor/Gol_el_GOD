import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Search, Download, User, Calendar, ChevronDown, ChevronLeft } from "lucide-react"; 
import Layout from "../components/Layout";

const AttendanceReport = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [groupedData, setGroupedData] = useState({}); 
  const [coachesNames, setCoachesNames] = useState({}); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [expandedCoach, setExpandedCoach] = useState(null); 

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const monthNames = [
    "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.email.trim());
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
        setLoading(false);
      } else {
        if (!loading) navigate("/");
      }
    });
    return () => unsubscribe();
  }, [auth, db, navigate, loading]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "attendanceReports"),
      async (snapshot) => {
        const attendanceData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const newGroupedData = {};
        const namesMap = { ...coachesNames };

        for (let record of attendanceData) {
          const email = record.trainer_email?.trim();
          if (!email) continue;

          let recordDate = new Date();
          if (record.date && typeof record.date.toDate === "function") {
            recordDate = record.date.toDate();
          } else if (record.date) {
            recordDate = new Date(record.date);
          }

          const monthIdx = recordDate.getMonth(); 
          const year = recordDate.getFullYear();
          const monthKey = `${monthIdx + 1}-${year}`; 

          if (!newGroupedData[email]) {
            newGroupedData[email] = {};
          }
          if (!newGroupedData[email][monthKey]) {
            newGroupedData[email][monthKey] = [];
          }
          
          newGroupedData[email][monthKey].push(record);

          if (!namesMap[email]) {
            try {
              const uDoc = await getDoc(doc(db, "users", email));
              if (uDoc.exists()) {
                const d = uDoc.data();
                namesMap[email] = d.firstName || d.lastName ? `${d.firstName || ""} ${d.lastName || ""}`.trim() : d.name || email;
              } else {
                namesMap[email] = email;
              }
            } catch (e) {
              namesMap[email] = email;
            }
          }
        }

        setGroupedData(newGroupedData);
        setCoachesNames(namesMap);
      },
      (error) => console.error("Error fetching attendance:", error)
    );

    return () => unsubscribe();
  }, [user, db]);

  const formatTime = (value) => {
    if (value && typeof value.toDate === "function") {
      return value.toDate().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
    }
    return String(value || "-");
  };

  const handleExportMonth = (coachEmail, monthKey, recordsList) => {
    const coachName = coachesNames[coachEmail] || coachEmail;
    const [month, year] = monthKey.split("-");
    const monthName = monthNames[parseInt(month) - 1];

    let csvContent = "\uFEFF"; 
    csvContent += `דו"ח נוכחות חודשי - ${coachName}\n`;
    csvContent += `חודש: ${monthName} ${year}\n\n`;
    csvContent += "תאריך,שעת התחלה,שעת סיום\n";

    recordsList.forEach((record) => {
      let dateStr = "-";
      if (record.date && typeof record.date.toDate === "function") {
        dateStr = record.date.toDate().toLocaleDateString("he-IL");
      }
      const start = formatTime(record.start_time);
      const end = formatTime(record.end_time);
      csvContent += `${dateStr},${start},${end}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `נוכחות_${coachName.replace(/\s+/g, "_")}_${monthName}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCoaches = Object.keys(groupedData).filter((email) => {
    const name = coachesNames[email] || email;
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <div className="p-6 text-center">טוען...</div>;

  return (
    <Layout userData={userData}>
      <div className="w-screen max-w-full p-8 text-right bg-gray-50/50 min-h-screen" dir="rtl">
        <div className="max-w-6xl mx-auto w-full">
          
          {/* כותרת הדף */}
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-800">ניהול וסינון דוחות נוכחות</h2>
            <p className="text-gray-500 text-sm mt-1">צפייה וייצוא דוחות חודשיים מפוצלים לפי מאמני העמותה</p>
          </div>

          {/* שורת חיפוש רחבה */}
          <div className="flex justify-start mb-8">
            <div className="relative w-full sm:w-96 shadow-sm">
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="חפש מאמן לפי שם או מייל..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-right text-sm text-gray-700"
              />
            </div>
          </div>

          {/* רשימת המאמנים */}
          <div className="space-y-4 w-full">
            {filteredCoaches.length === 0 ? (
              <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                לא נמצאו מאמנים עם דיווחי נוכחות במערכת.
              </div>
            ) : (
              filteredCoaches.map((email) => {
                const isExpanded = expandedCoach === email;
                const coachName = coachesNames[email] || email;
                const months = groupedData[email];

                return (
                  <div key={email} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full transition duration-200 hover:shadow-md">
                    
                    {/* שורת כותרת המאמן */}
                    <div 
                      onClick={() => setExpandedCoach(isExpanded ? null : email)}
                      className="p-5 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50/80 select-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
                          <User size={22} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{coachName}</h3>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{email}</p>
                        </div>
                      </div>
                      <div className="text-gray-400 pl-2">
                        {isExpanded ? <ChevronDown size={22} /> : <ChevronLeft size={22} />}
                      </div>
                    </div>

                    {/* אזור החודשים שנפתח בשורה אופקית אסטטית */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/40 p-6 w-full">
                        <div className="flex flex-row flex-wrap gap-4 justify-start items-center">
                          {Object.keys(months).sort().map((monthKey) => {
                            const [month, year] = monthKey.split("-");
                            const label = `חודש ${monthNames[parseInt(month) - 1]} ${year}`;
                            const count = months[monthKey].length;

                            return (
                              <div 
                                key={monthKey} 
                                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition duration-200 min-w-[220px]"
                              >
                                {/* פרטי החודש */}
                                <div className="flex items-center gap-2 text-gray-800">
                                  <Calendar size={18} className="text-blue-500" />
                                  <span className="font-bold text-sm">{label}</span>
                                </div>
                                
                                {/* כמות הדיווחים */}
                                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-semibold">
                                  {count} דיווחים
                                </span>

                                {/* כפתור הורדה קומפקטי */}
                                <button
                                  onClick={() => handleExportMonth(email, monthKey, months[monthKey])}
                                  className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition active:transform active:scale-95"
                                >
                                  <Download size={14} />
                                  הורד קובץ Excel
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default AttendanceReport;