import axios from "axios";

// Base-URL: .env bevorzugt, sonst Fallback zu localhost:5001
const base =
  process.env.REACT_APP_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:5001/api`;

export const api = axios.create({
  baseURL: base,
  timeout: 10000,
});

export const listCustomers   = () => api.get("/customers").then(r => r.data);
export const createCustomer  = (data) => api.post("/customers", data).then(r => r.data);
export const updateCustomer  = (id, data) => api.put(`/customers/${id}`, data).then(r => r.data);
export const deleteCustomer  = (id) => api.delete(`/customers/${id}`).then(r => r.data);