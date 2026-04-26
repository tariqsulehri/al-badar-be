import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./nav.css";

const UserMenu = ({ anchorEl, handleMenuClose, currentUser, handeleLogout }) => {
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  return (
    <Menu
      id="user-menu"
      className="menu-top-set"
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={handleMenuClose}
    >
      {currentUser && currentUser.role === 'admin' && (
        <MenuItem
          onClick={() => {
            navigate("/users/create");
            handleMenuClose();
          }}
        >
          Create User
        </MenuItem>
      )}
      {currentUser && (
        <MenuItem
          onClick={() => {
            navigate("/user/pass");
            handleMenuClose();
          }}
        >
          Change Password
        </MenuItem>
      )}
      {currentUser && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handeleLogout && handeleLogout();
            navigate("/login");
          }}
        >
          Logout
        </MenuItem>
      )}
      {!currentUser && (
        <MenuItem
          onClick={() => {
            navigate("/login");
            handleMenuClose();
          }}
        >
          Login
        </MenuItem>
      )}
    </Menu>
  );
};

UserMenu.propTypes = {
  anchorEl: PropTypes.any,
  handleMenuClose: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  handeleLogout: PropTypes.func,
};

export default UserMenu;
