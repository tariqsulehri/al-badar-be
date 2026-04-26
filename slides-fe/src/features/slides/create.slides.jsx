import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SlideDetail from "../slides/components/cards/slideDetail.component";
import ImageCard from "../slides/components/cards/imageCard.component";
import { getAllProvencsForSelection } from "../../services/apis/config/provService";
import { getAllCitiesForSelection } from "../../services/apis/config/cityService";
import { getAllAreasForSelection } from "../../services/apis/config/areaService";
import { getAllSubAreasForSelection } from "../../services/apis/config/subAreaService";
import { getAllSuppliersForSelection } from "../../services/apis/partyService";
import { lights, category, mediaTypes, dimension, status } from "../../constant/data";
import { createSlide, getSlideById, updateSlide } from "../../services/apis/slideService";
import { API_BASE_URL } from "../../config/constants";
import CustomButton from "../../components/form-controls/buttons/customButton";
import { showToastNotification } from "../../helpers/notificationsHepler";
import "./create.slides.css";

const emptyObject = {
  code: "",
  supplier: "",
  provence: "",
  city: "",
  area: "",
  subArea: "",
  mediaType: "",
  height_feets: "",
  width_feets: "",
  location_from: "",
  location_to: "",
  smd_screen: "",
  no_of_steamers: "",
  working_hrs_day: "",
  ad_duration: "",
  no_of_spots: "",
  rate_per_week: "0",
  trafic_facing_coming: "",
  facing_trafic_going: "",
  category: "",
  dimension: "",
  lights: "",
  supQuotedPrice: "",
  supDiscountedPrice: "",
  supFinalPrice: "",
  quotedPrice: "",
  discountedPrice: "",
  finalPrice: "",
  latitude: "",
  longitude: "",
  eyeBall: "",
  status: "",
  is_active: true,
  image: "",
};

const CreateSlide = () => {
  const navigate = useNavigate();
  const id = useSelector((state) => state.slide.slideId || null);
  const [provences, setProvences] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [subAreas, setSubAreas] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(id?.payload);
  const uploadEndpoint = `${API_BASE_URL.replace(/\/+$/, "")}/slides/upload`;

  const fetchSelections = async () => {
    try {
      const [provencesResp, citiesResp, areasResp, subAreasResp, suppliersResp] = await Promise.all([
        getAllProvencsForSelection(),
        getAllCitiesForSelection(),
        getAllAreasForSelection(),
        getAllSubAreasForSelection(),
        getAllSuppliersForSelection(),
      ]);

      setProvences(provencesResp);
      setCities(citiesResp);
      setAreas(areasResp);
      setSubAreas(subAreasResp);
      setSuppliers(suppliersResp);
    } catch (error) {
      showToastNotification("error", "Failed to load selection data");
    }
  };

  useEffect(() => {
    fetchSelections();
  }, []);

  useEffect(() => {
    const fetchSlide = async () => {
      setIsLoading(true);

      try {
        const slideId = id?.payload;

        if (slideId) {
          const slideData = await getSlideById(slideId);
          setFormData({ ...emptyObject, ...slideData });
        } else {
          setFormData(emptyObject);
        }
      } catch (error) {
        showToastNotification("error", "Failed to fetch slide details");
        setFormData(emptyObject);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlide();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeSelect = (event, values, controlName) => {
    setFormData((prevData) => ({
      ...prevData,
      [controlName]: values?.label || "",
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (isEditing) {
        await updateSlide(id.payload, formData);
        showToastNotification("success", "Slide updated successfully");
      } else {
        await createSlide(formData);
        showToastNotification("success", "Slide created successfully");
      }

      navigate("/slides/list");
    } catch (error) {
      showToastNotification("error", "Failed to save slide");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setFormData({ ...emptyObject });
    showToastNotification("info", "Form reset to empty state");
  };

  const handleBack = () => {
    navigate("/slides/list");
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files?.[0];

      if (!file) {
        showToastNotification("warning", "Please select a file");
        return;
      }

      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        showToastNotification("error", "Please upload a valid image file (JPEG, PNG, GIF)");
        return;
      }

      const fileFormData = new FormData();
      fileFormData.append("image", file);

      const result = await axios.post(uploadEndpoint, fileFormData, {
        headers: { "Content-Type": "multipart/form-data", "x-auth-token": "token" },
      });

      if (result.data?.file) {
        setFormData((prevData) => ({
          ...prevData,
          image: result.data.file,
        }));
        showToastNotification("success", "Image uploaded successfully");
      } else {
        showToastNotification("error", "Image upload failed");
      }
    } catch (error) {
      showToastNotification("error", "Failed to upload image");
    }
  };

  if (isLoading && !formData) {
    return (
      <div className="slide-editor__loading page-card">
        <div>
          <h2>Loading slide editor</h2>
          <p>Preparing fields, media options, and location metadata.</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="slide-editor__empty page-card">
        <div>
          <h2>No slide data available</h2>
          <p>The editor could not load the slide record.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="slide-editor page-section">
      <header className="slide-editor__hero page-card">
        <div>
          <span className="page-header__eyebrow">{isEditing ? "Edit Mode" : "Content Studio"}</span>
          <h1>{isEditing ? "Refine slide details with confidence." : "Create a polished slide entry."}</h1>
          <p>
            Organize inventory, media specifications, pricing, and geography in a structured
            workflow designed for faster scanning and cleaner data entry.
          </p>
        </div>

        <div className="slide-editor__hero-actions">
          <CustomButton id="back" name="back" label="Back to List" handleClick={handleBack} />
          <CustomButton id="reset" name="reset" label="Reset Form" handleClick={handleRefresh} variant="outlined" />
          <CustomButton
            id="save-top"
            name="save-top"
            label={isEditing ? "Update Slide" : "Save Slide"}
            handleClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </header>

      <div className="slide-editor__quickstats">
        <article className="page-card slide-editor__stat">
          <span>Entry type</span>
          <strong>{formData.mediaType || "Choose media type"}</strong>
        </article>
        <article className="page-card slide-editor__stat">
          <span>Location stack</span>
          <strong>{[formData.provence, formData.city, formData.area].filter(Boolean).join(" / ") || "Not set yet"}</strong>
        </article>
        <article className="page-card slide-editor__stat">
          <span>Pricing status</span>
          <strong>{formData.finalPrice || formData.supFinalPrice || "Pending"}</strong>
        </article>
      </div>

      <div className="slide-editor__workspace">
        <div className="slide-editor__main">
          <SlideDetail
            formData={formData}
            suppliers={suppliers}
            provences={provences}
            cities={cities}
            areas={areas}
            subAreas={subAreas}
            lights={lights}
            category={category}
            mediaTypes={mediaTypes}
            dimension={dimension}
            status={status}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleRefresh={handleRefresh}
            handleChangeSelect={handleChangeSelect}
            isEditing={isEditing}
            isLoading={isLoading}
          />
        </div>

        <aside className="slide-editor__side">
          <ImageCard previewImage={formData.image} handleImageUpload={handleImageUpload} />
        </aside>
      </div>
    </section>
  );
};

export default CreateSlide;
