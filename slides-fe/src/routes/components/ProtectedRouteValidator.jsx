import { Navigate } from "react-router-dom";
import { IsLogin, GetCurrentUser } from "../../utils/utilAuth";
import PropTypes from "prop-types";

const ProtectedRouteValidator = ({ children }) => {
  const isLogin = IsLogin();
  const currentUser = GetCurrentUser();

  const allowedRoles = ["admin", "manager"];
  if (!isLogin || !currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />;
  } else {
    return children;
  }
};

ProtectedRouteValidator.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRouteValidator;
