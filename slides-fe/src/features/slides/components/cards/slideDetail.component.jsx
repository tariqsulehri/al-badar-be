import { Card, Grid } from "@mui/material";
import Select from "../../../../components/form-controls/select/Select";
import InputField from "../../../../components/form-controls/input/textfield";
import CustomButton from "../../../../components/form-controls/buttons/customButton";
import DigitalSlide from "../../../../features/slides/degital.slide.component";

const SectionCard = ({ title, description, tag, children }) => (
  <Card className="page-card slide-editor__section" elevation={0}>
    <div className="slide-editor__section-header">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {tag ? <span className="slide-editor__section-tag">{tag}</span> : null}
    </div>
    {children}
  </Card>
);

const SlideDetail = ({
  formData,
  suppliers,
  provences,
  cities,
  areas,
  subAreas,
  lights,
  category,
  mediaTypes,
  dimension,
  status,
  handleChange,
  handleSubmit,
  handleRefresh,
  handleChangeSelect,
  isEditing,
  isLoading,
}) => {
  if (!formData) {
    return null;
  }

  return (
    <>
      <SectionCard
        title="Core identity"
        description="Define the inventory code, supplier mapping, and the location taxonomy for this slide."
        tag="Foundation"
      >
        <Grid container spacing={2.25}>
          <Grid item xs={12} md={6}>
            <InputField
              width="100%"
              id="code"
              name="code"
              value={formData.code || ""}
              placeholder="Code: xx-xx-xx-xx"
              required
              label="Slide Code"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              id="supplier"
              name="supplier"
              value={formData.supplier || null}
              onChange={(event, values) => handleChangeSelect(event, values, "supplier")}
              options={suppliers}
              label="Supplier"
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              id="provence"
              name="provence"
              value={formData.provence || null}
              onChange={(event, values) => handleChangeSelect(event, values, "provence")}
              options={provences}
              label="Provence"
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              name="city"
              value={formData.city || null}
              onChange={(event, values) => handleChangeSelect(event, values, "city")}
              options={cities}
              label="City"
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              name="area"
              value={formData.area || null}
              onChange={(event, values) => handleChangeSelect(event, values, "area")}
              options={areas}
              label="Area"
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              name="subArea"
              value={formData.subArea || null}
              onChange={(event, values) => handleChangeSelect(event, values, "subArea")}
              options={subAreas}
              label="Sub Area"
              width="100%"
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard
        title="Placement and format"
        description="Capture traffic direction, media format, dimensions, lighting, and operational availability."
        tag="Placement"
      >
        <Grid container spacing={2.25}>
          <Grid item xs={12} md={6}>
            <InputField
              id="trafic_facing_coming"
              name="trafic_facing_coming"
              value={formData.trafic_facing_coming || ""}
              placeholder="Facing traffic coming from"
              required
              label="Facing Traffic Coming From"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              id="facing_trafic_going"
              name="facing_trafic_going"
              value={formData.facing_trafic_going || ""}
              placeholder="Traffic going to"
              required
              label="Traffic Going To"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Select
              name="mediaType"
              value={formData.mediaType || null}
              onChange={(event, values) => handleChangeSelect(event, values, "mediaType")}
              options={mediaTypes}
              label="Media Type"
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Select
              name="category"
              value={formData.category || null}
              onChange={(event, values) => handleChangeSelect(event, values, "category")}
              options={category}
              label="Category"
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <InputField
              id="height_feets"
              name="height_feets"
              type="number"
              value={formData.height_feets || ""}
              placeholder="Height"
              required
              label="Height (ft)"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <InputField
              id="width_feets"
              name="width_feets"
              type="number"
              value={formData.width_feets || ""}
              placeholder="Width"
              required
              label="Width (ft)"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          {formData.mediaType === "Digital" && (
            <DigitalSlide handleChange={handleChange} formData={formData} />
          )}
          <Grid item xs={12} md={4}>
            <Select
              name="dimension"
              value={formData.dimension || null}
              onChange={(event, values) => handleChangeSelect(event, values, "dimension")}
              options={dimension}
              label="Dimension"
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Select
              name="lights"
              value={formData.lights || null}
              onChange={(event, values) => handleChangeSelect(event, values, "lights")}
              options={lights}
              label="Lights"
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Select
              name="status"
              value={formData.status || null}
              onChange={(event, values) => handleChangeSelect(event, values, "status")}
              options={status}
              label="Status"
              width="100%"
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard
        title="Commercial details"
        description="Track supplier pricing, customer pricing, and geographic visibility metrics."
        tag="Commercial"
      >
        <Grid container spacing={2.25}>
          <Grid item xs={12} md={4}>
            <InputField
              id="supQuotedPrice"
              name="supQuotedPrice"
              type="number"
              value={formData.supQuotedPrice || ""}
              placeholder="Supplier quoted price"
              required
              label="Supplier Quoted Price"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputField
              id="supDiscountedPrice"
              name="supDiscountedPrice"
              type="number"
              value={formData.supDiscountedPrice || ""}
              placeholder="Supplier discounted price"
              required
              label="Supplier Discounted Price"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputField
              id="supFinalPrice"
              name="supFinalPrice"
              type="number"
              value={formData.supFinalPrice || ""}
              placeholder="Supplier final price"
              required
              label="Supplier Final Price"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputField
              id="quotedPrice"
              name="quotedPrice"
              type="number"
              value={formData.quotedPrice || ""}
              placeholder="Customer quoted price"
              required
              label="Customer Quoted Price"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputField
              id="discountedPrice"
              name="discountedPrice"
              type="number"
              value={formData.discountedPrice || ""}
              placeholder="Customer discounted price"
              required
              label="Customer Discounted Price"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputField
              id="finalPrice"
              name="finalPrice"
              type="number"
              value={formData.finalPrice || ""}
              placeholder="Customer final price"
              required
              label="Customer Final Price"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputField
              id="latitude"
              name="latitude"
              type="number"
              value={formData.latitude || ""}
              placeholder="Latitude"
              required
              label="Geo Latitude"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputField
              id="longitude"
              name="longitude"
              type="number"
              value={formData.longitude || ""}
              placeholder="Longitude"
              required
              label="Geo Longitude"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputField
              id="eyeBall"
              name="eyeBall"
              type="number"
              value={formData.eyeBall || ""}
              placeholder="Eyeball value"
              required
              label="Eyeball View"
              width="100%"
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <div className="slide-editor__footer-actions">
          <CustomButton
            id="new"
            name="new"
            label="Clear Draft"
            handleClick={handleRefresh}
            variant="outlined"
          />
          <CustomButton
            id="save"
            name="save"
            label={isLoading ? "Saving..." : isEditing ? "Update Slide" : "Save Slide"}
            handleClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </SectionCard>
    </>
  );
};

export default SlideDetail;
