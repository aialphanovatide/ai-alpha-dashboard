import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import config from "../../../config";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/home", { state: { username: data.username } });
      } else {
        setError(data.error || "Incorrect credentials. Please try again.");
      }
    } catch (error) {
      setError("Error making request. Please try again.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={(e) => e.preventDefault()}  className={styles.loginForm}>
                    <img
                      src={require("../../../assets/brand/logo.png")}
                      alt="logo"
                      className={styles.loginLogo}
                    />
                    <h1>Login</h1>
                    <p className="text-body-secondary">
                      Sign In to your account
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={handleUsernameChange}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <CButton
                        type="button"
                        onClick={toggleShowPassword}
                        className={styles.showPasswordButton}
                        id="showPasswordButton"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </CButton>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={4}>
                        <CButton
                          color="primary"
                          className={styles.loginButton}
                          onClick={handleSubmit}
                        >
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
