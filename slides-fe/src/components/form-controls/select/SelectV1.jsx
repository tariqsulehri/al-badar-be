import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import Stylesheet from "reactjs-stylesheet";

const styles = Stylesheet.create({
  container: {
    marginBottom: "10px",
    padding: "2px",
  },
  select: {
    width: "100%",
  },
});

const CustomSelect = ({
  label,
  options,
  width,
  onChange,
  name,
  isMulti,
  isDisabled,
}) => {
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: `${width}px`,
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "45px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div className={styles.container}>
      <label>{label}</label>
      <Select
        name={name}
        options={options}
        onChange={onChange}
        styles={customStyles}
        isMulti={isMulti}
        isDisabled={isDisabled}
      />
    </div>
  );
};

CustomSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  width: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isMulti: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

CustomSelect.defaultProps = {
  isMulti: false,
  isDisabled: false,
};

export default CustomSelect;
