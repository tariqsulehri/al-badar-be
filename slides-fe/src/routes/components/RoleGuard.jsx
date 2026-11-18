import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser, useIsLoggedIn } from "../../utils/utilAuth";

/**
 * Client-side guard for UX only — the API enforces the real access rules.
 * Not signed in -> /login (remembering where the user was going).
 * Signed in without the role -> home.
 */
const RoleGuard = ({ allowedRoles, children }) => {
  const isLoggedIn = useIsLoggedIn();
  const currentUser = useCurrentUser();
  const location = useLocation();

  if (!isLoggedIn || !currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

RoleGuard.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default RoleGuard;
