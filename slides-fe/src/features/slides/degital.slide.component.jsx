import React from "react";
import PropTypes from "prop-types";
import InputField from "../../components/form-controls/input/textfield";

function DigitalSlide({ formData = {}, handleChange }) {
  return (
    <>
      <div className="col-span-12 md:col-span-4">
        <InputField
          id="location_from"
          name="location_from"
          defaultValue={formData.location_from}
          placeholder="Location from"
          required
          label="Location From"
          width="100%"
          onChange={handleChange}
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <InputField
          id="location_to"
          name="location_to"
          defaultValue={formData.location_to}
          placeholder="Location to"
          required
          label="Location To"
          width="100%"
          onChange={handleChange}
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <InputField
          id="smd_screen"
          name="smd_screen"
          defaultValue={formData.smd_screen}
          placeholder="SMD screen"
          required
          label="SMD Screen"
          width="100%"
          onChange={handleChange}
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <InputField
          id="no_of_steamers"
          name="no_of_steamers"
          type="number"
          defaultValue={formData.no_of_steamers}
          placeholder="No of steamers"
          required
          label="No. of Steamers"
          width="100%"
          onChange={handleChange}
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <InputField
          id="working_hrs_day"
          name="working_hrs_day"
          type="number"
          defaultValue={formData.working_hrs_day}
          placeholder="Working hrs a day"
          required
          label="Working Hours a Day"
          width="100%"
          onChange={handleChange}
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <InputField
          id="ad_duration"
          name="ad_duration"
          defaultValue={formData.ad_duration}
          placeholder="Ad Duration"
          required
          label="Ad Duration"
          width="100%"
          onChange={handleChange}
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <InputField
          id="no_of_spots"
          name="no_of_spots"
          type="number"
          defaultValue={formData.no_of_spots}
          placeholder="No of Spots"
          required
          label="No. of Spots"
          width="100%"
          onChange={handleChange}
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <InputField
          id="rate_per_week"
          name="rate_per_week"
          type="number"
          defaultValue={formData.rate_per_week}
          placeholder="Rate per week"
          required
          label="Rate per Week"
          width="100%"
          onChange={handleChange}
        />
      </div>
    </>
  );
}

DigitalSlide.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
};

export default DigitalSlide;
