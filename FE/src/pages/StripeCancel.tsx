import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StripeCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/tenant");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-red-600">
      <AlertTriangle size={80} />
      <h1 className="text-2xl font-bold mt-4">Payment Cancelled</h1>
      <p className="mt-2">You have cancelled the payment process.</p>
    </div>
  );
}
