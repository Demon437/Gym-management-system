import React, { useState } from 'react';
import { Check, Crown, Zap, Star, Trash2, Pencil, Plus, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const MembershipPlans = () => {
  const {
    data,
    loading,
    plansLoading,
    addMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan
  } = useData();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    duration: '1 Month',
    price: '',
    description: '',
    features: '',
    included: '',
    highlights: '',
    color: '#3B82F6'
  });

  const icons = {
    Basic: Zap,
    Standard: Star,
    Premium: Crown,
    Elite: Crown
  };

  const resetForm = () => {
    setFormData({
      name: '',
      duration: '1 Month',
      price: '',
      description: '',
      features: '',
      included: '',
      highlights: '',
      color: '#3B82F6'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const splitCommaValues = (value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.duration.trim() ||
      !formData.price ||
      !formData.description.trim()
    ) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      duration: formData.duration.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      features: splitCommaValues(formData.features),
      included: splitCommaValues(formData.included),
      highlights: splitCommaValues(formData.highlights),
      color: formData.color
    };

    try {
      setSubmitting(true);

      let result;

      if (editingId) {
        result = await updateMembershipPlan(editingId, payload);
      } else {
        result = await addMembershipPlan(payload);
      }

      if (result.success) {
        alert(editingId ? 'Plan updated successfully' : 'Plan added successfully');
        resetForm();
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setShowForm(true);

    setFormData({
      name: plan.name || '',
      duration: plan.duration || '1 Month',
      price: plan.price || '',
      description: plan.description || '',
      features: Array.isArray(plan.features) ? plan.features.join(', ') : '',
      included: Array.isArray(plan.included) ? plan.included.join(', ') : '',
      highlights: Array.isArray(plan.highlights) ? plan.highlights.join(', ') : '',
      color: plan.color || '#3B82F6'
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this plan?');
    if (!confirmDelete) return;

    const result = await deleteMembershipPlan(id);

    if (result.success) {
      alert('Plan deleted successfully');
    } else {
      alert(result.message || 'Failed to delete plan');
    }
  };

  if (loading || plansLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Membership Plans</h1>
          <p className="page-subtitle">
            Choose the perfect plan for your fitness journey
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Close Form' : 'Add Plan'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Membership Plan' : 'Add Membership Plan'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Basic / Standard / Premium"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="1 Month"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="2999"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleChange}
                placeholder="Choose Plan"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-2 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Write short description"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows="3"
                placeholder="Enter features separated by commas"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: Access to gym equipment, Locker facility, Basic workout plan
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Included Items
              </label>
              <textarea
                name="included"
                value={formData.included}
                onChange={handleChange}
                rows="3"
                placeholder="Enter included items separated by commas"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: Free diet chart, Steam bath, Trainer guidance
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlight Tags
              </label>
              <textarea
                name="highlights"
                value={formData.highlights}
                onChange={handleChange}
                rows="2"
                placeholder="Enter short tags separated by commas"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: Premium Access, Guided Routine, Member Favorite
              </p>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-60"
              >
                {submitting ? 'Saving...' : editingId ? 'Update Plan' : 'Save Plan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {data.membershipPlans?.length === 0 ? (
        <div className="card p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            No membership plans found
          </h3>
          <p className="text-gray-500 dark:text-dark-500 mt-2">
            Add membership plans from the admin dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.membershipPlans.map((plan) => {
            const Icon = icons[plan.name] || Star;
            const planColor = plan.color || '#3B82F6';

            return (
              <div
                key={plan._id}
                className="card p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col w-full h-auto"
                style={{ borderTop: `4px solid ${planColor}` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                  <Icon className="w-full h-full" style={{ color: planColor }} />
                </div>

                <div className="relative z-10 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${planColor}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: planColor }} />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-dark-500">
                          {plan.duration || '1 Month'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(plan)}
                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-all"
                        title="Edit Plan"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(plan._id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ₹{Number(plan.price || 0).toFixed(0)}
                      </span>
                      <span className="text-gray-500 dark:text-dark-500">/month</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-dark-600 mb-4">
                    {plan.description || 'No description available'}
                  </p>

                  {Array.isArray(plan.highlights) && plan.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {plan.highlights.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="space-y-3 mb-4">
                    {(plan.features || []).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-5 h-5 flex-shrink-0 text-green-500 mt-0.5" />
                        <span className="text-gray-700 dark:text-dark-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {Array.isArray(plan.included) && plan.included.length > 0 && (
                    <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-3">
                        Included
                      </p>

                      <ul className="space-y-2">
                        {plan.included.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 flex-shrink-0 text-green-500 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    type="button"
                    className="w-full py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg mt-auto"
                    style={{
                      backgroundColor: planColor,
                      color: 'white'
                    }}
                  >
                    {plan.buttonText || 'Choose Plan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MembershipPlans;