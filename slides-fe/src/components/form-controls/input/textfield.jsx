import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const InputField = ({ id, name, rows = 1, type = "text", ...otherProps }) => {
  const isMultiline = rows > 1;

  return (
    <TextField
      variant="outlined"
      size="medium"
      rows={rows}
      multiline={isMultiline}
      id={id}
      name={name}
      type={type}
      fullWidth
      InputLabelProps={{
        sx: {
          fontSize: 14,
        },
      }}
      inputProps={{
        sx: {
          fontSize: 16,
          lineHeight: 1.4,
          py: isMultiline ? 1.5 : 0,
        },
      }}
      sx={{
        mb: 1,
        "& .MuiOutlinedInput-root": {
          minHeight: isMultiline ? "auto" : 56,
          borderRadius: "16px",
          backgroundColor: "rgba(255,255,255,0.96)",
          alignItems: isMultiline ? "flex-start" : "center",
        },
        "& .MuiOutlinedInput-input": {
          padding: isMultiline ? "14px 16px" : "16px 16px",
        },
      }}
      {...otherProps}
    />
  );
};

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rows: PropTypes.number,
  type: PropTypes.string,
};

InputField.defaultProps = {
  rows: 1,
  type: "text",
};

export default InputField;
