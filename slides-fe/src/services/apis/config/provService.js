import httpClient from "../../axios";
import { showToastNotification } from "../../../helpers/notificationsHepler";

export const getAllProvencsForSelection = async () => {
  try {
    const { data } = await httpClient.get("/provence/list_for_select");
    return data || [];
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return [];
  }
};

export const getAllProv = async (rowsPerPage, pageNo, searchBy, searchText) => {
  try {
    const { data } = await httpClient.get(
      `/provence/list?pageSize=${rowsPerPage}&pageNo=${pageNo}&searchBy=${searchBy}&searchText=${searchText}`
    );
    return data || { data: [], totalRecords: 0 };
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return { data: [], totalRecords: 0 };
  }
};

export const findProvById = async (id) => {
  try {
    const resp = await httpClient.get(`/provence/find/${id}`);
    return resp?.data?.result || null;
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return null;
  }
};

export const createProv = async (data) => {
  try {
    const res = await httpClient.post("/provence/create", { data });
    return res.data?.result || null;
  } catch (error) {
    showToastNotification("error", "Something Went wrong");
    throw error;
  }
};

export const updateProv = async (id, data) => {
  try {
    if (!id) throw new Error("Invalid id");
    const res = await httpClient.post(`/provence/update/${id}`, { data });
    return res.data?.result || true;
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    throw error;
  }
};

export const deleteProv = async (id) => {
  try {
    if (!id) throw new Error("Invalid id");
    await httpClient.get(`/provence/delete/${id}`);
    return true;
  } catch (error) {
    showToastNotification("error", "Something Went wrong");
    throw error;
  }
};
