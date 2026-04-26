import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL
});


// const httpClient = axios.create({
//   baseURL: "http://localhost:3500/api"
// });

let token = "token"; 

httpClient.interceptors.request.use(
  config => {
    // const token = JSON.parse(localStorage.getItem('persist:root')).token;
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['x-auth-token'] = `${token}`;
    return config;
  },
  error => {
    Promise.reject(error)
  }
);
export default httpClient;