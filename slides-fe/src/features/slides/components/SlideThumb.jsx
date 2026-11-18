import React, { useState } from "react";
import PropTypes from "prop-types";

/** 40px slide photo for list rows; falls back to the label's initial. */
const SlideThumb = ({ src, label }) => {
  const [failed, setFailed] = useState(false);
  const initial = (label || "?").trim().charAt(0).toUpperCase();
  return (
    <span className="avatar avatar--square h-10 w-10" aria-hidden="true">
      {src && !failed ? <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} /> : initial}
    </span>
  );
};

SlideThumb.propTypes = { src: PropTypes.string, label: PropTypes.string };

export default SlideThumb;
