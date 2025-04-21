export default function RentSchedule() {
    const rents = [
      { month: "March 2025", due: "Mar 01", status: "Paid" },
      { month: "April 2025", due: "Apr 01", status: "Paid" },
      { month: "May 2025", due: "May 01", status: "Pending" },
    ];
  
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
                <td className="py-2 px-3">{r.due}</td>
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
  