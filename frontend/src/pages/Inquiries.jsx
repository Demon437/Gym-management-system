import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';

const Inquiries = () => {
  const { data, fetchInquiries, inquiriesLoading } = useData();

  const inquiries = data.inquiries || [];

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Inquiries</h1>
        <p className="page-subtitle">
          All website contact form submissions
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Phone</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Service</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Message</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>

            <tbody>
              {inquiriesLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    Loading inquiries...
                  </td>
                </tr>
              ) : inquiries.length > 0 ? (
                inquiries.map((item) => (
                  <tr key={item._id} className="border-b last:border-b-0">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name || '--'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.email || '--'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.phone || '--'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.service || '--'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.message || '--'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('en-IN')
                        : '--'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No inquiries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inquiries;