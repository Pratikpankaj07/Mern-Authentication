import React, { useState, useContext, useEffect, use } from "react";
import axios from "axios";
import logo from "../assets/logo.svg"; 
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import GoHomeButton from "../components/GoHome.jsx";

const EmailVerify = () => {
  const { backendUrl, getUserData,isLoggedin ,userData} = useContext(AppContent);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
        otp,
      });

      if (data.success) {
        toast.success("Email verified successfully 🎉");
        getUserData(); 
        navigate("/");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData, navigate]);



  return (
    <div style={styles.page}>
       <GoHomeButton />
      <img src={logo} alt="Logo" style={styles.logo} />

      <div style={styles.card}>
        <h2 style={styles.title}>Verify Your Email</h2>
        <p style={styles.subtitle}>
          Enter the verification code sent to your email
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            style={styles.input}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit" style={styles.button}>
            Verify Email
          </button>
        </form>

        <p style={styles.footer}>
          Didn’t receive the code?{" "}
          <span
            style={styles.link}
            onClick={async () => {
              try {
                const { data } = await axios.post(
                  `${backendUrl}/api/auth/send-verification-otp`
                );
                if (data.success) {
                  toast.success("Verification code sent again");
                } else {
                  toast.error(data.message || "Failed to resend code");
                }
              } catch (error) {
                toast.error("Server error. Try again later.");
              }
            }}
          >
            Resend
          </span>
        </p>
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
    textAlign: "center",
    letterSpacing: "2px",
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
  footer: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#444",
  },
  link: {
    color: "#6a11cb",
    marginLeft: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default EmailVerify;
