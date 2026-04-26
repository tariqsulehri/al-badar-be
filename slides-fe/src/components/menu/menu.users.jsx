import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import "./nav.css"

const SlideMenu = ({anchorEl, handleMenuClose}) => {
  return (
        <Menu
          id="simple-menu"
          className="menu-top-set"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
           <MenuItem onClick={handleMenuClose}>Login</MenuItem>
          <MenuItem onClick={handleMenuClose}>Change Password</MenuItem>
        </Menu>
  );
};

export default SlideMenu;
