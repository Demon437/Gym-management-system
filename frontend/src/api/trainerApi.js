import { axiosInstance } from "./axios";

export const getAllTrainers = async () => {
  const response = await axiosInstance.get("/trainers");
  return response.data.trainers || [];
};

export const createTrainerApi = async (trainerData) => {
  const formData = new FormData();

  formData.append("name", trainerData.name || "");
  formData.append("email", trainerData.email || "");
  formData.append("phone", trainerData.phone || "");
  formData.append("specialization", trainerData.specialization || "");
  formData.append("experience", trainerData.experience || "");
  formData.append("status", trainerData.status || "Active");
  formData.append("rating", trainerData.rating || 0);
  formData.append("assignedMembers", trainerData.assignedMembers || 0);
  formData.append("sessionsCompleted", trainerData.sessionsCompleted || 0);
  formData.append("certifications", trainerData.certifications || "");
  formData.append("bio", trainerData.bio || "");

  if (trainerData.image) {
    formData.append("image", trainerData.image);
  }

  const response = await axiosInstance.post("/trainers", formData);
  return response.data.trainer;
};

export const updateTrainerApi = async (id, trainerData) => {
  const formData = new FormData();

  formData.append("name", trainerData.name || "");
  formData.append("email", trainerData.email || "");
  formData.append("phone", trainerData.phone || "");
  formData.append("specialization", trainerData.specialization || "");
  formData.append("experience", trainerData.experience || "");
  formData.append("status", trainerData.status || "Active");
  formData.append("rating", trainerData.rating || 0);
  formData.append("assignedMembers", trainerData.assignedMembers || 0);
  formData.append("sessionsCompleted", trainerData.sessionsCompleted || 0);
  formData.append("certifications", trainerData.certifications || "");
  formData.append("bio", trainerData.bio || "");

  if (trainerData.image) {
    formData.append("image", trainerData.image);
  }

  const response = await axiosInstance.patch(`/trainers/${id}`, formData);
  return response.data.trainer;
};

export const deleteTrainerApi = async (id) => {
  const response = await axiosInstance.delete(`/trainers/${id}`);
  return response.data;
};