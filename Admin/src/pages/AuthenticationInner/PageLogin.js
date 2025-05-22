import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import axios from 'axios'; // Using axios directly for the token request
import { toast } from 'react-toastify';

// Assuming logo and CarouselPage imports are correct
import logo from "../../assets/images/logo-sm.svg"; // Make sure path is correct
import CarouselPage from './CarouselPage'; // Make sure path is correct

// Define BASE_API_URL here or import from a config file
const BASE_API_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/";

function PageLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
        console.log("LOGIN PAGE - Cleared auth items from localStorage.");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        clearLocalStorageAuthItems(); // Clear any previous session data first

        try {
            // 1. Call the token endpoint
            console.log("LOGIN PAGE - Attempting to fetch token with username:", username);
            const tokenResponse = await axios.post(`${BASE_API_URL}api/token/`, {
                username: username,
                password: password,
            });

            const { access, refresh } = tokenResponse.data;
            console.log("LOGIN PAGE - Token response received:", tokenResponse.data);


            if (!access || !refresh) {
                 toast.error("Login failed: Tokens not received from server.");
                 setLoading(false);
                 return;
            }

            // 2. Save tokens to localStorage
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            toast.info("Tokens received, fetching profile...");
            console.log("LOGIN PAGE - Tokens stored in localStorage.");

            // 3. Fetch User Profile to get Role and Superuser status
            // We need to manually add the Authorization header for this immediate next call,
            // as a global interceptor might not have picked up the new token yet.
            const authHeader = { headers: { Authorization: `Bearer ${access}` } };
            console.log("LOGIN PAGE - Fetching user profile with authHeader.");

            try {
                const profileResponse = await axios.get(`${BASE_API_URL}api/user/profile/`, authHeader );
                const userProfile = profileResponse.data;

                // --- Log the received profile for debugging ---
                console.log("LOGIN PAGE - Raw userProfile object from backend:", JSON.stringify(userProfile));
                console.log("LOGIN PAGE - userProfile.is_superuser value from backend:", userProfile.is_superuser, "(Type:", typeof userProfile.is_superuser + ")");

                // --- Validation and Storage ---
                if (!userProfile) {
                    toast.error("Login partially failed: Received empty profile data.");
                    throw new Error("Empty profile data"); // Will be caught by this try-catch's catch block
                }

                // Role
                if (!userProfile.role) {
                    console.warn("LOGIN PAGE - User profile data missing 'role'. Defaulting to 'Unknown'.", userProfile);
                    localStorage.setItem('userRole', 'Unknown');
                } else {
                    localStorage.setItem('userRole', userProfile.role);
                }
                console.log("LOGIN PAGE - Stored 'userRole' as:", localStorage.getItem('userRole'));


                // Username
                localStorage.setItem('userName', userProfile.username || '');
                console.log("LOGIN PAGE - Stored 'userName' as:", localStorage.getItem('userName'));

                // User ID
                localStorage.setItem('userId', userProfile.id || '');
                console.log("LOGIN PAGE - Stored 'userId' as:", localStorage.getItem('userId'));


                // --- THIS IS THE CRUCIAL SECTION FOR is_superuser ---
                let isSuperuserStringForStorage = 'false'; // Default
                if (userProfile.is_superuser === true) { // Explicitly check for boolean true from backend
                    isSuperuserStringForStorage = 'true';
                } else if (userProfile.is_superuser === false) { // Explicitly check for boolean false
                    isSuperuserStringForStorage = 'false';
                } else {
                    // This case handles if is_superuser is undefined, null, or not a boolean
                    console.warn("LOGIN PAGE - 'is_superuser' field from backend is not a clear boolean or is missing. Defaulting to 'false'. Received value:", userProfile.is_superuser);
                }
                localStorage.setItem('isSuperuser', isSuperuserStringForStorage);
                console.log("LOGIN PAGE - Stored 'isSuperuser' in localStorage as:", isSuperuserStringForStorage);
                // --- END OF CRUCIAL SECTION ---

                toast.success("Login Successful!");
                console.log("LOGIN PAGE - Login successful, navigating to dashboard.");
                navigate('/dashboard'); // Redirect after all info is stored

            } catch (profileError) {
                 console.error("LOGIN PAGE - Failed to fetch user profile:", profileError.response?.data || profileError.message || profileError);
                 const detail = profileError.response?.data?.detail || "Could not verify user profile.";
                 toast.error(`Login failed: ${detail}`);
                 clearLocalStorageAuthItems(); // Ensure cleanup if profile fetch fails
                 // setLoading is handled in finally
            }

        } catch (error) { // Catches errors from token request
            console.error("LOGIN PAGE - Token request failed:", error.response?.data || error.message || error);
            let errorMessage = "Login Failed: An unexpected error occurred.";
            if (error.response?.data?.detail) {
                errorMessage = `Login Failed: ${error.response.data.detail}`;
            } else if (error.message && error.message.includes("Network Error")) {
                errorMessage = "Login Failed: Could not connect to the server.";
            } else if (error.response?.status) {
                errorMessage = `Login Failed: Server responded with status ${error.response.status}.`;
            }
            toast.error(errorMessage);
            clearLocalStorageAuthItems(); // Ensure cleanup on token request failure
        } finally {
            setLoading(false);
            console.log("LOGIN PAGE - handleLogin finished.");
        }
    };

    //meta title
    document.title = "Login | SPK Finance";

    return (
        <React.Fragment>
            <div className="auth-page">
                <Container fluid className="p-0">
                    <Row className="g-0">
                        <Col xxl={3} lg={4} md={5}>
                            <div className="auth-full-page-content d-flex p-sm-5 p-4">
                                <div className="w-100">
                                    <div className="d-flex flex-column h-100">
                                        <div className="mb-4 mb-md-5 text-center">
                                            <Link to="/dashboard" className="d-block auth-logo">
                                                <img src={logo} alt="" height="28" /> <span className="logo-txt">SPK Finance</span>
                                            </Link>
                                        </div>
                                        <div className="auth-content my-auto">
                                            <div className="text-center">
                                                <h5 className="mb-0">Welcome Back!</h5>
                                                <p className="text-muted mt-2">Sign in to continue to SPK Finance.</p>
                                            </div>
                                            <form className="custom-form mt-4 pt-2" onSubmit={handleLogin}>
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="username">Username</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="username"
                                                        placeholder="Enter username"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        required
                                                        autoComplete="username"
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <div className="d-flex align-items-start">
                                                        <div className="flex-grow-1">
                                                            <label className="form-label" htmlFor="password">Password</label>
                                                        </div>
                                                    </div>
                                                    <div className="input-group auth-pass-inputgroup">
                                                        <input
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control"
                                                            id="password"
                                                            placeholder="Enter password"
                                                            aria-label="Password"
                                                            aria-describedby="password-addon"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                            autoComplete="current-password"
                                                        />
                                                        <button onClick={() => setPasswordShow(!passwordShow)} className="btn btn-light shadow-none ms-0" type="button" id="password-addon"><i className="mdi mdi-eye-outline"></i></button>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <button className="btn btn-primary w-100 waves-effect waves-light" type="submit" disabled={loading}>
                                                        {loading ? 'Logging In...' : 'Log In'}
                                                    </button>
                                                </div>
                                            </form>
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
    );
}

export default PageLogin;