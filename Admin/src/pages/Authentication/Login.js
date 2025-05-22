import React, { useState } from 'react';
import PropTypes from "prop-types"; // Good to keep if you plan to use props
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row, Card, CardBody, Form, Input, FormFeedback, Label, Button } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import apiClient from your api_helper.js
import { post as apiPost, get as apiGet } from '../../helpers/api_helper'; // Adjust path if needed

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// import images
import logo from "../../assets/images/logo-sm.svg"; // Adjust path if needed
import CarouselPage from "../AuthenticationInner/CarouselPage"; // Adjust path if needed

const Login = props => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearLocalStorageAuthItems = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('isSuperuser');
    console.log("LOGIN COMPONENT - Cleared auth items from localStorage.");
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your Username"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      clearLocalStorageAuthItems(); // Clear old session data first

      try {
        // 1. Call the token endpoint
        console.log("LOGIN COMPONENT - Attempting to fetch token for username:", values.username);
        const tokenResponse = await apiPost('api/token/', { // apiPost from your helper
          username: values.username,
          password: values.password,
        });
        // apiPost already returns response.data, so no need for .data again
        console.log("LOGIN COMPONENT - Token response received:", tokenResponse);


        const { access, refresh } = tokenResponse; // Directly destructure from tokenResponse

        if (!access || !refresh) {
          toast.error("Login failed: Tokens not received from server.");
          setLoading(false);
          return;
        }

        // 2. Save tokens to localStorage (interceptor will pick these up for next apiGet)
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        console.log("LOGIN COMPONENT - Tokens stored in localStorage.");
        toast.info("Tokens received, fetching profile...");

        // 3. Fetch User Profile
        // apiGet from your helper will use the interceptor to add the auth header
        const userProfile = await apiGet('api/user/profile/');
        console.log("LOGIN COMPONENT - Raw userProfile object from backend:", JSON.stringify(userProfile));
        console.log("LOGIN COMPONENT - userProfile.is_superuser value from backend:", userProfile.is_superuser, "(Type:", typeof userProfile.is_superuser + ")");


        if (!userProfile) {
          toast.error("Login partially failed: Received empty profile data.");
          throw new Error("Empty profile data"); // Will be caught by outer catch
        }

        // Role
        if (!userProfile.role) {
          console.warn("LOGIN COMPONENT - User profile data missing 'role'. Defaulting to 'Unknown'.", userProfile);
          localStorage.setItem('userRole', 'Unknown');
        } else {
          localStorage.setItem('userRole', userProfile.role);
        }
        console.log("LOGIN COMPONENT - Stored 'userRole' as:", localStorage.getItem('userRole'));


        // Username & User ID
        localStorage.setItem('userName', userProfile.username || '');
        localStorage.setItem('userId', userProfile.id || '');
        console.log("LOGIN COMPONENT - Stored 'userName' as:", localStorage.getItem('userName'));
        console.log("LOGIN COMPONENT - Stored 'userId' as:", localStorage.getItem('userId'));


        // --- CRUCIAL SECTION FOR is_superuser ---
        let isSuperuserStringForStorage = 'false'; // Default
        if (userProfile.is_superuser === true) {
            isSuperuserStringForStorage = 'true';
        } else if (userProfile.is_superuser === false) {
            isSuperuserStringForStorage = 'false';
        } else {
            console.warn("LOGIN COMPONENT - 'is_superuser' field from backend is not a clear boolean or is missing. Defaulting to 'false'. Received value:", userProfile.is_superuser);
        }
        localStorage.setItem('isSuperuser', isSuperuserStringForStorage);
        console.log("LOGIN COMPONENT - Stored 'isSuperuser' in localStorage as:", isSuperuserStringForStorage);
        // --- END CRUCIAL SECTION ---

        toast.success("Login Successful!");
        console.log("LOGIN COMPONENT - Login successful, navigating to dashboard. Role:", userProfile.role);

        try {
            navigate('/dashboard');
            console.log("LOGIN COMPONENT - navigate('/dashboard') called successfully.");
        } catch (navError) {
            console.error("LOGIN COMPONENT - Error during navigate() call:", navError);
            toast.error("Navigation failed after login. Please check console.");
        }

      } catch (error) {
        console.error("LOGIN COMPONENT - Login process failed:", error.response?.data || error.message || error);
        // Error from apiPost/apiGet already has .data extracted if it was an axios error
        const errorData = error.response?.data || error; // error might not be an axios error
        const detailMessage = errorData?.detail || (errorData?.non_field_errors ? errorData.non_field_errors.join(' ') : null);
        const errorMessage = detailMessage || "Login Failed: Invalid username or password, or server error.";

        toast.error(errorMessage);
        clearLocalStorageAuthItems(); // Ensure cleanup on any failure
      } finally {
        setLoading(false);
        console.log("LOGIN COMPONENT - handleLogin (onSubmit) finished.");
      }
    },
  });

  document.title = "Login | SPK Finance";

  return (
    <React.Fragment>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="col-xxl-3">
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={logo} alt="" height="28" /> <span className="logo-txt">SPK</span>
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0">Welcome Back !</h5>
                        <p className="text-muted mt-2">Sign in to continue to SPK Finance.</p>
                      </div>
                      <Form
                        className="custom-form mt-4 pt-2"
                        onSubmit={validation.handleSubmit}
                      >
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="username-input">Username</Label>
                          <Input
                            name="username"
                            id="username-input" // Ensure id matches htmlFor
                            className="form-control"
                            placeholder="Enter username"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.username}
                            invalid={validation.touched.username && !!validation.errors.username}
                            autoComplete="username"
                          />
                          {validation.touched.username && validation.errors.username ? (
                            <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <Label className="form-label" htmlFor="password-input">Password</Label>
                            </div>
                          </div>
                          <div className="input-group auth-pass-inputgroup">
                            <Input
                              name="password"
                              id="password-input" // Ensure id matches htmlFor
                              value={validation.values.password}
                              type={passwordShow ? "text" : "password"}
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={validation.touched.password && !!validation.errors.password}
                              autoComplete="current-password"
                            />
                            <button onClick={() => setPasswordShow(!passwordShow)} className="btn btn-light shadow-none ms-0" type="button" id="password-addon"><i className="mdi mdi-eye-outline"></i></button>
                            {validation.touched.password && validation.errors.password ? (
                              <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                            ) : null}
                          </div>
                        </div>
                        <div className="mt-3 d-grid">
                          <Button color="primary" className="btn-block" type="submit" disabled={loading || !validation.isValid || !validation.dirty}>
                            {loading ? "Logging In..." : "Log In"}
                          </Button>
                        </div>
                      </Form>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">© {new Date().getFullYear()} SPK Finance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <CarouselPage />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

// PropTypes can be removed if not using props, or kept for future use.
// Login.propTypes = {
// };

export default Login;