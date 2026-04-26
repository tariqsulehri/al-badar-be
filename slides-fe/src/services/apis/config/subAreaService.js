import httpClient from "../../axios";
import { showToastNotification } from "../../../helpers/notificationsHepler";

export const getAllSubAreasForSelection = async () => {
  try {
    const { data } = await httpClient.get("/subarea/list_for_select");
    return data || [];
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return [];
  }
};

export const getAllSubArea = async (rowsPerPage, pageNo, searchBy, searchText) => {
  try {
    const { data } = await httpClient.get(
      `/subarea/list?pageSize=${rowsPerPage}&pageNo=${pageNo}&searchBy=${searchBy}&searchText=${searchText}`
    );
    return data || { data: [], totalRecords: 0 };
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return { data: [], totalRecords: 0 };
  }
};

export const findSubAreaById = async (id) => {
  try {
    const resp = await httpClient.get(`/subarea/find/${id}`);
    return resp?.data?.result || null;
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return null;
  }
};

export const createSubArea = async (data) => {
  try {
    const res = await httpClient.post("/subarea/create", { data });
    return res.data?.result || null;
  } catch (error) {
    showToastNotification("error", "Something Went wrong");
    throw error;
  }
};

export const updateSubArea = async (id, data) => {
  try {
    if (!id) throw new Error("Invalid id");
    const res = await httpClient.post(`/subarea/update/${id}`, { data });
    return res.data?.result || true;
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    throw error;
  }
};

export const deleteSubArea = async (id) => {
  try {
    if (!id) throw new Error("Invalid id");
    await httpClient.get(`/subarea/delete/${id}`);
    return true;
  } catch (error) {
    showToastNotification("error", "Something Went wrong");
    throw error;
  }
};
