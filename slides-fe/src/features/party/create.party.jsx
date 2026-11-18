import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { ChevronLeftIcon, RefreshIcon } from "../../components/icons";
import PartyDetail from "./components/partyDetail.component";
import { getAllProvencsForSelection } from "../../services/apis/config/provService";
import { getAllCitiesForSelection } from "../../services/apis/config/cityService";
import { partyTypes } from "../../constant/data";

import { createParty, findPartyById, updateParty } from "../../services/apis/partyService";

// Blank party form.
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

const CreateParty = () => {
  // The party being edited comes from the URL (/party/create?id=…), so the
  // sidebar's "Create party" link always opens a blank form.
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);


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
    } catch {
      // partyService/lookup services already show an error toast.
    }
  };

  const getCities = async () => {
    try {
      let resp = await getAllCitiesForSelection();
      await setCities(resp);
    } catch {
      // partyService/lookup services already show an error toast.
    }
  };

  const fillPartyObject = async (data) => {
    try {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...data, // Overwrite with new data from the API
      }));
    } catch {
      // partyService/lookup services already show an error toast.
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
          const party = await findPartyById(id);
          if (party) await fillPartyObject(party);
        } else {
          // Switched from editing to "Create party" on the same route: start blank.
          setFormData(emptyObject);
        }
      } catch {
      // partyService/lookup services already show an error toast.
    }
    };

    fetchParty();
  }, [id]); // Runs when `id` changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      // Services show their own success/error toasts; go back to the list on success.
      const ok = id ? await updateParty(id, formData) : await createParty(formData);
      if (ok) navigate("/party/list");
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setFormData({ ...formData, ...emptyObject });
  };

  const handleChangeSelect = async (event, values, controlName) => {
    setFormData({ ...formData, [`${controlName}`]: values.label });
  };

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        title={id ? "Edit party" : "Create party"}
        meta={id ? formData.name || null : "Supplier or client details"}
        actions={
          <>
            <button type="button" className="ui-btn" onClick={() => navigate("/party/list")}>
              <ChevronLeftIcon fontSize="small" /> Back to parties
            </button>
            {!id && (
              <button type="button" className="ui-btn" onClick={handleRefresh}>
                <RefreshIcon fontSize="small" /> Clear form
              </button>
            )}
          </>
        }
      />
      <div className="max-w-4xl">
       <PartyDetail
          formData={formData}
          provences={provences}
          cities={cities}
          partyTypes={partyTypes}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleChangeSelect={handleChangeSelect}
          saving={saving}
          isEditing={Boolean(id)}
        />
      </div>
    </section>
  );
};

export default CreateParty;
