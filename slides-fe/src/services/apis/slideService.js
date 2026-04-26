import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import { showToastNotification } from "../../helpers/notificationsHepler";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      showToastNotification("error", "Access denied. Admin privileges required.");
    }
    return Promise.reject(error);
  }
);

export const getAllSlides = async (limit = 10, page = 1, searchBy = 'code', searchText = '', filters = {}) => {
  try {
    console.log('Fetching slides with params:', { limit, page, searchBy, searchText, filters });
    const response = await api.get('/slides/list', {
      params: {
        pageSize: limit,
        pageNo: page,
        searchBy,
        searchText,
        filters: JSON.stringify(filters || {})
      }
    });
    
    const { result } = response.data;
    console.log('Raw API Response:', result);
    
    if (result && result.data) {
      return {
        data: result.data,
        totalRecords: result.totalRecords || 0
      };
    } else {
      console.log('No data in result');
      return {
        data: [],
        totalRecords: 0
      };
    }
  } catch (error) {
    console.error('Error fetching slides:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
};

export const getSlidesBySearch = async (searchBy = 'code', searchText = '', totalRecords = 0, filters = {}) => {
  try {
    const firstPage = await getAllSlides(1, 1, searchBy, searchText, filters);
    const recordCount = totalRecords || firstPage.totalRecords || 0;
    const pageSize = 5000;

    if (!recordCount) {
      return [];
    }

    const totalPages = Math.ceil(recordCount / pageSize);
    const pages = await Promise.all(
      Array.from({ length: totalPages }, (_, index) =>
        getAllSlides(pageSize, index + 1, searchBy, searchText, filters)
      )
    );

    return pages.flatMap((pageResult) => pageResult.data || []);
  } catch (error) {
    console.error('Error fetching slides by search:', error);
    throw error;
  }
};

export const getSlideById = async (id) => {
  try {
    const response = await api.get(`/slides/find/${id}`);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching slide:', error);
    throw error;
  }
};

export const createSlide = async (slideData) => {
  try {
    const response = await api.post('/slides/create', { data: slideData });
    showToastNotification("success", "Slide created successfully..");
    return response.data.result;
  } catch (error) {
    console.error('Error creating slide:', error);
    throw error;
  }
};

export const updateSlide = async (id, slideData) => {
  try {
    const response = await api.post(`/slides/update/${id}`, { data: slideData });
    showToastNotification("success", "Slide updated successfully..");
    return response.data.result;
  } catch (error) {
    console.error('Error updating slide:', error);
    throw error;
  }
};

export const deleteSlide = async (id) => {
  try {
    const response = await api.get(`/slides/delete/${id}`);
    showToastNotification("success", 'Slide deleted successfully.');
    return response.data.result;
  } catch (error) {
    console.error('Error deleting slide:', error);
    throw error;
  }
};
