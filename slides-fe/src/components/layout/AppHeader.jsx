import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/slice/authSlice";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import DropdownMenu, { DropdownItem } from "../menu/DropdownMenu";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExpandMoreIcon,
  LockIcon,
  LogoutIcon,
  MenuIcon,
  PersonAddIcon,
} from "../icons";
import { currentSectionLabel, initialsOf } from "./navConfig";

const iconButton =
  "grid h-9 w-9 place-items-center rounded-lg text-text-secondary transition-colors hover:bg-brand-muted hover:text-text-primary";

const AppHeader = ({ currentUser, collapsed, onToggleCollapsed, onOpenMobile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const userButtonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const section = currentSectionLabel(pathname);

  const go = (to) => {
    setMenuOpen(false);
    navigate(to);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b border-border-soft bg-bg-surface-strong px-3 sm:px-4">
      {currentUser && (
        <>
          {/* Mobile: open drawer. Desktop: collapse rail. */}
          <button type="button" className={`${iconButton} lg:hidden`} onClick={onOpenMobile} aria-label="Open menu">
            <MenuIcon fontSize="small" />
          </button>
          <button
            type="button"
            className={`${iconButton} hidden lg:grid`}
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => navigate(currentUser ? "/dashboard" : "/")}
        className="flex items-center gap-3 rounded-lg pr-2 text-left"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-base font-extrabold text-on-brand shadow-soft">
          S
        </span>
        <span className="hidden items-center gap-3 sm:flex">
          <span className="text-lg font-extrabold tracking-tight text-brand-strong">Slides</span>
          <span className="h-6 w-px bg-border-strong" aria-hidden="true" />
          <span className="text-[15px] font-semibold text-text-primary">Control Center</span>
        </span>
      </button>

      {section && (
        <nav aria-label="Breadcrumb" className="ml-2 hidden items-center gap-1.5 text-sm text-text-muted md:flex">
          <ChevronRightIcon fontSize="small" />
          <span className={section.page ? "" : "font-semibold text-text-primary"}>{section.section}</span>
          {section.page && (
            <>
              <ChevronRightIcon fontSize="small" />
              <span className="font-semibold text-text-primary">{section.page}</span>
            </>
          )}
        </nav>
      )}

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeSwitcher variant="header" />

        {currentUser ? (
          <>
            <span className="hidden h-8 w-px bg-border-soft sm:block" aria-hidden="true" />
            <button
              ref={userButtonRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-brand-muted"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-[13px] font-bold text-on-brand">
                {initialsOf(currentUser)}
              </span>
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-sm font-semibold text-text-primary">{currentUser.username}</span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  {currentUser.role}
                </span>
              </span>
              <ExpandMoreIcon fontSize="small" className="text-text-muted" />
            </button>

            <DropdownMenu
              anchorEl={userButtonRef.current}
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              className="!left-auto right-3"
            >
              <div className="px-3.5 pb-2 pt-1.5">
                <p className="text-sm font-semibold text-text-primary">{currentUser.username}</p>
                {currentUser.email && <p className="text-xs text-text-muted">{currentUser.email}</p>}
              </div>
              <div className="mx-2 mb-1 h-px bg-border-soft" />
              {currentUser.role === "admin" && (
                <DropdownItem onClick={() => go("/users/create")} className="flex items-center gap-2.5">
                  <PersonAddIcon fontSize="small" /> Create user
                </DropdownItem>
              )}
              <DropdownItem onClick={() => go("/user/pass")} className="flex items-center gap-2.5">
                <LockIcon fontSize="small" /> Change password
              </DropdownItem>
              <DropdownItem onClick={handleLogout} className="flex items-center gap-2.5 !text-danger">
                <LogoutIcon fontSize="small" /> Log out
              </DropdownItem>
            </DropdownMenu>
          </>
        ) : (
          pathname !== "/login" && (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong"
            >
              Sign in
            </button>
          )
        )}
      </div>
    </header>
  );
};

AppHeader.propTypes = {
  currentUser: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  collapsed: PropTypes.bool,
  onToggleCollapsed: PropTypes.func.isRequired,
  onOpenMobile: PropTypes.func.isRequired,
};

export default AppHeader;
