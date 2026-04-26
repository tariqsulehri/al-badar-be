import httpClient from "../../axios";
import { showToastNotification } from "../../../helpers/notificationsHepler";

export const getAllCitiesForSelection = async () => {
  try {
    const { data } = await httpClient.get("/city/list_for_select");
    return data || [];
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return [];
  }
};

export const getAllCity = async (rowsPerPage, pageNo, searchBy, searchText) => {
  try {
    const { data } = await httpClient.get(
      `/city/list?pageSize=${rowsPerPage}&pageNo=${pageNo}&searchBy=${searchBy}&searchText=${searchText}`
    );
    return data || { data: [], totalRecords: 0 };
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return { data: [], totalRecords: 0 };
  }
};

export const findCityById = async (id) => {
  try {
    const resp = await httpClient.get(`/city/find/${id}`);
    return resp?.data?.result || null;
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    return null;
  }
};

export const createCity = async (data) => {
  try {
    const res = await httpClient.post("/city/create", { data });
    return res.data?.result || null;
  } catch (error) {
    showToastNotification("error", "Something Went wrong");
    throw error;
  }
};

export const updateCity = async (id, data) => {
  try {
    if (!id) throw new Error("Invalid id");
    const res = await httpClient.post(`/city/update/${id}`, { data });
    return res.data?.result || true;
  } catch (error) {
    showToastNotification("error", "Something Went wrong..");
    throw error;
  }
};

export const deleteCity = async (id) => {
  try {
    if (!id) throw new Error("Invalid id");
    await httpClient.get(`/city/delete/${id}`);
    return true;
  } catch (error) {
    showToastNotification("error", "Something Went wrong");
    throw error;
  }
};
