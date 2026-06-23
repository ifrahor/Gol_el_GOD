import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#00509e',
  padding: '0 20px',
  height: '55px',
  width: '100%',
  boxSizing: 'border-box',
  color: 'white',
  fontWeight: '500',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
};

// כפתור ההתנתקות - בצד שמאל
const logoutButtonStyle = {
  textDecoration: 'none',
  padding: '6px 12px', // קטן יותר
  fontSize: '14px',
  backgroundColor: 'transparent',
  border: '1.5px solid white',
  fontWeight: '600',
  color: 'white',
  cursor: 'pointer',
  borderRadius: '4px',
};

// מיכל שמאלי - כפתור ההתנתקות
const leftContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  // שומר על כפתור השמאלי בקצה הסרגל
  flexShrink: 0,
};

// מיכל הקישורים במרכז
const navLinksContainer = {
  display: 'flex',
  gap: '30px',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  height: '100%',
};

// מיכל הפרופיל מימין
const profileContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  flexShrink: 0,
};

const profileIconStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: '2px solid white',
};

const helloTextStyle = {
  color: 'white',
  fontWeight: '600',
  fontSize: '16px',
  userSelect: 'none',
};

function Navbar({ role, onLogout, userPhotoURL, userName }) {
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);

  const linksForRoles = {
    manager: [
      {name: 'מאמרים' ,path: "/InspirationArticles"} ,
      { name: 'פרשת שבוע', path: '/ParashaArchive' }, 
      { name: 'דף הבית', path: '/HomePage' },
      { name: 'פרטי מאמנים', path: '/users' },
      { name: ' דו"חות נוחכות', path: '/AttendanceReport' },
    ],
    coach: [
      {name: 'מאמרים' ,path: "/InspirationArticles"} , 
      { name: 'פרשת שבוע', path: '/ParashaArchive' },
      { name: 'דף הבית', path: '/HomePage' },
      { name: 'הקבוצות שלי', path: '/MyGroups' },
      { name: 'דו"ח נוכחות', path: '/Attendance' },
     
    ],
  };

  const links = linksForRoles[role?.toLowerCase()] || [];

  const handleProfileClick = () => {
    navigate('/InfoUser');
  };

  return (
    <nav style={navStyle}>
      {/* צד שמאל - כפתור התנתקות */}
      <div style={leftContainer}>
        <button onClick={onLogout} style={logoutButtonStyle}>
          התנתקות
        </button>
      </div>

      {/* מרכז - קישורים */}
      <div style={navLinksContainer}>
        {links.map(({ name, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {name}
          </NavLink>
        ))}
      </div>

      {/* צד ימין - פרופיל */}
      <div style={profileContainer} onClick={handleProfileClick} title="פרופיל">
        <span style={helloTextStyle}>hello {userName || ''}</span>
        <img
          src={userPhotoURL || 'https://cdn-icons-png.flaticon.com/512/64/64572.png'}
          alt="InfoUser"
          style={profileIconStyle}
        />
      </div>
    </nav>
  );
}

export default Navbar;
