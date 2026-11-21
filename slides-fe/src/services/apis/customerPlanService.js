import httpClient, { unwrap, errorMessage } from "../axios";
import { showToastNotification } from "../../helpers/notificationsHepler";

const EMPTY_PAGE = { data: [], totalRecords: 0 };

const notifyError = (error) => showToastNotification("error", errorMessage(error));

/** `pageIndex` is 0-based; API is 1-based. */
export const getAllCustomerPlans = async (rowsPerPage = 10, pageIndex = 0, searchText = "") => {
  try {
    const response = await httpClient.get("/customer-plan/list", {
      params: { pageSize: rowsPerPage, pageNo: pageIndex + 1, searchText },
    });
    return unwrap(response) || EMPTY_PAGE;
  } catch (error) {
    notifyError(error);
    return EMPTY_PAGE;
  }
};

export const getNextSerialNumber = async () => {
  try {
    const response = await httpClient.get("/customer-plan/next-serial");
    return unwrap(response);
  } catch (error) {
    notifyError(error);
    return null;
  }
};

export const findCustomerPlanById = async (id) => {
  try {
    return unwrap(await httpClient.get(`/customer-plan/find/${id}`)) || null;
  } catch (error) {
    notifyError(error);
    return null;
  }
};

export const createCustomerPlan = async (data) => {
  try {
    const plan = unwrap(await httpClient.post("/customer-plan/create", { data }));
    showToastNotification("success", `Customer Plan ${plan.serial_number} created successfully.`);
    return plan;
  } catch (error) {
    notifyError(error);
    return null;
  }
};

export const updateCustomerPlan = async (id, data) => {
  try {
    if (!id) throw new Error("Invalid id");
    const plan = unwrap(await httpClient.post(`/customer-plan/update/${id}`, { data }));
    showToastNotification("success", "Customer Plan updated successfully.");
    return plan;
  } catch (error) {
    notifyError(error);
    return null;
  }
};

export const deleteCustomerPlan = async (id) => {
  try {
    if (!id) throw new Error("Invalid id");
    await httpClient.delete(`/customer-plan/delete/${id}`);
    showToastNotification("success", "Customer Plan deleted successfully.");
    return true;
  } catch (error) {
    notifyError(error);
    return false;
  }
};
