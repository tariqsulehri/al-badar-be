import createLookupApi from "./lookupApi";

const api = createLookupApi("city");

export const getAllCitiesForSelection = api.listForSelect;
export const getAllCity = api.list;
export const findCityById = api.findById;
export const createCity = api.create;
export const updateCity = api.update;
export const deleteCity = api.remove;
