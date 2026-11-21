import { createSlice } from "@reduxjs/toolkit";

export const convertSlideToPlanItem = (slide, index = 0) => {
  const width_feets = Number(slide.width_feets) || 0;
  const height_feets = Number(slide.height_feets) || 0;
  const sqft = width_feets * height_feets;

  const quotingMonthlyRent = Number(slide.quotedPrice) || 0;
  const discountedMonthlyRent =
    slide.discountedPrice !== undefined && slide.discountedPrice !== null && slide.discountedPrice !== ""
      ? Number(slide.discountedPrice)
      : quotingMonthlyRent;
  const discount = Math.max(0, quotingMonthlyRent - discountedMonthlyRent);
  const thirtyDaysRent = discountedMonthlyRent;
  const skinCost = 0;
  const grandTotal = thirtyDaysRent + skinCost;

  const locParts = [
    slide.location_from,
    slide.subArea && slide.subArea !== slide.location_from ? slide.subArea : null,
    slide.area && slide.area !== slide.subArea ? slide.area : null,
  ].filter(Boolean);
  const location =
    locParts.length > 0 ? locParts.join(", ") : slide.subArea || slide.area || slide.location_from || "";

  return {
    sr_no: index + 1,
    slide_id: slide._id,
    code: slide.code || "",
    city: slide.city || "",
    location,
    width_feets,
    height_feets,
    sqft,
    quotingMonthlyRent,
    discount,
    discountedMonthlyRent,
    thirtyDaysRent,
    skinCost,
    grandTotal,
    status: slide.status || "Available",
    mediaType: slide.mediaType || "",
    image: slide.image || "",
  };
};

const initialDraft = {
  _id: null,
  serial_number: "",
  plan_number: null,
  plan_date: new Date().toISOString().split("T")[0],
  title: "ABMS Outdoor Media Plan for Client",
  client_id: "",
  client_name: "",
  client_details: {
    partyType: "",
    city: "",
    phoneNo: "",
    email: "",
    contactPerson: "",
    address: "",
  },
  slides: [],
  notes: [
    "Rates and Availability should be mentioned in ppt",
    "Rates will be Change when we make the ppt",
    "Availability will be Change when we make the ppt",
  ],
  planStatus: "Draft",
};

