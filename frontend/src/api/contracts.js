import axios from "axios";

const base =
  process.env.REACT_APP_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:5001/api`;

export const api = axios.create({ baseURL: base, timeout: 15000 });

// Contracts
export const listContracts   = (params={}) => api.get("/contracts", { params }).then(r => r.data);
export const getContract     = (id) => api.get(`/contracts/${id}`).then(r => r.data);
export const createContract  = (data) => api.post("/contracts", data).then(r => r.data);
export const updateContract  = (id, data) => api.put(`/contracts/${id}`, data).then(r => r.data);
export const deleteContract  = (id) => api.delete(`/contracts/${id}`).then(r => r.data);

// Contract Positions
export const listContractPos   = (params={}) => api.get("/contractpos", { params }).then(r => r.data);
export const createContractPos = (data) => api.post("/contractpos", data).then(r => r.data);
export const updateContractPos = (id, data) => api.put(`/contractpos/${id}`, data).then(r => r.data);
export const deleteContractPos = (id) => api.delete(`/contractpos/${id}`).then(r => r.data);
