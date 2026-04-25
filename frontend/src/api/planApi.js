import { axiosInstance } from "./axios";

export const getPlans = async () => {
  const response = await axiosInstance.get("/plans");
  return response.data;
};