const customerPlanSlice = createSlice({
  name: "customerPlan",
  initialState: {
    draft: { ...initialDraft },
    isEditing: false,
  },
  reducers: {
    // Sets initial draft slides from an array of slides (e.g. moved from SlideList or SelectedSlides)
    setDraftSlides: (state, { payload }) => {
      const slides = Array.isArray(payload) ? payload : [payload];
      state.draft.slides = slides.map((s, idx) => {
        // If it's already a plan item (has slide_id), preserve and re-index
        if (s.slide_id) {
          return { ...s, sr_no: idx + 1 };
        }
        return convertSlideToPlanItem(s, idx);
      });
    },

    // Adds slides to current draft (deduplicates by slide_id / _id)
    addSlidesToDraft: (state, { payload }) => {
      const incoming = Array.isArray(payload) ? payload : [payload];
      const existingIds = new Set(state.draft.slides.map((s) => String(s.slide_id || s._id)));

      const toAdd = incoming.filter((s) => !existingIds.has(String(s._id || s.slide_id)));
      const startIdx = state.draft.slides.length;
      const converted = toAdd.map((s, idx) =>
        s.slide_id ? { ...s, sr_no: startIdx + idx + 1 } : convertSlideToPlanItem(s, startIdx + idx)
      );

      state.draft.slides = [...state.draft.slides, ...converted];
    },

    removeSlideFromDraft: (state, { payload: slideId }) => {
      state.draft.slides = state.draft.slides
        .filter((s) => String(s.slide_id) !== String(slideId))
        .map((s, idx) => ({ ...s, sr_no: idx + 1 }));
    },

    updateSlideRow: (state, { payload: { index, field, value } }) => {
      const row = state.draft.slides[index];
      if (!row) return;

      const numVal = Number(value);

      if (field === "width_feets") {
        row.width_feets = isNaN(numVal) ? 0 : Math.max(0, numVal);
        row.sqft = row.width_feets * (row.height_feets || 0);
      } else if (field === "height_feets") {
        row.height_feets = isNaN(numVal) ? 0 : Math.max(0, numVal);
        row.sqft = (row.width_feets || 0) * row.height_feets;
      } else if (field === "quotingMonthlyRent") {
        row.quotingMonthlyRent = isNaN(numVal) ? 0 : Math.max(0, numVal);
        // Recalculate discounted rent if discount is set
        if (row.discount > 0) {
          row.discountedMonthlyRent = Math.max(0, row.quotingMonthlyRent - row.discount);
          row.thirtyDaysRent = row.discountedMonthlyRent;
        } else {
          row.discountedMonthlyRent = row.quotingMonthlyRent;
          row.thirtyDaysRent = row.quotingMonthlyRent;
        }
        row.grandTotal = (row.thirtyDaysRent || 0) + (row.skinCost || 0);
      } else if (field === "discount") {
        row.discount = isNaN(numVal) ? 0 : numVal;
        row.discountedMonthlyRent = Math.max(0, (row.quotingMonthlyRent || 0) - row.discount);
        row.thirtyDaysRent = row.discountedMonthlyRent;
        row.grandTotal = (row.thirtyDaysRent || 0) + (row.skinCost || 0);
      } else if (field === "discountedMonthlyRent") {
        row.discountedMonthlyRent = isNaN(numVal) ? 0 : Math.max(0, numVal);
        row.discount = Math.max(0, (row.quotingMonthlyRent || 0) - row.discountedMonthlyRent);
        row.thirtyDaysRent = row.discountedMonthlyRent;
        row.grandTotal = (row.thirtyDaysRent || 0) + (row.skinCost || 0);
      } else if (field === "thirtyDaysRent") {
        row.thirtyDaysRent = isNaN(numVal) ? 0 : Math.max(0, numVal);
        // Grand total automatically updates: 30 Days Rent + Skin Cost
        row.grandTotal = row.thirtyDaysRent + (row.skinCost || 0);
      } else if (field === "skinCost") {
        row.skinCost = isNaN(numVal) ? 0 : Math.max(0, numVal);
        // Grand total automatically updates: 30 Days Rent + Skin Cost
        row.grandTotal = (row.thirtyDaysRent || 0) + row.skinCost;
      } else if (field === "grandTotal") {
        // In case user manually overrides grand total
        row.grandTotal = isNaN(numVal) ? 0 : Math.max(0, numVal);
      } else {
        row[field] = value;
      }
    },

    setDraftClient: (state, { payload: client }) => {
      if (!client) {
        state.draft.client_id = "";
        state.draft.client_name = "";
        state.draft.client_details = {};
        state.draft.title = "ABMS Outdoor Media Plan for Client";
        return;
      }
      state.draft.client_id = client._id || client.value;
      state.draft.client_name = client.name || client.label;
      state.draft.client_details = {
        partyType: client.partyType || "",
        city: client.city || "",
        phoneNo: client.phoneNo || client.cellNo || "",
        email: client.email || "",
        contactPerson: client.contactPerson || "",
        address: client.address || "",
      };
      state.draft.title = `ABMS Outdoor Media Plan for ${client.name || client.label}`;
    },

    setDraftMetadata: (state, { payload: { field, value } }) => {
      state.draft[field] = value;
    },

    loadExistingPlan: (state, { payload: plan }) => {
      state.draft = {
        _id: plan._id,
        serial_number: plan.serial_number,
        plan_number: plan.plan_number,
        plan_date: plan.plan_date ? new Date(plan.plan_date).toISOString().split("T")[0] : "",
        title: plan.title || `ABMS Outdoor Media Plan for ${plan.client_name || "Client"}`,
        client_id: plan.client_id?._id || plan.client_id,
        client_name: plan.client_name,
        client_details: plan.client_details || {},
        slides: (plan.slides || []).map((s, idx) => ({ ...s, sr_no: idx + 1 })),
        notes: plan.notes || initialDraft.notes,
        planStatus: plan.planStatus || "Draft",
      };
      state.isEditing = true;
    },

    resetDraftPlan: (state) => {
      state.draft = { ...initialDraft, slides: [] };
      state.isEditing = false;
    },
  },
});

export const {
  setDraftSlides,
  addSlidesToDraft,
  removeSlideFromDraft,
  updateSlideRow,
  setDraftClient,
  setDraftMetadata,
  loadExistingPlan,
  resetDraftPlan,
} = customerPlanSlice.actions;

export default customerPlanSlice.reducer;
