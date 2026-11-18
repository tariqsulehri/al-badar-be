import createLookupApi from "./lookupApi";

const api = createLookupApi("subarea");

export const getAllSubAreasForSelection = api.listForSelect;
export const getAllSubArea = api.list;
export const findSubAreaById = api.findById;
export const createSubArea = api.create;
export const updateSubArea = api.update;
export const deleteSubArea = api.remove;
