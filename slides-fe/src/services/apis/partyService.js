import httpClient, { unwrap, errorMessage } from "../axios";
import { showToastNotification } from "../../helpers/notificationsHepler";

const EMPTY_PAGE = { data: [], totalRecords: 0 };

const notifyError = (error) => showToastNotification("error", errorMessage(error));

/** `pageIndex` is 0-based (table pagination); the API is 1-based. */
export const getAllParties = async (rowsPerPage, pageIndex = 0, searchBy = "name", searchText = "") => {
  try {
    const response = await httpClient.get("/party/list", {
      params: { pageSize: rowsPerPage, pageNo: pageIndex + 1, searchBy, searchText },
    });
    return unwrap(response) || EMPTY_PAGE;
  } catch (error) {
    notifyError(error);
    return EMPTY_PAGE;
  }
};

export const getAllSuppliersForSelection = async () => {
  try {
    return unwrap(await httpClient.get("/party/suppliers/list_for_select")) || [];
  } catch (error) {
    notifyError(error);
    return [];
  }
};

/** Resolves to the party, or null if it couldn't be loaded. */
export const findPartyById = async (id) => {
  try {
    return unwrap(await httpClient.get(`/party/find/${id}`)) || null;
  } catch (error) {
    notifyError(error);
    return null;
  }
};

export const createParty = async (data) => {
  try {
    const party = unwrap(await httpClient.post("/party/create", { data }));
    showToastNotification("success", "Party created successfully.");
    return party;
  } catch (error) {
    notifyError(error);
    return null;
  }
};

export const updateParty = async (id, data) => {
  try {
    if (!id) throw new Error("Invalid id");
    await httpClient.post(`/party/update/${id}`, { data });
    showToastNotification("success", "Party updated successfully.");
    return true;
  } catch (error) {
    notifyError(error);
    return false;
  }
};

export const deleteParty = async (id) => {
  try {
    if (!id) throw new Error("Invalid id");
    await httpClient.delete(`/party/delete/${id}`);
    showToastNotification("success", "Party deleted successfully.");
    return true;
  } catch (error) {
    notifyError(error);
    return false;
  }
};
