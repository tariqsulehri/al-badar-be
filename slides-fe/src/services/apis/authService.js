import httpClient, { unwrap } from "../axios";

/**
 * Exchanges credentials for a JWT.
 * @param {{ username: string, password: string }} credentials username or email + password
 * @returns {Promise<{ token: string, user: { _id: string, username: string, email: string, role: string } }>}
 */
export const login = async ({ username, password }) => unwrap(await httpClient.post("/auth", { username, password }));

export const getMe = async () => unwrap(await httpClient.get("/users/me"));

export const changePassword = async ({ currentPassword, newPassword }) =>
  unwrap(await httpClient.post("/users/change-password", { currentPassword, newPassword }));
