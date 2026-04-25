import React, { useState } from 'react';
import { DollarSign, CreditCard, Download, Filter } from 'lucide-react';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { useData } from '../contexts/DataContext';

const Payments = () => {
  const { data, loading } = useData();
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPayments = data.payments.filter(
    payment => statusFilter === 'All' || payment.status === statusFilter
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      header: 'Invoice',
      render: (row) => (
        <span className="font-semibold text-primary-600 dark:text-primary-400">
          {row.invoiceNumber}
        </span>
      )
    },
    {
      header: 'Member',
      accessor: 'memberName'
    },
    {
      header: 'Amount',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${row.amount.toFixed(2)}
        </span>
      )
    },
    {
      header: 'Plan',
      accessor: 'plan'
    },
    {
      header: 'Method',
      render: (row) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-400" />
          <span>{row.paymentMethod}</span>
        </div>
      )
    },
    {
      header: 'Date',
      render: (row) => new Date(row.date).toLocaleDateString()
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge ${
          row.status === 'Completed' ? 'badge-success' :
          row.status === 'Pending' ? 'badge-warning' :
          'badge-danger'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: () => (
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-50 rounded-lg transition-colors">
          <Download className="w-4 h-4 text-gray-600 dark:text-dark-600" />
        </button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const totalRevenue = data.payments.reduce((sum, p) => sum + p.amount, 0);
  const completedRevenue = data.payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Payments</h1>
        <p className="page-subtitle">Track all payment transactions and invoices</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Completed</p>
              <p className="text-3xl font-bold">${completedRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Pending</p>
              <p className="text-3xl font-bold">
                ${(totalRevenue - completedRevenue).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-field max-w-xs"
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card">
        <Table columns={columns} data={paginatedPayments} />
        {filteredPayments.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredPayments.length}
          />
        )}
      </div>
    </div>
  );
};

export default Payments;
