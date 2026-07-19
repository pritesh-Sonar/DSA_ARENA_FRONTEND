import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { sendOtp as sendOtpService } from "../services/authService";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

const OtpVerificationForm = ({ email, pendingSignup }) => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef([]);

  const { verifyOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasted)) return;

    const newDigits = pasted.split("");
    while (newDigits.length < OTP_LENGTH) newDigits.push("");
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpCode = digits.join("");
    if (otpCode.length !== OTP_LENGTH) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email, otpCode);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 429) {
        return;
      }
      const message = err.response?.data?.message || "Invalid or expired OTP";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !pendingSignup) return;
    setError("");
    try {
      await sendOtpService(
        pendingSignup.username,
        pendingSignup.email,
        pendingSignup.password,
      );
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(""));
    } catch (err) {
      const message = err.response?.data?.message || "Failed to resend OTP";
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div className="flex justify-between gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-xl font-semibold rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 transition-colors"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      <p className="text-center text-sm text-gray-400">
        {cooldown > 0 ? (
          <>Resend code in {cooldown}s</>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-indigo-400 hover:underline"
          >
            Resend code
          </button>
        )}
      </p>
    </form>
  );
};

export default OtpVerificationForm;
