import React from "react";
import PropTypes from "prop-types";

const TONES = {
  available: "success",
  active: "success",
  booked: "warning",
  pending: "warning",
  inactive: "neutral",
  unavailable: "danger",
};

/** Tinted status chip; unknown statuses render neutral. */
const StatusBadge = ({ status }) => {
  const tone = TONES[String(status).toLowerCase()] || "neutral";
  return <span className={`chip chip--${tone}`}>{status}</span>;
};

StatusBadge.propTypes = { status: PropTypes.string };

export default StatusBadge;
