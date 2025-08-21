import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg"; 
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoHomeButton from "../components/GoHome.jsx";

const Login = () => {
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent); 
  const navigate = useNavigate();

  const [mode, setMode] = useState("signup"); // "signup" or "login"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleMode = () => {
    setMode(mode === "signup" ? "login" : "signup");
    setFullName("");
    setEmail("");
    setPassword("");
  };

  const onLoginHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      if (mode === "signup") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name:fullName,
          email,
          password,
        });

        if (data.success) {
          toast.success("Signup successful! 🎉");

          // If backend auto-logs in after signup
          setIsLoggedin(true);
          getUserData();
          navigate("/");


        } else {
          toast.error(data.message || "Signup failed!");
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (data.success) {
          toast.success("Login successful! 🎉");
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message || "Login failed!");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div style={styles.page}>
       <GoHomeButton />
      <img src={logo} alt="Logo" style={styles.logo} />

      <div style={styles.card}>
        <h2 style={styles.title}>
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h2>
        <p style={styles.subtitle}>
          {mode === "signup" ? "Create your account" : "Please login to continue"}
        </p>

        <form onSubmit={onLoginHandler}>
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              style={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mode === "login" && (
            <p
              style={styles.forgot}
              onClick={() => navigate("/reset-password")}
            >
              Forgot password?
            </p>
          )}

          <button type="submit" style={styles.button}>
            {mode === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
          <span onClick={toggleMode} style={styles.link}>
            {mode === "signup" ? " Login here" : " Sign up here"}
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
    fontSize: "28px",
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
  forgot: {
    fontSize: "13px",
    color: "#2575fc",
    textAlign: "right",
    cursor: "pointer",
    marginTop: "-5px",
    marginBottom: "15px",
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

export default Login;
