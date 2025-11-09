import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Order Management
export const getOrderHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/orders/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getOrderDetails = async (orderId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const rateOrder = async (orderId, rating, feedback) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/orders/${orderId}/rate`, 
    { rating, feedback },
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};

// Address Management
export const getSavedAddresses = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/users/addresses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addNewAddress = async (addressData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/users/addresses`,
    addressData,
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};

export const updateAddress = async (addressId, addressData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/users/addresses/${addressId}`,
    addressData,
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};

export const deleteAddress = async (addressId) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/users/addresses/${addressId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Profile Management
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/users/profile`,
    profileData,
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};

export const updatePassword = async (passwordData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/users/password`,
    passwordData,
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};