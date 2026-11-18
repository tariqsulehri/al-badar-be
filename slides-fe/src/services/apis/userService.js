import httpClient, { unwrap } from "../axios";

/** Admin only. */
export const getUsers = async () => unwrap(await httpClient.get("/users/list")) || [];

/** Admin only. `data` = { username, email, password, role } */
export const createUser = async (data) => unwrap(await httpClient.post("/users/create", data));

/** Admin only. */
export const deleteUser = async (id) => {
  await httpClient.delete(`/users/delete/${id}`);
};
