import PropTypes from "prop-types";

// Material Design icon paths (24x24), rendered as plain SVGs so the app
// so the app has no MUI dependency.
const SIZES = { small: 20, medium: 24, large: 35 };

function createIcon(path, displayName) {
  function Icon({ fontSize = "medium", className = "", ...rest }) {
    const size = SIZES[fontSize] ?? SIZES.medium;
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className={`inline-block shrink-0 ${className}`}
        {...rest}
      >
        <path d={path} />
      </svg>
    );
  }
  Icon.displayName = displayName;
  Icon.propTypes = {
    fontSize: PropTypes.oneOf(["small", "medium", "large"]),
    className: PropTypes.string,
  };
  return Icon;
}

const EDIT_OUTLINE_PATH =
  "M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z";

export const SearchIcon = createIcon(
  "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  "SearchIcon"
);

export const RefreshIcon = createIcon(
  "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
  "RefreshIcon"
);

export const DeleteIcon = createIcon(
  "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  "DeleteIcon"
);

export const DeleteOutlineIcon = createIcon(
  "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4h-3.5z",
  "DeleteOutlineIcon"
);

export const EditOutlinedIcon = createIcon(EDIT_OUTLINE_PATH, "EditOutlinedIcon");
export const ModeEditOutlineIcon = createIcon(EDIT_OUTLINE_PATH, "ModeEditOutlineIcon");

// ── Navigation icons ────────────────────────────────────────────────
export const DashboardIcon = createIcon(
  "M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z",
  "DashboardIcon"
);

export const SlidesIcon = createIcon(
  "M10 8v8l5-4-5-4zm9-5H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z",
  "SlidesIcon"
);

export const PartyIcon = createIcon(
  "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z",
  "PartyIcon"
);

export const SetupIcon = createIcon(
  "M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z",
  "SetupIcon"
);

export const UsersIcon = createIcon(
  "M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S6 8.83 6 8s.67-1.5 1.5-1.5zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S15 8.83 15 8s.67-1.5 1.5-1.5z",
  "UsersIcon"
);

export const LockIcon = createIcon(
  "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z",
  "LockIcon"
);

export const LogoutIcon = createIcon(
  "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
  "LogoutIcon"
);

export const PersonAddIcon = createIcon(
  "M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.8 1.29 6 2H9zm-3-3v-3h3v-2H6V7H4v3H1v2h3v3z",
  "PersonAddIcon"
);

export const ChevronRightIcon = createIcon("M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z", "ChevronRightIcon");
export const ChevronLeftIcon = createIcon("M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z", "ChevronLeftIcon");
export const ExpandMoreIcon = createIcon("M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z", "ExpandMoreIcon");
export const MenuIcon = createIcon("M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z", "MenuIcon");
export const CloseIcon = createIcon(
  "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  "CloseIcon"
);

export const DownloadIcon = createIcon("M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z", "DownloadIcon");
export const AddIcon = createIcon("M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z", "AddIcon");
export const PlanIcon = createIcon(
  "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  "PlanIcon"
);
