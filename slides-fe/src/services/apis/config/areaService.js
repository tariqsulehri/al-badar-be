import httpClient from "../../axios";
import { showToastNotification } from "../../../helpers/notificationsHepler";

export const getAllAreasForSelection = async () => {
  try {
    const { data } = await httpClient.get("/area/list_for_select");
    return data || [];
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return [];
  }
};

export const getAllArea = async (rowsPerPage, pageNo, searchBy, searchText) => {
  try {
    const { data } = await httpClient.get(
      `/area/list?pageSize=${rowsPerPage}&pageNo=${pageNo}&searchBy=${searchBy}&searchText=${searchText}`
    );
    return data || { data: [], totalRecords: 0 };
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return { data: [], totalRecords: 0 };
  }
};

export const findAreaById = async (id) => {
  try {
    const resp = await httpClient.get(`/area/find/${id}`);
    return resp?.data?.result || null;
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return null;
  }
};

export const createArea = async (data) => {
  try {
    const res = await httpClient.post("/area/create", { data });
    return res.data?.result || null;
  } catch (error) {
    showToastNotification("error", "Something Went wrong");
    throw error;
  }
};

export const updateArea = async (id, data) => {
  try {
    if (!id) throw new Error("Invalid id");
    const res = await httpClient.post(`/area/update/${id}`, { data });
    return res.data?.result || true;
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    throw error;
  }
};

export const deleteArea = async (id) => {
  try {
    if (!id) throw new Error("Invalid id");
    await httpClient.get(`/area/delete/${id}`);
    return true;
  } catch (error) {
    showToastNotification("error", "Something Went wrong");
    throw error;
  }
};
