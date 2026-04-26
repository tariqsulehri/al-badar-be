import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./nav.css";

const NavAdmin = ({ currentUser, handeleLogout }) => {
  return (
    <ul className="nav-items" id="nav-bar">
      {currentUser ? (
        <Fragment>
          <li className="nav-item dropdown">
            <Link
              className="nav-items dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Dropdown
            </Link>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <Link className="dropdown-item" href="#">
                  Action
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="#">
                  Another action
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="#">
                  Something else here
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link to={`/setup/prov`}>Provence</Link>
          </li>
          <li className="nav-item">
            <Link to={`/setup/city`}>City</Link>
          </li>
          <li className="nav-item">
            <Link to={`/setup/area`}>Area</Link>
          </li>
          <li className="nav-item">
            <Link to={`/setup/subarea`}>Subarea</Link>
          </li>
          <li className="nav-item">
            <Link to={`/user/list`}>Users</Link>
          </li>
          <li className="nav-item">
            <Link to={`/user/pass`}>Change Password</Link>
          </li>
          <li className="nav-item">
            <Link to="/login" onClick={handeleLogout}>
              Logout
            </Link>
          </li>
        </Fragment>
      ) : (
        <li className="nav-item">
          <Link to="/login">Login</Link>
        </li>
      )}
    </ul>
  );
};

NavAdmin.propTypes = {
  currentUser: PropTypes.object,
  handeleLogout: PropTypes.func,
};

export default NavAdmin;
