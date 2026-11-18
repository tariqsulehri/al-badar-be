import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import { showToastNotification } from "../helpers/notificationsHepler";

/**
 * The one HTTP client for the API. Every service imports this.
 *
 * The store is injected from main.jsx (instead of imported here) to keep this
 * module free of a store -> slices -> services import cycle.
 */
const httpClient = axios.create({ baseURL: API_BASE_URL });

let store;
let onUnauthorized = () => {};

export const configureHttpClient = ({ store: appStore, onUnauthorized: handler }) => {
  store = appStore;
  onUnauthorized = handler;
};

httpClient.interceptors.request.use((config) => {
  const token = store?.getState()?.auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginRequest = error.config?.url?.startsWith("/auth");

    if (status === 401 && !isLoginRequest) {
      onUnauthorized();
    } else if (status === 403) {
      showToastNotification("error", "You don't have permission to do that.");
    }
    return Promise.reject(error);
  }
);

/** Unwraps the API envelope { status, message, result }. */
export const unwrap = (response) => response?.data?.result;

/** Best human-readable message from an API error. */
export const errorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallback;

export default httpClient;
