
// src/pages/admin/RentSchedule.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type RentScheduleItem = {
  month: string;
  dueDate: string;
  status: string;
};

export default function RentSchedule() {
  const [rents, setRents] = useState<RentScheduleItem[]>([]);

  useEffect(() => {
    const fetchRentSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/my-rent-schedules`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRents(res.data);
      } catch (err) {
        console.error("Failed to fetch rent schedules", err);
      }
    };

    fetchRentSchedules();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Rent Schedule</h1>
      <table className="w-full text-sm border">
        <thead className="bg-gray-50 text-left border-b">
          <tr>
            <th className="py-2 px-3">Month</th>
            <th className="py-2 px-3">Due Date</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rents.map((r, i) => (
            <tr key={i} className="border-b">
              <td className="py-2 px-3">{r.month}</td>
              <td className="py-2 px-3">{new Date(r.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</td>
              <td className={`py-2 px-3 ${r.status === "Paid" ? "text-green-600" : "text-yellow-600"}`}>
                {r.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}