import React from "react";
import PropTypes from "prop-types";
import FileUploader from "../../../../components/form-controls/input/fileUpload";

const tips = [
  "Use a high-resolution street-facing image for cleaner previews.",
  "Landscape images work best for billboards and large-format placements.",
  "Upload the final reference image before saving the slide record.",
];

const ImageCard = ({ previewImage, handleImageUpload }) => {
  return (
    <div className="page-card p-6 flex flex-col gap-4">
      <div className="border-b border-border-soft pb-3">
        <h2 className="text-lg font-bold text-text-primary">Visual Preview</h2>
        <p className="text-xs text-text-secondary mt-1">
          Add the reference image for this slide so the record feels complete and easier to review.
        </p>
      </div>

      <div className="slide-image-card__upload">
        <FileUploader onChange={handleImageUpload} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-soft bg-bg-surface-strong min-h-[220px] flex items-center justify-center">
        {previewImage ? (
          <img src={previewImage} alt="Slide preview" className="w-full h-auto object-cover max-h-[360px]" />
        ) : (
          <div className="text-center p-6">
            <strong className="block text-sm font-semibold text-text-primary">No preview uploaded</strong>
            <span className="text-xs text-text-muted mt-1 block">
              The selected image will appear here once uploaded.
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 pt-2">
        {tips.map((tip) => (
          <div
            key={tip}
            className="text-xs text-text-muted p-2.5 rounded-xl border border-border-soft bg-bg-surface-strong/50"
          >
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
};

ImageCard.propTypes = {
  previewImage: PropTypes.string,
  handleImageUpload: PropTypes.func,
};

export default ImageCard;
