import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/deals";

export async function createDeal(deal) {
  const response = await axios.post(API_BASE_URL, deal);
  return response.data;
}

export async function getDeals() {
  const response = await axios.get(API_BASE_URL);
  return response.data;
}

export async function analyzeDeal(id) {
  const response = await axios.post(`${API_BASE_URL}/${id}/analyze`);
  return response.data;
}