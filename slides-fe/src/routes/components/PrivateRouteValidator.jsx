import PropTypes from "prop-types";
import RoleGuard from "./RoleGuard";

/** Any signed-in user. */
const PrivateRouteValidator = ({ children }) => (
  <RoleGuard allowedRoles={["user", "manager", "admin"]}>{children}</RoleGuard>
);

PrivateRouteValidator.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRouteValidator;
