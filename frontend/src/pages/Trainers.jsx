import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Star, Award, Mail, Phone } from "lucide-react";
import Modal from "../components/Modal";
import {
  getAllTrainers,
  createTrainerApi,
  updateTrainerApi,
  deleteTrainerApi,
} from "../api/trainerApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  experience: "",
  status: "Active",
  image: null,
  rating: "",
  assignedMembers: "",
  sessionsCompleted: "",
  certifications: "",
  bio: "",
};

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const data = await getAllTrainers();
      setTrainers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch trainers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleOpenModal = (trainer = null) => {
    if (trainer) {
      setEditingTrainer(trainer);
      setFormData({
        name: trainer.name || "",
        email: trainer.email || "",
        phone: trainer.phone || "",
        specialization: trainer.specialization || "",
        experience: trainer.experience || "",
        status: trainer.status || "Active",
        rating: trainer.rating || "",
        assignedMembers: trainer.assignedMembers || "",
        sessionsCompleted: trainer.sessionsCompleted || "",
        certifications: Array.isArray(trainer.certifications)
          ? trainer.certifications.join(", ")
          : trainer.certifications || "",
        bio: trainer.bio || "",
        image: null,
      });
    } else {
      setEditingTrainer(null);
      setFormData(initialForm);
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrainer(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name?.trim() || "",
      email: formData.email?.trim() || "",
      phone: formData.phone?.trim() || "",
      specialization: formData.specialization?.trim() || "",
      experience: formData.experience?.trim() || "",
      status: formData.status || "Active",
      rating: formData.rating || 0,
      assignedMembers: formData.assignedMembers || 0,
      sessionsCompleted: formData.sessionsCompleted || 0,
      certifications: formData.certifications || "",
      bio: formData.bio?.trim() || "",
      image: formData.image || null,
    };

    console.log("Final trainer payload:", payload);

    try {
      setSubmitting(true);

      if (editingTrainer) {
        await updateTrainerApi(editingTrainer._id, payload);
        alert("Trainer updated successfully");
      } else {
        await createTrainerApi(payload);
        alert("Trainer added successfully");
      }

      handleCloseModal();
      fetchTrainers();
    } catch (error) {
      console.error("Trainer save error:", error);
      console.error("Backend response:", error?.response?.data);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trainer?"
    );
    if (!confirmDelete) return;

    try {
      await deleteTrainerApi(id);
      alert("Trainer deleted successfully");
      fetchTrainers();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting");
    }
  };

  const getImageUrl = (path) => {
    if (!path) {
      return "https://ui-avatars.com/api/?name=Trainer&background=f3f4f6&color=111827";
    }

    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Trainers</h1>
          <p className="page-subtitle">
            Manage your gym trainers and their specializations
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Trainer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trainers.map((trainer) => (
          <div
            key={trainer._id}
            className="card group p-6 transition-all duration-300 hover:shadow-xl"
          >
            <div className="mb-4 flex items-start justify-between">
              <img
                src={getImageUrl(trainer.avatar || trainer.image)}
                alt={trainer.name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-gray-100"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(trainer)}
                  className="rounded-lg p-2 text-blue-600 opacity-0 transition-colors group-hover:opacity-100 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(trainer._id)}
                  className="rounded-lg p-2 text-red-600 opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{trainer.name}</h3>
                <p className="text-sm text-gray-600">{trainer.specialization}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(trainer.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {trainer.rating || 0}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-3">
                <div>
                  <p className="text-xs text-gray-500">Members</p>
                  <p className="text-lg font-bold text-gray-900">
                    {trainer.assignedMembers || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sessions</p>
                  <p className="text-lg font-bold text-gray-900">
                    {trainer.sessionsCompleted || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                <span>{trainer.experience} experience</span>
              </div>

              {trainer.certifications?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {trainer.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              )}

              {trainer.bio && (
                <p className="line-clamp-3 text-sm text-gray-600">{trainer.bio}</p>
              )}

              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {trainer.email}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {trainer.phone}
                </p>
              </div>

              <span
                className={`badge ${
                  trainer.status === "Active" ? "badge-success" : "badge-danger"
                }`}
              >
                {trainer.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTrainer ? "Edit Trainer" : "Add New Trainer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input-field"
              placeholder="Full Name"
            />

            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="input-field"
              placeholder="Email"
            />

            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="input-field"
              placeholder="Phone"
            />

            <input
              type="text"
              required
              value={formData.specialization}
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
              className="input-field"
              placeholder="Specialization"
            />

            <input
              type="text"
              required
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              className="input-field"
              placeholder="Experience (e.g. 5 years)"
            />

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="select-field"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
              className="input-field"
              placeholder="Rating"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Trainer Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image: e.target.files?.[0] || null,
                  })
                }
                className="input-field"
              />
            </div>

            <input
              type="number"
              value={formData.assignedMembers}
              onChange={(e) =>
                setFormData({ ...formData, assignedMembers: e.target.value })
              }
              className="input-field"
              placeholder="Assigned Members"
            />

            <input
              type="number"
              value={formData.sessionsCompleted}
              onChange={(e) =>
                setFormData({ ...formData, sessionsCompleted: e.target.value })
              }
              className="input-field"
              placeholder="Sessions Completed"
            />

            <div className="md:col-span-2">
              <input
                type="text"
                value={formData.certifications}
                onChange={(e) =>
                  setFormData({ ...formData, certifications: e.target.value })
                }
                className="input-field"
                placeholder="Certifications (comma separated)"
              />
            </div>

            <div className="md:col-span-2">
              <textarea
                rows="4"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="input-field"
                placeholder="Trainer bio"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting
                ? "Saving..."
                : editingTrainer
                ? "Update Trainer"
                : "Add Trainer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Trainers;