import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import Stylesheet from "reactjs-stylesheet";
import PropTypes from "prop-types";

const styles = Stylesheet.create({
  checkbox: {
    padding: "3px",
    marginBottom: "10px",
    fontSize: 13,
  },
});

const CheckboxField = ({
  id,
  name,
  label,
  width = 400,
  checked = false,
  onChange,
  ...otherProps
}) => {
  return (
    <div style={{ width: width, marginBottom: styles.checkbox.marginBottom }}>
      <FormControlLabel
        control={
          <Checkbox
            className={styles.checkbox}
            id={id}
            name={name}
            checked={checked}
            onChange={onChange}
            {...otherProps}
          />
        }
        label={<span style={{ fontSize: styles.checkbox.fontSize }}>{label}</span>}
      />
    </div>
  );
};

CheckboxField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  width: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

CheckboxField.defaultProps = {
  checked: false,
  width: 400,
};

export default CheckboxField;
