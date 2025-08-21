import React,{useContext} from "react";
import logo from "../assets/header_img.png"; 
import hand_wave from "../assets/hand_wave.png";
import { AppContent } from "../context/AppContext"; 

const Header = () => {
  const {userData} = useContext(AppContent);
  return (
    <header
      className="text-white text-center d-flex align-items-center"
      style={{
        minHeight: "80vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)", 
      }}
    >
      <div className="container">
        <img
          src={logo}
          alt="Logo"
          className="img-fluid mb-4"
          style={{ maxWidth: "180px" }}
        />

        <h1 className="fw-bold display-4">
          Hey {userData ? userData.name : "Developer"}!{" "}
          <img
            src={hand_wave}
            alt="Hand Wave"
            style={{
              width: "45px",
              height: "45px",
              verticalAlign: "middle",
            }}
          />
        </h1>
        <p className="lead mt-3">
          Welcome to <span className="fw-bold">Pegasus Vault</span> — Secure
          your Authentication with elegance.
        </p>

        <div className="mt-4">
          <a href="/login" className="btn btn-outline-light btn-lg shadow-sm">
            GetStarted
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
