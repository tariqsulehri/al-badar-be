import PropTypes from "prop-types";

const LoaderSpinner = ({ className, role, color, size, ...otherProps }) => {
  return (
    // <div
    //   {...otherProps}
    //   style={{
    //     fontSize: size / 2,
    //     color: color,
    //     width: size + "px",
    //     height: size + "px",
    //   }}
    // ></div>
    <div>
      
    </div>
  );
};

// LoaderSpinner.propTypes = {
//   className: PropTypes.string.isRequired,
//   role: PropTypes.string.isRequired,
//   color: PropTypes.string,
//   size: PropTypes.number.isRequired,
// };

export default LoaderSpinner;
