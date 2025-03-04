import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import CarouselPage from './CarouselPage'
import logo from "../../assets/images/logo-sm.svg";

const Logout = () => {

    document.title = "Log out | SPK Finance";

    return (
        <div className="container-fluid p-0">
            <Container fluid className='p-0'>
                <Row className="row g-0">
                    <Col xxl={3} lg={4} md={5}>
                        <div className="auth-full-page-content d-flex p-sm-5 p-4">
                            <div className="w-100">
                                <div className="d-flex flex-column h-100">
                                    <div className="mb-4 mb-md-5 text-center">
                                        <Link to="index.html" className="d-block auth-logo">
                                            <img src={logo} alt="" height="28" /> <span className="logo-txt">Minia</span>
                                        </Link>
                                    </div>
                                    <div className="auth-content my-auto">
                                        <div className="text-center">
                                            <div className="avatar-xl mx-auto">
                                                <div className="avatar-title bg-light-subtle text-primary h1 rounded-circle">
                                                    <i className="bx bxs-user"></i>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-2">
                                                <h5>You are Logged Out</h5>
                                                <p className="text-muted font-size-15">Thank you for using <span className="fw-semibold text-dark">SPK</span></p>
                                                <div className="mt-4">
                                                    <Link to="/dashboard" className="btn btn-primary w-100 waves-effect waves-light">Sign In</Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 text-center">
                                            <p className="text-muted mb-0">Don't have an account ? <a href="auth-register.html"
                                                className="text-primary fw-semibold"> Signup</a> </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 mt-md-5 text-center">
                                    <p className="mb-0">© {new Date().getFullYear()} SPK Finance . developed <i className="mdi mdi-heart text-danger"></i> by SPK Technology</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <CarouselPage />
                </Row>

            </Container>

        </div>
    )
}

export default Logout