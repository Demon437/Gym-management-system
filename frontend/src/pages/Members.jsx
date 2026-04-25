import React, { useState, useMemo } from "react";
import { Plus, Search, Edit, Trash2, Filter, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import Table from "../components/Table";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import { useData } from "../contexts/DataContext";
import { useNotification } from "../contexts/NotificationContext";

const Members = () => {
  const {
    data,
    loading,
    membersLoading,
    addMember,
    updateMember,
    deleteMember,
  } = useData();

  const { showSuccess, showError } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const itemsPerPage = 10;

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("en-GB");
  };

  const normalizeDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getMemberStatus = (expiryDate) => {
    if (!expiryDate) return "Active";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = normalizeDate(expiryDate);
    return expiry < today ? "Expired" : "Active";
  };

  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    membershipPlan: "",
    age: "",
    gender: "Male",
    address: "",
    emergencyContact: "",
    joinDate: "",
    expiryDate: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const filteredMembers = useMemo(() => {
    return (data.members || []).filter((member) => {
      const matchesSearch =
        (member.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.phone || "").toLowerCase().includes(searchTerm.toLowerCase());

      const currentStatus = getMemberStatus(member.expiryDate);

      const matchesStatus =
        statusFilter === "All" || currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data.members, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const availablePlans = (data.membershipPlans || []).map((plan) => plan.name);

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        membershipPlan: member.membershipPlan || "",
        age: member.age || "",
        gender: member.gender || "Male",
        address: member.address || "",
        emergencyContact: member.emergencyContact || "",
        joinDate: member.joinDate
          ? new Date(member.joinDate).toISOString().split("T")[0]
          : "",
        expiryDate: member.expiryDate
          ? new Date(member.expiryDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setEditingMember(null);
      setFormData({
        ...initialFormState,
        membershipPlan: availablePlans[0] || "Basic",
        joinDate: new Date().toISOString().split("T")[0],
      });
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.membershipPlan
    ) {
      showError("Please fill all required fields");
      return;
    }

    if (!formData.joinDate) {
      showError("Please select join date");
      return;
    }

    const joinDateObj = normalizeDate(formData.joinDate);
    const expiryDateObj = formData.expiryDate
      ? normalizeDate(formData.expiryDate)
      : null;

    if (expiryDateObj && expiryDateObj < joinDateObj) {
      showError("Expiry date cannot be earlier than join date");
      return;
    }

    const payload = {
      ...formData,
      status: getMemberStatus(formData.expiryDate),
    };

    try {
      setSubmitting(true);

      let result;

      if (editingMember) {
        result = await updateMember(editingMember._id, payload);
      } else {
        result = await addMember(payload);
      }

      if (result?.success) {
        showSuccess(
          editingMember
            ? "Member updated successfully!"
            : "Member added successfully!",
        );
        handleCloseModal();
      } else {
        showError(result?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Member save error:", error);
      showError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      const result = await deleteMember(id);

      if (result?.success) {
        showSuccess("Member deleted successfully!");
      } else {
        showError(result?.message || "Failed to delete member");
      }
    } catch (error) {
      console.error("Delete member error:", error);
      showError("An error occurred. Please try again.");
    }
  };

  const getExportRows = () => {
    return filteredMembers.map((member, index) => ({
      srNo: index + 1,
      name: member.name || "-",
      email: member.email || "-",
      phone: member.phone || "-",
      plan: member.membershipPlan || "-",
      status: getMemberStatus(member.expiryDate),
      joinDate: formatDate(member.joinDate),
      expiryDate: formatDate(member.expiryDate),
      gender: member.gender || "-",
      age: member.age || "-",
      emergencyContact: member.emergencyContact || "-",
      address: member.address || "-",
    }));
  };

  const exportToPDF = () => {
    try {
      const rows = getExportRows();

      if (!rows.length) {
        showError("No members available to export");
        return;
      }

      const doc = new jsPDF("landscape");
      doc.setFontSize(16);
      doc.text("Gym Members Report", 14, 15);

      doc.setFontSize(10);
      doc.text(`Total Members: ${rows.length}`, 14, 22);
      doc.text(`Status Filter: ${statusFilter}`, 14, 28);

      autoTable(doc, {
        startY: 34,
        head: [
          [
            "Sr No",
            "Name",
            "Email",
            "Phone",
            "Plan",
            "Status",
            "Join Date",
            "Expiry Date",
            "Gender",
            "Age",
          ],
        ],
        body: rows.map((row) => [
          row.srNo,
          row.name,
          row.email,
          row.phone,
          row.plan,
          row.status,
          row.joinDate,
          row.expiryDate,
          row.gender,
          row.age,
        ]),
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [41, 128, 185],
        },
      });

      doc.save("members-report.pdf");
      showSuccess("PDF exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      showError("Failed to export PDF");
    }
  };

  const exportToExcel = () => {
    try {
      const rows = getExportRows();

      if (!rows.length) {
        showError("No members available to export");
        return;
      }

      const excelData = rows.map((row) => ({
        "Sr No": row.srNo,
        Name: row.name,
        Email: row.email,
        Phone: row.phone,
        Plan: row.plan,
        Status: row.status,
        "Join Date": row.joinDate,
        "Expiry Date": row.expiryDate,
        Gender: row.gender,
        Age: row.age,
        "Emergency Contact": row.emergencyContact,
        Address: row.address,
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);

      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 22 },
        { wch: 28 },
        { wch: 16 },
        { wch: 16 },
        { wch: 12 },
        { wch: 14 },
        { wch: 14 },
        { wch: 12 },
        { wch: 8 },
        { wch: 20 },
        { wch: 35 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

      XLSX.writeFile(workbook, "members-report.xlsx");
      showSuccess("Excel exported successfully!");
    } catch (error) {
      console.error("Excel export error:", error);
      showError("Failed to export Excel");
    }
  };

  const columns = [
    {
      header: "Member",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                row.name || "member",
              )}`
            }
            alt={row.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {row.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-dark-500">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Phone",
      accessor: "phone",
    },
    {
      header: "Plan",
      accessor: "membershipPlan",
      render: (row) => (
        <span
          className={`badge ${
            row.membershipPlan === "Premium"
              ? "badge-warning"
              : row.membershipPlan === "Standard"
                ? "badge-info"
                : "badge-success"
          }`}
        >
          {row.membershipPlan}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const currentStatus = getMemberStatus(row.expiryDate);

        return (
          <span
            className={`badge ${
              currentStatus === "Active" ? "badge-success" : "badge-danger"
            }`}
          >
            {currentStatus}
          </span>
        );
      },
    },
    {
      header: "Join Date",
      accessor: "joinDate",
      render: (row) => formatDate(row.joinDate),
    },
    {
      header: "Expiry Date",
      accessor: "expiryDate",
      render: (row) => formatDate(row.expiryDate),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading || membersLoading) {
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
          <h1 className="page-title">Members</h1>
          <p className="page-subtitle">
            Manage your gym members and their subscriptions
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="select-field"
            >
              <option>All</option>
              <option>Active</option>
              <option>Expired</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportToPDF}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              type="button"
              onClick={exportToExcel}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <Table columns={columns} data={paginatedMembers} />
        {filteredMembers.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredMembers.length}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMember ? "Edit Member" : "Add New Member"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input-field"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-field"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input-field"
                placeholder="+91XXXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="input-field"
                placeholder="25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="select-field"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Membership Plan *
              </label>
              <select
                value={formData.membershipPlan}
                onChange={(e) =>
                  setFormData({ ...formData, membershipPlan: e.target.value })
                }
                className="select-field"
                required
              >
                {availablePlans.length > 0 ? (
                  availablePlans.map((planName) => (
                    <option key={planName} value={planName}>
                      {planName}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Join Date *
              </label>
              <input
                type="date"
                required
                value={formData.joinDate}
                onChange={(e) => {
                  const newJoinDate = e.target.value;

                  setFormData((prev) => {
                    let updatedExpiryDate = prev.expiryDate;

                    if (
                      updatedExpiryDate &&
                      normalizeDate(updatedExpiryDate) <
                        normalizeDate(newJoinDate)
                    ) {
                      updatedExpiryDate = "";
                    }

                    return {
                      ...prev,
                      joinDate: newJoinDate,
                      expiryDate: updatedExpiryDate,
                    };
                  });
                }}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                min={formData.joinDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContact: e.target.value })
                }
                className="input-field"
                placeholder="+91XXXXXXXXXX"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="input-field"
                rows="3"
                placeholder="Full address"
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
                : editingMember
                  ? "Update Member"
                  : "Add Member"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Members;
