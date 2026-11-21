import httpClient, { unwrap } from "../axios";
import { showToastNotification } from "../../helpers/notificationsHepler";

const EXPORT_PAGE_SIZE = 5000;

export const getAllSlides = async (
  limit = 10,
  page = 1,
  searchBy = "code",
  searchText = "",
  filters = {},
  sortBy = "code",
  sortOrder = "asc"
) => {
  const response = await httpClient.get("/slides/list", {
    params: {
      pageSize: limit,
      pageNo: page,
      searchBy,
      searchText,
      filters: JSON.stringify(filters || {}),
      sortBy,
      sortOrder,
    },
  });
  const result = unwrap(response);
  return { data: result?.data || [], totalRecords: result?.totalRecords || 0 };
};

/** Fetches every slide matching the search (used for PPTX export / bulk selection). */
export const getSlidesBySearch = async (
  searchBy = "code",
  searchText = "",
  totalRecords = 0,
  filters = {},
  sortBy = "code",
  sortOrder = "asc"
) => {
  const recordCount =
    totalRecords || (await getAllSlides(1, 1, searchBy, searchText, filters, sortBy, sortOrder)).totalRecords;
  if (!recordCount) return [];

  const totalPages = Math.ceil(recordCount / EXPORT_PAGE_SIZE);
  const pages = await Promise.all(
    Array.from({ length: totalPages }, (_, index) =>
      getAllSlides(EXPORT_PAGE_SIZE, index + 1, searchBy, searchText, filters, sortBy, sortOrder)
    )
  );
  return pages.flatMap((pageResult) => pageResult.data);
};

export const getSlideById = async (id) => unwrap(await httpClient.get(`/slides/find/${id}`));

export const createSlide = async (slideData) => {
  const result = unwrap(await httpClient.post("/slides/create", { data: slideData }));
  showToastNotification("success", "Slide created successfully.");
  return result;
};

export const updateSlide = async (id, slideData) => {
  const result = unwrap(await httpClient.post(`/slides/update/${id}`, { data: slideData }));
  showToastNotification("success", "Slide updated successfully.");
  return result;
};

export const deleteSlide = async (id) => {
  await httpClient.delete(`/slides/delete/${id}`);
  showToastNotification("success", "Slide deleted successfully.");
};

/** Uploads one image file; resolves to its public URL. */
export const uploadSlideImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  // axios sets the multipart Content-Type (with boundary) for FormData automatically.
  const result = unwrap(await httpClient.post("/slides/upload", formData));
  return result?.file;
};
