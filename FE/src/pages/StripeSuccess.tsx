import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StripeSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (sessionId) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/payment-success/${sessionId}`);
    }

    const timer = setTimeout(() => {
      navigate("/tenant");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-green-600">
      <CheckCircle size={80} />
      <h1 className="text-2xl font-bold mt-4">Payment Successful!</h1>
      <p className="mt-2">Thank you for your rent payment!</p>
    </div>
  );
}
