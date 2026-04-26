import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/form-controls/buttons/customButton";
import DataTableComponent from "./components/table/selected.slides.datatable";
import { clearSlides } from "./slice/slidesForPptxSlice";
import pptxHelper from "./components/helpers/pptxHelper";
import PptxGenJS from "pptxgenjs";
import { showToastNotification } from "../../helpers/notificationsHepler";

const columns = [
  { 
    name: "_id", 
    label: "_ID",
    options: {
      display: false,
      filter: false,
      sort: false
    }
  },
  { name: "provence", label: "Provence" },
  { name: "city", label: "City" },
  { name: "area", label: "Area" },
  { name: "supplier", label: "Supplier" },
  { name: "mediaType", label: "Media" },
  { name: "dimension", label: "Dimension" },
  { name: "height_feets", label: "Height" },
  { name: "width_feets", label: "Width" },
  { name: "no_of_steamers", label: "Steamers" },
  { name: "working_hrs_day", label: "Work-Hrs" },
  { name: "lights", label: "Lights" },
  { name: "supQuotedPrice", label: "SQ-Price" },
  { name: "supDiscountedPrice", label: "SD-Price" },
  { name: "finalPrice", label: "CF-Price" },
  { name: "status", label: "Status" },
];

const SelectedSlideList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const slides = useSelector((state) => state.slidesForPptx.slidesForPptx);
  const hasSlides = slides.length > 0;

  const handleCreatePptx = async () => {
    if (!hasSlides) {
      showToastNotification("warning", "No slides selected");
      return;
    }
    try {
      const pptx = new PptxGenJS();
      await pptxHelper.createPptx(pptx, slides);
      await pptx.writeFile("selected_slides.pptx");
      dispatch(clearSlides());
      showToastNotification("success", "PPTX generated and selected slides reset");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleBackToList = () => {
    navigate('/slides/list');
  };

  const handleResetSelectedSlides = () => {
    if (!hasSlides) {
      showToastNotification("info", "No selected slides to reset");
      return;
    }

    dispatch(clearSlides());
    showToastNotification("success", "Selected slides reset");
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomButton
          id="createPptx"
          name="createPptx"
          label="Generate PPTX"
          handleClick={handleCreatePptx}
          disabled={!hasSlides}
        />
        <CustomButton
          id="backToList"
          name="backToList"
          label="Back to List"
          handleClick={handleBackToList}
          variant="outlined"
        />
        <CustomButton
          id="resetSelectedSlides"
          name="resetSelectedSlides"
          label="Reset Selected"
          handleClick={handleResetSelectedSlides}
          variant="outlined"
          color="warning"
        />
      </div>
      {hasSlides ? (
        <DataTableComponent 
          data={slides} 
          columns={columns} 
          options={{
            setTableProps: () => ({
              style: {
                fontSize: '0.875rem' // Medium font size
              }
            }),
            setRowProps: () => ({
              style: {
                fontSize: '0.875rem' // Medium font size
              }
            })
          }}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '28px 16px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No Slides Selected</h2>
          <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
            Select slides from the list first, then use the Generate PPTX button here.
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectedSlideList;
