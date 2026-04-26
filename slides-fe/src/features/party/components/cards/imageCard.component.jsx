import { Card, CardMedia, CardContent, CardActions, Typography, Grid } from "@mui/material";
import FileUploader from "../../../../components/form-controls/input/fileUpload";

const ImageCard = ({previewImage, handleImageUpload})=>{
    return(
        <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            <FileUploader previewImage={previewImage} onChange={handleImageUpload} submit={handleImageUpload} />
          </Typography>
        </CardContent>
        <CardMedia component="img" height="100%" image={previewImage} alt="No image selectedt" />
      </Card>
    );
}

export default ImageCard;