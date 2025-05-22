import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  
} from "reactstrap";
import { toast } from 'react-toastify';

import { useTranslation } from "react-i18next"; // Using hook instead of HOC


import { Link, useNavigate } from "react-router-dom";

// users - keep your avatar import
import user1 from "../../../assets/images/users/avatar-1.jpg"; // Default avatar
// import { useAuth } from '../../context/AuthContext'; // Uncomment if using AuthContext

const ProfileMenu = (props) => { // props might not be needed if not using Redux state
  const { t } = useTranslation(); // For i18n
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  // --- State for user details ---
  const [displayName, setDisplayName] = useState("User"); // Default display name
  const [displayRole, setDisplayRole] = useState("");   // State for role

  // If using AuthContext:
  // const { userName: contextUserName, userRole: contextUserRole, logout: contextLogout } = useAuth();

  useEffect(() => {
    // Get username and role from localStorage (or AuthContext)
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("userRole");

    if (storedUserName) {
      setDisplayName(storedUserName);
    }
    if (storedUserRole) {
      setDisplayRole(storedUserRole);
    }
    // If using AuthContext, you'd set from contextUserName, contextUserRole
  }, []); // Run once on mount, or add dependencies if these can change during session

  const handleLogout = () => {
    console.log("LOGOUT_DEBUG: Logging out...");
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');

    // If using AuthContext, call its logout
    // if (contextLogout) contextLogout();
   
    toast.info("You have been logged out."); // Optional toast message
    localStorage.clear();
    navigate('/login', { replace: true });
    console.log("LOGOUT_DEBUG: Navigated to /login"); // Redirect to login page
  };
 const isLoggedIn = !!localStorage.getItem('accessToken');
  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item bg-soft-light border-start border-end"
          id="page-header-user-dropdown"
          tag="button"
          style={{ display: 'flex', alignItems: 'center' }} // For better alignment
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1} // Replace with dynamic user photo if available
            alt="Header Avatar"
            style={{ width: '36px', height: '36px' }} // Consistent size
          />
          <div className="d-none d-xl-inline-block ms-2 me-1"> {/* Container for name and role */}
            <span className="fw-medium d-block" style={{ lineHeight: '1.2' }}>{displayName}</span>
            {displayRole && ( // Display role only if it exists
              <span className="text-muted font-size-12 d-block" style={{ lineHeight: '1.1' }}>{displayRole}</span>
            )}
          </div>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/* <Link to={"/profile"} className="dropdown-item">
            <i className="mdi mdi-face-man font-size-16 align-middle me-1"></i>{" "}
            {t("Profile")}
          </Link> */}

          {/* <Link to="/page-lock-screen" className="dropdown-item">
            <i className="mdi mdi-lock font-size-16 align-middle me-1"></i>
            {t("Lock screen")}
          </Link> */}
          {/* Lock screen might need different auth logic */}

          <div className="dropdown-divider" />
          {/* Changed Link to a button for logout to use onClick */}
          <button onClick={handleLogout} className="dropdown-item text-danger">
            <i className="mdi mdi-logout font-size-16 align-middle me-1"></i>
            <span>{t("Logout")}</span>
          </button>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  
};


export default ProfileMenu; 