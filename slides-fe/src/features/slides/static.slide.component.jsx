import React from "react";
import InputField from "../form/input/textfield";
import Row from "../layout/row";

function StaticSlide({ formData, handleChange }) {
  return (
    <Row>
      <InputField
        id="height_feets"
        name="height_feets"
        defaultValue={formData.height_feets}
        placeholder="Enter Height"
        required={true}
        label="Height"
        width={180}
        onChange={(e) => handleChange(e)}
      />

      <InputField
        id="width_feets"
        name="width_feets"
        defaultValue={formData.width_feets}
        placeholder="Enter width"
        required={true}
        label="Width"
        width={180}
        onChange={(e) => handleChange(e)}
      />
    </Row>
  );
}

export default StaticSlide;
