import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DetailPanel, { DetailItem, DetailSection } from "../../../components/common/DetailPanel";
import { ModeEditOutlineIcon, PlanIcon } from "../../../components/icons";
import { formatAmount } from "../../../utils/format";
import StatusBadge from "../../../components/common/StatusBadge";
import { addSlidesToDraft } from "../../customerPlan/slice/customerPlanSlice";
import { showToastNotification } from "../../../helpers/notificationsHepler";

const SlideImage = ({ src, code }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="mb-6 grid h-40 place-items-center rounded-xl border border-dashed border-border-strong text-sm text-text-muted">
        No image for this slide
      </div>
    );
  }
  return (
    <a href={src} target="_blank" rel="noreferrer" className="mb-6 block overflow-hidden rounded-xl border border-border-soft">
      <img
        key={src}
        src={src}
        alt={`Slide ${code}`}
        onError={() => setFailed(true)}
        className="max-h-72 w-full bg-bg-canvas object-contain"
      />
    </a>
  );
};

SlideImage.propTypes = { src: PropTypes.string, code: PropTypes.string };

const SlideDetailPanel = ({ slide, isSelected, onToggleSelect, onEdit, onClose, onPrev, onNext, position }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!slide) return null;

  const size =
    slide.height_feets || slide.width_feets ? `${slide.height_feets || "?"} × ${slide.width_feets || "?"} ft` : null;

  const handleAddToPlan = () => {
    dispatch(addSlidesToDraft([slide]));
    showToastNotification("success", `Added ${slide.code} to Customer Plan`);
    navigate("/customer-plans/create");
  };

  return (
    <DetailPanel
      open
      title={slide.code || "Slide"}
      subtitle={[slide.subArea || slide.area, slide.city, slide.provence].filter(Boolean).join(" · ")}
      onClose={onClose}
      onPrev={onPrev}
      onNext={onNext}
      position={position}
      actions={
        <>
          <button
            type="button"
            onClick={onToggleSelect}
            className={`h-9 rounded-lg border px-3 text-[13px] font-medium transition-colors ${
              isSelected
                ? "border-brand bg-brand-muted text-brand-strong"
                : "border-border-soft text-text-primary hover:border-brand"
            }`}
          >
            {isSelected ? "✓ In PPTX queue" : "Add to PPTX"}
          </button>
          <button
            type="button"
            onClick={handleAddToPlan}
            className="flex h-9 items-center gap-1 rounded-lg border border-border-soft px-3 text-[13px] font-medium text-text-primary hover:border-brand transition-colors"
            title="Add this slide to Customer Media Plan"
          >
            <PlanIcon fontSize="small" /> + Plan
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-[13px] font-medium text-on-brand transition-colors hover:bg-brand-strong"
          >
            <ModeEditOutlineIcon fontSize="small" /> Edit
          </button>
        </>
      }
    >
      <SlideImage src={slide.image} code={slide.code} />

      <DetailSection title="Overview">
        <DetailItem label="Status" value={slide.status ? <StatusBadge status={slide.status} /> : null} />
        <DetailItem label="Supplier" value={slide.supplier} />
        <DetailItem label="Media type" value={slide.mediaType} />
        <DetailItem label="Category" value={slide.category} />
      </DetailSection>

      <DetailSection title="Location">
        <DetailItem label="Province" value={slide.provence} />
        <DetailItem label="City" value={slide.city} />
        <DetailItem label="Area" value={slide.area} />
        <DetailItem label="Sub-area" value={slide.subArea} />
        <DetailItem label="From" value={slide.location_from} />
        <DetailItem label="To" value={slide.location_to} />
        <DetailItem label="Traffic facing (coming)" value={slide.trafic_facing_coming} />
        <DetailItem label="Traffic facing (going)" value={slide.facing_trafic_going} />
        <DetailItem
          label="Coordinates"
          mono
          wide
          value={slide.latitude && slide.longitude ? `${slide.latitude}, ${slide.longitude}` : null}
        />
      </DetailSection>

      <DetailSection title="Specifications">
        <DetailItem label="Size (H × W)" value={size} mono />
        <DetailItem label="Dimension" value={slide.dimension} />
        <DetailItem label="Lights" value={slide.lights} />
        <DetailItem label="Eyeball" value={slide.eyeBall} />
        {slide.mediaType === "Digital" && (
          <>
            <DetailItem label="SMD screen" value={slide.smd_screen} />
            <DetailItem label="Streamers" value={slide.no_of_steamers} mono />
            <DetailItem label="Working hours / day" value={slide.working_hrs_day} mono />
            <DetailItem label="Ad duration" value={slide.ad_duration} mono />
            <DetailItem label="Spots" value={slide.no_of_spots} mono />
          </>
        )}
      </DetailSection>

      <DetailSection title="Pricing">
        <DetailItem label="Supplier quoted" value={formatAmount(slide.supQuotedPrice)} mono />
        <DetailItem label="Quoted to client" value={formatAmount(slide.quotedPrice)} mono />
        <DetailItem label="Supplier discounted" value={formatAmount(slide.supDiscountedPrice)} mono />
        <DetailItem label="Client discounted" value={formatAmount(slide.discountedPrice)} mono />
        <DetailItem label="Supplier final" value={formatAmount(slide.supFinalPrice)} mono />
        <DetailItem label="Client final" value={formatAmount(slide.finalPrice)} mono />
        <DetailItem label="Rate per week" value={formatAmount(slide.rate_per_week)} mono wide />
      </DetailSection>
    </DetailPanel>
  );
};

SlideDetailPanel.propTypes = {
  slide: PropTypes.object,
  isSelected: PropTypes.bool,
  onToggleSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  position: PropTypes.node,
};

export default SlideDetailPanel;
