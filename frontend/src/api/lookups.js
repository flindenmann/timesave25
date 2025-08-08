// frontend/src/api/lookups.js
import { api } from "./contracts"; // nutzt den gleichen Axios-Client (baseURL)

export const listEmployees = (q="") =>
  api.get("employees", { params: q ? { q } : {} }).then(r => r.data);

export const listCostcenters = (q="") =>
  api.get("costcenters", { params: q ? { q } : {} }).then(r => r.data);