import httpClient, { unwrap, errorMessage } from "../../axios";
import { showToastNotification } from "../../../helpers/notificationsHepler";

const EMPTY_PAGE = { data: [], totalRecords: 0 };

const notifyError = (error) => showToastNotification("error", errorMessage(error));

/**
 * API calls for one name-only lookup resource (provence, city, area, subarea).
 * List screens use 0-based page indexes; the API is 1-based.
 */
const createLookupApi = (resource) => ({
  listForSelect: async () => {
    try {
      return unwrap(await httpClient.get(`/${resource}/list_for_select`)) || [];
    } catch (error) {
      notifyError(error);
      return [];
    }
  },

  list: async (rowsPerPage, pageIndex = 0, searchBy = "name", searchText = "") => {
    try {
      const response = await httpClient.get(`/${resource}/list`, {
        params: { pageSize: rowsPerPage, pageNo: pageIndex + 1, searchBy, searchText },
      });
      return unwrap(response) || EMPTY_PAGE;
    } catch (error) {
      notifyError(error);
      return EMPTY_PAGE;
    }
  },

  findById: async (id) => {
    try {
      return unwrap(await httpClient.get(`/${resource}/find/${id}`)) || null;
    } catch (error) {
      notifyError(error);
      return null;
    }
  },

  create: async (data) => {
    try {
      return unwrap(await httpClient.post(`/${resource}/create`, { data }));
    } catch (error) {
      notifyError(error);
      throw error;
    }
  },

  update: async (id, data) => {
    if (!id) throw new Error("Invalid id");
    try {
      return unwrap(await httpClient.post(`/${resource}/update/${id}`, { data })) || true;
    } catch (error) {
      notifyError(error);
      throw error;
    }
  },

  remove: async (id) => {
    if (!id) throw new Error("Invalid id");
    try {
      await httpClient.delete(`/${resource}/delete/${id}`);
      return true;
    } catch (error) {
      notifyError(error);
      throw error;
    }
  },
});

export default createLookupApi;
