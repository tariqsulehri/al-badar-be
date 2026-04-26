import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import "./nav.css";

const SetupMenu = ({ anchorEl, handleMenuClose }) => {

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
          navigate("setup/prov/list");
          handleMenuClose();
        }}
      >
        Provence
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate("/setup/city/list");
          handleMenuClose();
        }}
      >
        City
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate("/setup/area/list");
          handleMenuClose();
        }}
      >
        Area
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate("/setup/subarea/list");
          handleMenuClose();
        }}
      >
        Sub Area
      </MenuItem>

    </Menu>


  );
};

export default SetupMenu;
