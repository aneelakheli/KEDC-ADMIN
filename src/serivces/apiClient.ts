import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization token here if needed
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const get = async (url: string, params?: Record<string, any>) => {
  const response = await apiClient.get(url, { params });
  return response.data;
};

export const post = async (url: string, data: Record<string, any>, isMultipart = false) => {
  let config: { headers?: Record<string, string> } = {};

  if (isMultipart) {
    const formData = new FormData();

    for (const key in data) {
      // if (key === 'image' && Array.isArray(data[key])) {
      //   // If data[key] is an array, iterate through each image file
      //   data[key].forEach((imageFile: File | Blob, index: number) => {
      //     formData.append(`image${index}`, imageFile);
      //   });
      // } else {
        // Handle non-image fields
        formData.append(key, data[key]);
      // }
    }

    data = formData;
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }

  try {
    const response = await apiClient.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error("Error during POST request:", error);
    throw error; // Re-throw the error to handle it upstream.
  }
};


export const put = async (url: string, data: Record<string, any>, isMultipart = false) => {
  let config = {};
  if (isMultipart) {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'image') {
        for (const [imageKey, imageFile] of Object.entries(data[key])) {
          formData.append(`image${imageKey}`, imageFile);
        }
      }
      else {
        formData.append(key, data[key]);
      }
    }
    data = formData;
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const response = await apiClient.put(url, data, config);
  return response.data;
};

export const patch = async (url: string, data: Record<string, any>, isMultipart = false) => {
  let config = {};
  if (isMultipart) {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'image') {
        for (const [imageKey, imageFile] of Object.entries(data[key])) {
          formData.append(`image${imageKey}`, imageFile);
        }
      }
      else {
        formData.append(key, data[key]);
      }
    }
    data = formData;
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const response = await apiClient.patch(url, data, config);
  return response.data;
};

export const del = async (url: string) => {
  const response = await apiClient.delete(url);
  return response.data;
};

export default apiClient;