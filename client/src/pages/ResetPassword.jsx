import React, { useState, useContext, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../assets/logo.svg";
import GoHomeButton from "../components/GoHome.jsx";

const ResetPassword = () => {
  const { backendUrl, isLoggedin } = useContext(AppContent);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Email input, 2 = OTP+Password reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Redirect if user is not logged in
  useEffect(() => {
    if (!isLoggedin) {
      navigate("/login");
    }
  }, [isLoggedin, navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div style={styles.page}>
       <GoHomeButton />
      <img src={logo} alt="Logo" style={styles.logo} />

      <div style={styles.card}>
        {step === 1 && (
          <>
            <h2 style={styles.title}>Reset Password</h2>
            <p style={styles.subtitle}>Enter your registered email</p>
            <form onSubmit={handleSendOtp}>
              <input
                type="email"
                placeholder="Email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" style={styles.button}>Send OTP</button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={styles.title}>Verify & Reset</h2>
            <p style={styles.subtitle}>Enter OTP and new password</p>
            <form onSubmit={handleReset}>
              <input
                type="text"
                placeholder="OTP"
                style={styles.input}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                style={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit" style={styles.button}>Reset Password</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
  },
  logo: {
    position: "absolute",
    top: "20px",
    left: "20px",
    width: "60px",
    height: "60px",
    objectFit: "contain",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "15px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
  },
  title: {
    fontSize: "26px",
    color: "#6a11cb",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  button: {
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    color: "#fff",
    padding: "12px",
    width: "100%",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default ResetPassword;

