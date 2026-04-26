import React, { useMemo, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/slice/authSlice";
import SlideMenu from "./menu.slides";
import SetupMenu from "./menu.setup";
import UserMenu from "./nav.users";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import "./nav.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [anchorSetupEl, setAnchorSetupEl] = useState(null);
  const [anchorSlidesEl, setAnchorSlidesEl] = useState(null);
  const [anchorUserEl, setAnchorUserEl] = useState(null);

  const navLabel = useMemo(() => {
    if (location.pathname.startsWith("/slides")) return "Slides";
    if (location.pathname.startsWith("/setup")) return "Configuration";
    if (location.pathname.startsWith("/user")) return "Users";
    if (location.pathname.startsWith("/party")) return "Parties";
    return "Workspace";
  }, [location.pathname]);

  const handleMenuClose = () => {
    setAnchorSetupEl(null);
    setAnchorSlidesEl(null);
    setAnchorUserEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
  };

  return (
    <AppBar position="sticky" elevation={0} className="topbar">
      <Toolbar className="topbar__toolbar">
        <Box className="topbar__brand" onClick={() => navigate("/")}>
          <div className="topbar__brand-mark">S</div>
          <div>
            <p className="topbar__eyebrow">Media Operations</p>
            <h1 className="topbar__title">Slides Control Center</h1>
          </div>
        </Box>

        <Stack direction="row" spacing={1.25} className="topbar__nav">
          <Button className="topbar__link" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button className="topbar__link" onClick={(event) => setAnchorSlidesEl(event.currentTarget)}>
            Slides
          </Button>
          <Button className="topbar__link" onClick={(event) => setAnchorSetupEl(event.currentTarget)}>
            Setup
          </Button>
          <Button className="topbar__link" onClick={(event) => setAnchorUserEl(event.currentTarget)}>
            Account
          </Button>
        </Stack>

        <div className="topbar__status">
          <ThemeSwitcher />
          <div className="topbar__status-copy">
            <span className="topbar__status-label">Current view</span>
            <strong>{navLabel}</strong>
          </div>
          <Chip
            className="topbar__chip"
            label={currentUser ? `${currentUser.name} · ${currentUser.role}` : "Guest"}
          />
        </div>

        <SlideMenu anchorEl={anchorSlidesEl} handleMenuClose={handleMenuClose} />
        <SetupMenu anchorEl={anchorSetupEl} handleMenuClose={handleMenuClose} />
        <UserMenu
          anchorEl={anchorUserEl}
          handleMenuClose={handleMenuClose}
          currentUser={currentUser}
          handeleLogout={handleLogout}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
