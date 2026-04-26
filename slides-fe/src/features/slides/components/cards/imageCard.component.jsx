import { Card } from "@mui/material";
import FileUploader from "../../../../components/form-controls/input/fileUpload";

const tips = [
  "Use a high-resolution street-facing image for cleaner previews.",
  "Landscape images work best for billboards and large-format placements.",
  "Upload the final reference image before saving the slide record.",
];

const ImageCard = ({ previewImage, handleImageUpload }) => {
  return (
    <Card className="page-card slide-image-card" elevation={0}>
      <div className="slide-image-card__header">
        <h2>Visual Preview</h2>
        <p>
          Add the reference image for this slide so the record feels complete and easier to review.
        </p>
      </div>

      <div className="slide-image-card__upload">
        <FileUploader onChange={handleImageUpload} />
      </div>

      <div className="slide-image-card__preview">
        {previewImage ? (
          <img src={previewImage} alt="Slide preview" />
        ) : (
          <div className="slide-image-card__placeholder">
            <div>
              <strong>No preview uploaded</strong>
              <span>The selected image will appear here once uploaded.</span>
            </div>
          </div>
        )}
      </div>

      <div className="slide-image-card__tips">
        {tips.map((tip) => (
          <div key={tip} className="slide-image-card__tip">
            {tip}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ImageCard;
