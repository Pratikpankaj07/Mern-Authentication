import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { userData, backendUrl,setUserData, setIsLoggedin } = useContext(AppContent);
  const navigate = useNavigate();


  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verification-otp`, {
        email: userData.email,
      });

      if (data.success) {
        navigate("/email-verify");
        toast.success("Verification OTP sent to your email!");
      } else {
        toast.error(data.message || "Failed to send verification OTP.");
      }
    } catch (error) {
      toast.error("Error sending verification OTP. Please try again later.");
    }
  }


  // Handle logout
  const handleLogout=async () => {
    try{
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl+`/api/auth/logout`);
      if(data.success){
        setUserData(false);
        setIsLoggedin(false);
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again later.");
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
    
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Pegasus Vault Logo"
            width="30"
            height="30"
            className="d-inline-block align-text-top me-2"
          />
          Pegasus Vault
        </Link>
        
        <div className="dropdown">
  <div
    className={`d-flex justify-content-center align-items-center rounded-circle dropdown-toggle ${
      userData?.isAccountVerified
        ? "bg-primary text-white shadow" // Royal circle if authenticated
        : "bg-dark text-white"           // Black circle if not authenticated
    }`}
    style={{
      width: "40px",
      height: "40px",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
    }}
    id="userMenu"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    {userData?.name ? userData.name[0].toUpperCase() : "U"}
  </div>

  <ul
    className="dropdown-menu dropdown-menu-end shadow"
    aria-labelledby="userMenu"
  >
    {userData && !userData.isAccountVerified && (
      <li>
        <button className="dropdown-item" onClick={sendVerificationOtp}>
          Verify Email
        </button>
      </li>
    )}
    {userData && (
      <li>
        <button className="dropdown-item" onClick={handleLogout}>
          Logout
        </button>
      </li>
    )}
  </ul>
</div>




      </div>

           
    </nav>
  );
};

export default Navbar;

