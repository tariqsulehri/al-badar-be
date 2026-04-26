import { useEffect } from "react";
import { Card, CardContent, CardActions, Grid } from "@mui/material";
import Select from "../../../components/form-controls/select/Select"; //"../../components/form-controls/select/Select";
import InputField from "../../../components/form-controls/input/textfield";
import CustomButton from "../../../components/form-controls/buttons/customButton";

const PartyDetail = function ({ formData, provences, cities, partyTypes, handleChange, handleSubmit, handleRefresh, handleChangeSelect }) {
  useEffect(() => {
  }, [formData]);

  if (!provences && !cities) {
    return (
      <>
        <h1>Loading Data</h1>
      </>
    );
  }

  return (
    <>
      <Card style={{ marginRight: "1em" }}>
        {/* <CardHeader title="Blog Title" subheader="Blog Subtitle" /> */}
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputField
                id="name"
                name="name"
                value={formData.name}
                defaultValue={formData.name}
                placeholder="Party name"
                required={true}
                label="Party Name"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={4}>
              <Select
                id="partyType"
                name="partyType"
                value={formData.partyType}
                defaultValue={formData.partyType}
                onChange={(event, values) => {
                  handleChangeSelect(event, values, "partyType");
                }}
                options={partyTypes}
                label={"Party type "}
                width={"100%"}
              />
            </Grid>
            <Grid item xs={4}>
              <Select
                id="provence"
                name="provence"
                value={formData.provence}
                defaultValue={formData.provence}
                onChange={(event, values) => {
                  handleChangeSelect(event, values, "provence");
                }}
                options={provences}
                label={"provence "}
                width={"100%"}
              />
            </Grid>
            <Grid item xs={4}>
              <Select
                name="city"
                value={formData.city}
                defaultValue={formData.city}
                onChange={(event, values) => {
                  handleChangeSelect(event, values, "city");
                }}
                options={cities}
                label={"City "}
                width={"100%"}
              />
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                defaultValue={formData.phoneNo}
                placeholder="Part Contact Number"
                required={true}
                label="Party Contact Number"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="cellNo"
                name="cellNo"
                value={formData.cellNo}
                defaultValue={formData.cellNo}
                placeholder="Party cell number"
                required={true}
                label="Party Cell Number"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="email"
                name="email"
                value={formData.email}
                defaultValue={formData.email}
                placeholder="Party email"
                required={true}
                label="Party Email Address"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="fax"
                name="fax"
                value={formData.fax}
                defaultValue={formData.fax}
                placeholder="Fax Number"
                required={true}
                label="Fax Number"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                defaultValue={formData.contactPerson}
                placeholder="Contact person"
                required={true}
                label="Contact Person"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="contactPersonEmail"
                name="contactPersonEmail"
                value={formData.contactPersonEmail}
                defaultValue={formData.contactPersonEmail}
                placeholder="Contact person email address"
                required={true}
                label="Contact Person Email"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="ntn"
                name="ntn"
                value={formData.ntn}
                defaultValue={formData.ntn}
                placeholder="National tax number (NTN)"
                required={true}
                label="NTN"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={3}>
              <InputField
                id="gst"
                name="gst"
                value={formData.gst}
                defaultValue={formData.gst}
                placeholder="Sales Tax number (GST) "
                required={true}
                label="GST Number"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={5}>
              <InputField
                id="bankName"
                name="bankName"
                value={formData.bankName}
                defaultValue={formData.bankName}
                placeholder="Bank Name"
                required={true}
                label="Bank Name"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="gl_code"
                name="gl_code"
                value={formData.gl_code}
                defaultValue={formData.gl_code}
                placeholder="Internal Ledger Code"
                required={true}
                label="GL Code Internal"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={8}>
              <InputField
                id="address"
                name="address"
                value={formData.address}
                defaultValue={formData.address}
                placeholder="Party detailed address"
                required={true}
                label="Party Address"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <InputField
                id="remarks_internal"
                name="remarks_internal"
                value={formData.remarks_internal}
                defaultValue={formData.remarks_internal}
                placeholder="Internal Remarks"
                required={true}
                label="Remarks Internal"
                width={"100%"}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions disableSpacing>
          <CustomButton id="new" name="new" label="Create" handleClick={handleRefresh} />
          <CustomButton id="save" name="save" label="Save" handleClick={handleSubmit} />
        </CardActions>
      </Card>
    </>
  );
};

export default PartyDetail;
