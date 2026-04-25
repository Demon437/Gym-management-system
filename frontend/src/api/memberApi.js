import axiosInstance from "./axios";

export const getMembers = async () => {
  const response = await axiosInstance.get("/members");
  return response.data;
};

export const createMember = async (data) => {
  const response = await axiosInstance.post("/members", data);
  return response.data;
};

export const updateMember = async (id, data) => {
  const response = await axiosInstance.put(`/members/${id}`, data);
  return response.data;
};

export const deleteMember = async (id) => {
  const response = await axiosInstance.delete(`/members/${id}`);
  return response.data;
};