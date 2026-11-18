import PropTypes from "prop-types";
import RoleGuard from "./RoleGuard";

/** Back-office screens: admins and managers. */
const ProtectedRouteValidator = ({ children }) => (
  <RoleGuard allowedRoles={["admin", "manager"]}>{children}</RoleGuard>
);

ProtectedRouteValidator.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRouteValidator;
