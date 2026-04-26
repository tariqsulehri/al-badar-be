// Navbar.js
import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";

import "./nav.css";

const SlideMenu = ({ anchorEl, handleMenuClose }) => {
  const navigate = useNavigate();

  return (
    <Menu
      id="simple-menu"
      className="menu-top-set"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          navigate("/slides/list");
          handleMenuClose();
        }}
      >
        List Slides
      </MenuItem>

      <MenuItem
        onClick={() => {
          navigate("/slides/create");
          handleMenuClose();
        }}
      >
        Create Slides
      </MenuItem>

      <MenuItem
        onClick={() => {
          navigate("/party/create");
          handleMenuClose();
        }}
      >
        Create Party
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate("/party/list");
          handleMenuClose();
        }}
      >
        List Party
      </MenuItem>

    </Menu>
  );
};

export default SlideMenu;
