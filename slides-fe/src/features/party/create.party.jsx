import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PartyDetail from "./components/partyDetail.component";
import { getAllProvencsForSelection } from "../../services/apis/config/provService";
import { getAllCitiesForSelection } from "../../services/apis/config/cityService";
import { partyTypes } from "../../constant/data";

import axios from "axios";
import { createParty, findPartyById, updateParty } from "../../services/apis/partyService";

const CreateParty = () => {
  let id = useSelector((state) => state.party.partyId|| null);
 
  id = id?.payload;

  const emptyObject = {
    partyType: "",
    name: "",
    provence: "",
    city: "",
    phoneNo: "",
    cellNo: "",
    email: "",
    website: "",
    fax: "",
    contactPerson: "",
    contactPersonEmail: "",
    address: "",
    ntn: "",
    gst: "",
    accountNumber: "",
    bankName: "",
    gl_code: "",
    remarks_internal: "",
    is_active: true,
  };

  let [provences, setProvences] = useState([]);
  let [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    partyType: "",
    name: "",
    provence: "",
    city: "",
    phoneNo: "",
    cellNo: "",
    email: "",
    website: "",
    fax: "",
    contactPerson: "",
    contactPersonEmail: "",
    address: "",
    ntn: "",
    gst: "",
    accountNumber: "",
    bankName: "",
    gl_code: "",
    remarks_internal: "",
    is_active: true,
  });

  const getProvences = async () => {
    try {
      let resp = await getAllProvencsForSelection();
      await setProvences(resp);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCities = async () => {
    try {
      let resp = await getAllCitiesForSelection();
      await setCities(resp);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fillPartyObject = async (data) => {
    try {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...data, // Overwrite with new data from the API
      }));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      await getProvences();
      await getCities();
    };
    fetchConfig();
  }, []); // Runs when `id` changes

  useEffect(() => {
    const fetchParty = async () => {
      try {
        if (id) {
          const resp = await findPartyById(id);
          await fillPartyObject(resp.result);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchParty();
  }, [id]); // Runs when `id` changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!id) {
      createParty(formData);
    } else {
      await updateParty(id, formData);
    }
  };

  const handleRefresh = async () => {
    setFormData({ ...formData, ...emptyObject });
  };

  const handleChangeSelect = async (event, values, controlName) => {
    setFormData({ ...formData, [`${controlName}`]: values.label });
    console.log(controlName);
  };

  return (
    <>
      <div
        style={{
          margin: "0 1%",
          display: "grid",
          gridTemplateColumns: "60%",
          // border: "1px solid #000",
          padding: "0.5em",
        }}
      >
       <PartyDetail
          formData={formData}
          provences={provences}
          cities={cities}
          partyTypes={partyTypes}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleRefresh={handleRefresh}
          handleChangeSelect={handleChangeSelect}
        />
      </div>
    </>
  );
};

export default CreateParty;
