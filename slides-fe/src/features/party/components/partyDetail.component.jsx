import React from "react";
import PropTypes from "prop-types";
import Select from "../../../components/form-controls/select/Select";
import InputField from "../../../components/form-controls/input/textfield";
import CustomButton from "../../../components/form-controls/buttons/customButton";

const PartyDetail = function ({
  formData = {},
  provences,
  cities,
  partyTypes,
  handleChange,
  handleSubmit,
  handleChangeSelect,
  saving = false,
  isEditing = false,
}) {
  if (!provences && !cities) {
    return <h1 className="text-xl font-bold p-6 text-text-primary">Loading Data...</h1>;
  }

  return (
    <div className="rounded-2xl border border-border-soft bg-bg-surface p-6 shadow-soft">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <InputField
            id="name"
            name="name"
            value={formData.name ?? ""}
            placeholder="Party name"
            required
            label="Party Name"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <Select
            id="partyType"
            name="partyType"
            value={formData.partyType ?? ""}
            onChange={(event, values) => handleChangeSelect(event, values, "partyType")}
            options={partyTypes}
            label="Party Type"
            width="100%"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <Select
            id="provence"
            name="provence"
            value={formData.provence ?? ""}
            onChange={(event, values) => handleChangeSelect(event, values, "provence")}
            options={provences}
            label="Province"
            width="100%"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <Select
            name="city"
            value={formData.city ?? ""}
            onChange={(event, values) => handleChangeSelect(event, values, "city")}
            options={cities}
            label="City"
            width="100%"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <InputField
            id="phoneNo"
            name="phoneNo"
            value={formData.phoneNo ?? ""}
            placeholder="Party Contact Number"
            required
            label="Party Contact Number"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <InputField
            id="cellNo"
            name="cellNo"
            value={formData.cellNo ?? ""}
            placeholder="Party cell number"
            required
            label="Party Cell Number"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <InputField
            id="email"
            name="email"
            value={formData.email ?? ""}
            placeholder="Party email"
            required
            label="Party Email Address"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <InputField
            id="fax"
            name="fax"
            value={formData.fax ?? ""}
            placeholder="Fax Number"
            required
            label="Fax Number"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <InputField
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson ?? ""}
            placeholder="Contact person"
            required
            label="Contact Person"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <InputField
            id="contactPersonEmail"
            name="contactPersonEmail"
            value={formData.contactPersonEmail ?? ""}
            placeholder="Contact person email address"
            required
            label="Contact Person Email"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <InputField
            id="ntn"
            name="ntn"
            value={formData.ntn ?? ""}
            placeholder="National tax number (NTN)"
            required
            label="NTN"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <InputField
            id="gst"
            name="gst"
            value={formData.gst ?? ""}
            placeholder="Sales Tax number (GST)"
            required
            label="GST Number"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12 md:col-span-5">
          <InputField
            id="bankName"
            name="bankName"
            value={formData.bankName ?? ""}
            placeholder="Bank Name"
            required
            label="Bank Name"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <InputField
            id="gl_code"
            name="gl_code"
            value={formData.gl_code ?? ""}
            placeholder="Internal Ledger Code"
            required
            label="GL Code Internal"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12 md:col-span-8">
          <InputField
            id="address"
            name="address"
            value={formData.address ?? ""}
            placeholder="Party detailed address"
            required
            label="Party Address"
            width="100%"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-12">
          <InputField
            id="remarks_internal"
            name="remarks_internal"
            value={formData.remarks_internal ?? ""}
            placeholder="Internal Remarks"
            required
            label="Remarks Internal"
            width="100%"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border-soft">
        <CustomButton
          id="save"
          name="save"
          label={saving ? "Saving…" : isEditing ? "Save changes" : "Create party"}
          handleClick={handleSubmit}
          disabled={saving}
        />
      </div>
    </div>
  );
};

PartyDetail.propTypes = {
  formData: PropTypes.object,
  provences: PropTypes.array,
  cities: PropTypes.array,
  partyTypes: PropTypes.array,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  saving: PropTypes.bool,
  isEditing: PropTypes.bool,
  handleChangeSelect: PropTypes.func,
};

export default PartyDetail;
