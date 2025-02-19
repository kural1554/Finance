import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import logo from "../../assets/images/logo-sm.svg";
import CarouselPage from './CarouselPage';

function    PageLogin(props) {

    const [passwordShow, setPasswordShow] = useState(false);
    let navigate = useNavigate();

    const reDirect = () => {
        navigate("/dashboard")
    }
    //meta title
    document.title = "Login | Minia - React Admin & Dashboard Template";
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
                                                <img src={logo} alt="" height="28" /> <span className="logo-txt">Minia</span>
                                            </Link>
                                        </div>
                                        <div className="auth-content my-auto">
                                            <div className="text-center">
                                                <h5 className="mb-0">Welcome Back !</h5>
                                                <p className="text-muted mt-2">Sign in to continue to Minia.</p>
                                            </div>
                                            <form className="custom-form mt-4 pt-2">
                                                <div className="mb-3">
                                                    <label className="form-label">Username</label>
                                                    <input type="text" 
                                                    className="form-control" id="username" placeholder="Enter username"
                                                    defaultValue="admin@themesbrand.com" />
                                                </div>
                                                <div className="mb-3">
                                                    <div className="d-flex align-items-start">
                                                        <div className="flex-grow-1">
                                                            <label className="form-label">Password</label>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="">
                                                                <Link to="/page-recoverpw" className="text-muted">Forgot password?</Link>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="input-group auth-pass-inputgroup">  
                                                        <input type={passwordShow ? "text" : "password"} className="form-control" placeholder="Enter password" aria-label="Password" 
                                                        defaultValue="123456" aria-describedby="password-addon" />
                                                        <button onClick={() => setPasswordShow(!passwordShow)} className="btn btn-light shadow-none ms-0" type="button" id="password-addon"><i className="mdi mdi-eye-outline"></i></button>
                                                    </div>
                                                </div>
                                                <div className="row mb-4">
                                                    <div className="col">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" id="remember-check" />
                                                            <label className="form-check-label" htmlFor="remember-check">
                                                                Remember me
                                                            </label>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="mb-3">
                                                    <button onClick={()=>reDirect()} className="btn btn-primary w-100 waves-effect waves-light" type="submit">Log In</button>
                                                </div>
                                            </form>

                                            <div className="mt-4 pt-2 text-center">
                                                <div className="signin-other-title">
                                                    <h5 className="font-size-14 mb-3 text-muted fw-medium">- Sign in with -</h5>
                                                </div>

                                                <ul className="list-inline mb-0">
                                                    <li className="list-inline-item">
                                                        <Link to="#"
                                                            className="social-list-item bg-primary text-white border-primary">
                                                            <i className="mdi mdi-facebook"></i>
                                                        </Link>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <Link to="#"
                                                            className="social-list-item bg-info text-white border-info">
                                                            <i className="mdi mdi-twitter"></i>
                                                        </Link>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <Link to="#"
                                                            className="social-list-item bg-danger text-white border-danger">
                                                            <i className="mdi mdi-google"></i>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>


                                            <div className="mt-5 text-center">
                                                <p className="text-muted mb-0">Don't have an account ? <Link to="/page-register"
                                                    className="text-primary fw-semibold"> Signup now </Link> </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 mt-md-5 text-center">
                                            <p className="mb-0">© {new Date().getFullYear()} Minia   . Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
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