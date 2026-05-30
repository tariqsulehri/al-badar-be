import httpClient from "../axios";
import { showToastNotification } from "../../helpers/notificationsHepler";

export const getAllUsers = async () => {
    try {
        const { data } = await httpClient.get("/users/list");
        return data;
    } catch (error) {
        showToastNotification("error", error.message);
    }
};

export const getUsers = async (params) => {
    try {
        const { data } = await httpClient.get("/users/list", { params });
        return data;
    } catch (error) {
        showToastNotification("error", error.message);
    }
};

export const createUser = async (data) => {
    try {
        const res = await httpClient.post("/users/create", { data });
        return res.data;
    } catch (error) {
        showToastNotification("error", error.message);
    }
};

export const deleteUser = async (id) => {
    try {
        await httpClient.delete(`/users/delete/${id}`);
    } catch (error) {
        showToastNotification("error", error.message);
    }
};

export const updateUser = async (id, data) => {
    try {
        await httpClient.put(`/users/update/${id}`, { data });
    } catch (error) {
        showToastNotification("error", error.message);
    }
};
