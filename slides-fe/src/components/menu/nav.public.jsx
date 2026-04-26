import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./nav.css";

const NavPublic = ({ currentUser, handeleLogout }) => {
  console.log({currentUser})
  return (<ul className="nav-items" id="nav-bar">
        {currentUser ? (
          <>
            <li className="nav-item">
              <Link to={`/user/pass`}>Change Password</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" onClick={handeleLogout}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>);
};

NavPublic.propTypes = {
  currentUser: PropTypes.object,
  handeleLogout: PropTypes.func,
};

export default NavPublic;
