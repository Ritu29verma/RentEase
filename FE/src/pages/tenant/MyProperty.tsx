import { useEffect, useState } from "react";
import axios from "axios";

export default function MyProperty() {
  const [property, setProperty] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tenants/my-property`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProperty(res.data);
      } catch (err) {
        console.error("Failed to fetch property", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">My Property Details</h1>

      {loading ? (
        <p className="text-gray-600 text-sm">Loading...</p>
      ) : (
        property && (
          <div className="border rounded p-4 bg-white shadow">
            <p><strong>Property Name:</strong> {property.propertyName}</p>
            <p><strong>Rent:</strong> ₹{property.rent.toLocaleString()}</p>
            <p><strong>Frequency:</strong> {property.frequency}</p>
            <p>
              <strong>Stay Duration:</strong>{" "}{new Date(property.stayDuration.start).toLocaleDateString()} – Present
            </p>
          </div>
        )
      )}
    </div>
  );
}
