import createLookupApi from "./lookupApi";

const api = createLookupApi("provence");

export const getAllProvencsForSelection = api.listForSelect;
export const getAllProv = api.list;
export const findProvById = api.findById;
export const createProv = api.create;
export const updateProv = api.update;
export const deleteProv = api.remove;
