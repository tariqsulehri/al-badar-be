import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../features/auth/slice/authSlice";
import areaSlice from "../features/config/area/slice/areaSlice";
import subAreaSlice from "../features/config/subarea/slice/subAreaSlice";
import citySlice from "../features/config/city/slice/citySlice";
import provSlice from "../features/config/provience/slice/provSlice";
import slidesForPptxSlice from "../features/slides/slice/slidesForPptxSlice";
import partySlice from "../features/party/slice/partySlice";

export default combineReducers({
    auth :  authSlice,
    area :  areaSlice,
    subArea :  subAreaSlice,
    city :  citySlice,
    prov :  provSlice,
    party : partySlice,
    slidesForPptx : slidesForPptxSlice,  // Add your other slices here...
});