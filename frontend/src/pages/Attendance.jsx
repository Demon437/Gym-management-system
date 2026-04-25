import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Clock3, CalendarDays } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Attendance = () => {
  const {
    data,
    loading,
    attendanceLoading,
    addAttendance,
    checkOutAttendance,
    fetchAttendanceByDate
  } = useData();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [submittingId, setSubmittingId] = useState(null);

  const members = data.members || [];
  const attendance = data.attendance || [];
  const attendanceSummary = data.attendanceSummary || {
    todaysCheckins: 0,
    activeNow: 0,
    avgDuration: '0m'
  };

  useEffect(() => {
    fetchAttendanceByDate(selectedDate);
  }, [selectedDate]);

  const selectedDateRecords = useMemo(() => {
    return attendance.filter((item) => {
      if (!item?.date) return false;
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      return itemDate === selectedDate;
    });
  }, [attendance, selectedDate]);

  const getMemberName = (attendanceItem) => {
    if (attendanceItem?.member?.name) return attendanceItem.member.name;

    const foundMember = members.find(
      (member) =>
        member._id === attendanceItem.member || member.id === attendanceItem.member
    );

    return foundMember?.name || 'Unknown Member';
  };

  const getMemberAttendanceRecord = (memberId) => {
    return selectedDateRecords.find((record) => {
      const recordMemberId =
        typeof record.member === 'object' ? record.member?._id : record.member;
      return recordMemberId === memberId;
    });
  };

  const handleMarkPresent = async (memberId) => {
    try {
      setSubmittingId(memberId);

      const result = await addAttendance({
        member: memberId,
        date: selectedDate
      });

      if (!result?.success) {
        alert(result?.message || 'Failed to check in member');
      }
    } catch (error) {
      console.error('Attendance check-in error:', error);
      alert('Failed to check in member');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleCheckOut = async (memberId) => {
    try {
      setSubmittingId(memberId);

      const result = await checkOutAttendance(memberId, selectedDate);

      if (!result?.success) {
        alert(result?.message || 'Failed to check out member');
      }
    } catch (error) {
      console.error('Attendance check-out error:', error);
      alert('Failed to check out member');
    } finally {
      setSubmittingId(null);
    }
  };

  const getLiveDuration = (checkIn) => {
    if (!checkIn) return '--';

    const diffMs = new Date() - new Date(checkIn);
    const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${mins}m`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Checked-In':
        return 'bg-orange-100 text-orange-700';
      case 'Checked-Out':
        return 'bg-green-100 text-green-700';
      case 'Present':
        return 'bg-green-100 text-green-700';
      case 'Absent':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const todaysCheckins =
    attendanceSummary.todaysCheckins ??
    selectedDateRecords.filter(
      (item) => item.status === 'Checked-In' || item.status === 'Checked-Out'
    ).length;

  const activeNow =
    attendanceSummary.activeNow ??
    selectedDateRecords.filter((item) => item.status === 'Checked-In').length;

  const avgDuration = attendanceSummary.avgDuration || '0m';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Track daily member check-ins and activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Today's Check-ins</p>
            <h3 className="text-3xl font-bold text-gray-900">{todaysCheckins}</h3>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
            <Clock3 className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Now</p>
            <h3 className="text-3xl font-bold text-gray-900">{activeNow}</h3>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
            <CalendarDays className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg. Duration</p>
            <h3 className="text-3xl font-bold text-gray-900">{avgDuration}</h3>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 w-full md:w-[320px] outline-none"
          />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Mark Attendance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.length > 0 ? (
            members.map((member) => {
              const memberRecord = getMemberAttendanceRecord(member._id);
              const isCheckedIn =
                memberRecord?.status === 'Checked-In' ||
                (memberRecord?.status === 'Present' && !memberRecord?.checkOut);
              const isCheckedOut = memberRecord?.status === 'Checked-Out';

              return (
                <div
                  key={member._id}
                  className="border rounded-2xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">
                      {member.membershipPlan || 'No Plan'}
                    </p>
                    <p className="text-xs text-gray-400">{member.status || 'Unknown'}</p>
                  </div>

                  {!memberRecord ? (
                    <button
                      onClick={() => handleMarkPresent(member._id)}
                      disabled={submittingId === member._id}
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-green-500 text-white hover:bg-green-600"
                    >
                      {submittingId === member._id ? 'Saving...' : 'Mark Present'}
                    </button>
                  ) : isCheckedIn ? (
                    <button
                      onClick={() => handleCheckOut(member._id)}
                      disabled={submittingId === member._id}
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
                    >
                      {submittingId === member._id ? 'Saving...' : 'Check Out'}
                    </button>
                  ) : isCheckedOut ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
                    >
                      Completed
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
                    >
                      Marked
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No members available.</p>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Member</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Check In</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Check Out</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Duration</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>

            <tbody>
              {attendanceLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    Loading attendance...
                  </td>
                </tr>
              ) : selectedDateRecords.length > 0 ? (
                selectedDateRecords.map((item) => (
                  <tr key={item._id} className="border-b last:border-b-0">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getMemberName(item)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.checkIn
                        ? new Date(item.checkIn).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '--'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.checkOut
                        ? new Date(item.checkOut).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'In Progress'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.status === 'Checked-In' && !item.checkOut
                        ? getLiveDuration(item.checkIn)
                        : item.duration || '--'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No data available
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

export default Attendance;