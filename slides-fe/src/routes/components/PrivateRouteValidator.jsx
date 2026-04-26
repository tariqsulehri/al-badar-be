import { Navigate } from "react-router-dom";
import { IsLogin, GetCurrentUser } from "../../utils/utilAuth";
import PropTypes from "prop-types";

const PrivateRouteValidator = ({ children }) => {
  const isLogin = IsLogin();
  const currentUser = GetCurrentUser();
  const allowedRoles = ["user", "admin"];
  if (!isLogin || (!currentUser && !allowedRoles.includes(currentUser.role))) {
    return <Navigate to="/login" replace />;
  } else {
    return children;
  }
};

PrivateRouteValidator.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRouteValidator;
