import React, { useState } from 'react';
import { Plus, Users, Clock, Calendar, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';

const Classes = () => {
  const {
    data,
    loading,
    classesLoading,
    trainersLoading,
    addClass,
    updateClass,
    deleteClass
  } = useData();

  const { showSuccess, showError } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = {
    name: '',
    trainerId: '',
    trainer: '',
    schedule: '',
    duration: '',
    capacity: '',
    enrolled: 0,
    description: '',
    level: 'Beginner',
    status: 'Active'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenModal = (classItem = null) => {
    if (classItem) {
      setEditingClass(classItem);
      setFormData({
        name: classItem.name || '',
        trainerId: classItem.trainerId || '',
        trainer: classItem.trainer || '',
        schedule: classItem.schedule || '',
        duration: classItem.duration || '',
        capacity: classItem.capacity || '',
        enrolled: classItem.enrolled || 0,
        description: classItem.description || '',
        level: classItem.level || 'Beginner',
        status: classItem.status || 'Active'
      });
    } else {
      setEditingClass(null);
      setFormData(initialFormState);
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.trainerId ||
      !formData.schedule.trim() ||
      !formData.duration.trim() ||
      !formData.capacity
    ) {
      showError('Please fill all required fields');
      return;
    }

    try {
      setSubmitting(true);

      const selectedTrainer = (data.trainers || []).find(
        (trainer) => trainer._id === formData.trainerId || trainer.id === formData.trainerId
      );

      const payload = {
        name: formData.name.trim(),
        trainerId: formData.trainerId,
        trainer: selectedTrainer?.name || formData.trainer || '',
        schedule: formData.schedule.trim(),
        duration: formData.duration.trim(),
        capacity: Number(formData.capacity),
        enrolled: Number(formData.enrolled || 0),
        description: formData.description.trim(),
        level: formData.level,
        status: formData.status
      };

      let result;

      if (editingClass) {
        result = await updateClass(editingClass._id, payload);
      } else {
        result = await addClass(payload);
      }

      if (result?.success) {
        showSuccess(
          editingClass ? 'Class updated successfully!' : 'Class added successfully!'
        );
        handleCloseModal();
      } else {
        showError(result?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Class save error:', error);
      showError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      const result = await deleteClass(id);

      if (result?.success) {
        showSuccess('Class deleted successfully!');
      } else {
        showError(result?.message || 'Failed to delete class');
      }
    } catch (error) {
      console.error('Delete class error:', error);
      showError('An error occurred. Please try again.');
    }
  };

  if (loading || classesLoading || trainersLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Classes</h1>
          <p className="page-subtitle">Manage gym classes and schedules</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data.classes || []).map((classItem) => {
          const enrolled = Number(classItem.enrolled || 0);
          const capacity = Number(classItem.capacity || 0);
          const progress = capacity > 0 ? Math.min((enrolled / capacity) * 100, 100) : 0;

          return (
            <div
              key={classItem._id}
              className="card p-6 group hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-dark-700">
                    Trainer: {classItem.trainer || 'N/A'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(classItem)}
                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(classItem._id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-dark-600 mb-4">
                {classItem.description || 'No description available'}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-dark-700">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span>{classItem.schedule}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-dark-700">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span>{classItem.duration}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-dark-700">
                  <Users className="w-4 h-4 text-primary-500" />
                  <span>
                    {enrolled}/{capacity} enrolled
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="h-2 bg-gray-200 dark:bg-dark-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="badge badge-info">{classItem.level || 'Beginner'}</span>
                <span
                  className={`badge ${
                    classItem.status === 'Active' ? 'badge-success' : 'badge-warning'
                  }`}
                >
                  {classItem.status || 'Active'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClass ? 'Edit Class' : 'Add New Class'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Class Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Yoga Flow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Trainer *
              </label>
              <select
                required
                value={formData.trainerId}
                onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                className="select-field"
              >
                <option value="">Select Trainer</option>
                {(data.trainers || []).map((trainer) => (
                  <option key={trainer._id || trainer.id} value={trainer._id || trainer.id}>
                    {trainer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Schedule *
              </label>
              <input
                type="text"
                required
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="input-field"
                placeholder="Mon, Wed, Fri - 7:00 AM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-field"
                placeholder="60 minutes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="input-field"
                placeholder="20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Enrolled
              </label>
              <input
                type="number"
                value={formData.enrolled}
                onChange={(e) => setFormData({ ...formData, enrolled: e.target.value })}
                className="input-field"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="select-field"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>All Levels</option>
                <option>Beginner to Intermediate</option>
                <option>Intermediate to Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select-field"
              >
                <option>Active</option>
                <option>Full</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Class description..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingClass ? 'Update Class' : 'Add Class'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Classes;