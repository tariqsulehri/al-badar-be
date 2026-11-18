import createLookupApi from "./lookupApi";

const api = createLookupApi("area");

export const getAllAreasForSelection = api.listForSelect;
export const getAllArea = api.list;
export const findAreaById = api.findById;
export const createArea = api.create;
export const updateArea = api.update;
export const deleteArea = api.remove;
