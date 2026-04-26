import { Input, Typography } from "@mui/material"
import "./fileUpload.css";
const FileUpload = ({id, name, onChange}) => {
  return (
    <div className="custom-file-upload-wrapper">
      <Input
        id={id}
        name={name}
        filename={name}
        type="file"
        accept="image/*"
        placeholder="Slide image"
        onChange={onChange}
        className="custom-file-upload"
      />
      <Typography variant="body1">Select Image</Typography>
  </div>
  );
};

export default FileUpload;

