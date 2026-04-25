import { axiosInstance } from "./axios";

export const getAllClasses = async () => {
  const response = await axiosInstance.get("/classes");
  console.log("getAllClasses response:", response.data);
  return response.data.classes || [];
};

export const createClassApi = async (classData) => {
  const formData = new FormData();

  formData.append("name", classData.name || "");
  formData.append("trainerId", classData.trainerId || "");
  formData.append("trainer", classData.trainer || "");
  formData.append("schedule", classData.schedule || "");
  formData.append("duration", classData.duration || "");
  formData.append("capacity", classData.capacity || 0);
  formData.append("enrolled", classData.enrolled || 0);
  formData.append("description", classData.description || "");
  formData.append("level", classData.level || "Beginner");
  formData.append("status", classData.status || "Active");

  if (classData.image) {
    formData.append("image", classData.image);
  }

  const response = await axiosInstance.post("/classes", formData);
  return response.data.classItem;
};

export const updateClassApi = async (id, classData) => {
  const formData = new FormData();

  formData.append("name", classData.name || "");
  formData.append("trainerId", classData.trainerId || "");
  formData.append("trainer", classData.trainer || "");
  formData.append("schedule", classData.schedule || "");
  formData.append("duration", classData.duration || "");
  formData.append("capacity", classData.capacity || 0);
  formData.append("enrolled", classData.enrolled || 0);
  formData.append("description", classData.description || "");
  formData.append("level", classData.level || "Beginner");
  formData.append("status", classData.status || "Active");

  if (classData.image) {
    formData.append("image", classData.image);
  }

  const response = await axiosInstance.put(`/classes/${id}`, formData);
  return response.data.classItem;
};

export const deleteClassApi = async (id) => {
  const response = await axiosInstance.delete(`/classes/${id}`);
  return response.data;
};