import { createNotification } from "../../helpers/notificationsHepler";
// import httpClient from "../axios";

// Temporary static authentication for development
const STATIC_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
  role: 'admin'
};

export const login = async ({username, password}) => {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 500));
try {
  if (username === STATIC_CREDENTIALS.username && password === STATIC_CREDENTIALS.password) {
    // Create a simple token with user info
    const token = btoa(JSON.stringify({
      username: STATIC_CREDENTIALS.username,
      role: STATIC_CREDENTIALS.role
    }));

    // Store token in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      username: STATIC_CREDENTIALS.username,
      role: STATIC_CREDENTIALS.role
    }));

    return {
      success: true,
        username: STATIC_CREDENTIALS.username,
        role: STATIC_CREDENTIALS.role
    };
  }
} catch (error) {
  throw new Error('Invalid credentials');
}
  

  
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};