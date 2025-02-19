import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Form, Label, Row } from 'reactstrap';

//Verification code package
import AuthCode from "react-auth-code-input";

//import images
import logo from "../../assets/images/logo-sm.svg";
import CarouselPage from './CarouselPage';

const TwoStepVerfication = () => {
    //meta title
    document.title = "Two Step Verification | Minia - React Admin & Dashboard Template";

    const digit1Ref = useRef(null);
    const digit2Ref = useRef(null);
    const digit3Ref = useRef(null);
    const digit4Ref = useRef(null);


    function moveToNext(index, event) {
        const target = event.target;
        if (target.value.length === 1) {
            switch (index) {
                case 1:
                    digit2Ref.current?.focus();
                    break;
                case 2:
                    digit3Ref.current?.focus();
                    break;
                case 3:
                    digit4Ref.current?.focus();
                    break;
                case 4:
                    digit4Ref.current?.blur();
                    break;
                default:
                    break;
            }
        }
    }

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
                                                <img src={logo} alt="" height="28" /> <span className="logo-txt">Minia</span>
                                            </Link>
                                        </div>
                                        <div className="auth-content my-auto">
                                            <div className="text-center">

                                                <div className="avatar-lg mx-auto">
                                                    <div className="avatar-title rounded-circle bg-light">
                                                        <i className="bx bxs-envelope h2 mb-0 text-primary"></i>
                                                    </div>
                                                </div>
                                                <div className="p-2 mt-4">

                                                    <h4>Verify your email</h4>
                                                    <p className="mb-5">Please enter the 4 digit code sent to <span className="fw-bold">example@abc.com</span></p>

                                                    <Form>
                                                        <Row>
                                                            <div className="col-3">
                                                                <div className="mb-3">
                                                                    <Label htmlFor="digit1-input" className="visually-hidden">Digit 1</Label>
                                                                    <input type="text" className="form-control form-control-lg text-center two-step" placeholder="0" onKeyUp={(event) => moveToNext(1, event)} maxLength={1} id="digit1-input" ref={digit1Ref} />
                                                                </div>
                                                            </div>

                                                            <div className="col-3">
                                                                <div className="mb-3">
                                                                    <Label htmlFor="digit2-input" className="visually-hidden">Digit 2</Label>
                                                                    <input type="text" className="form-control form-control-lg text-center two-step" placeholder="0" onKeyUp={(event) => moveToNext(2, event)} maxLength={1} id="digit2-input" ref={digit2Ref} />
                                                                </div>
                                                            </div>

                                                            <div className="col-3">
                                                                <div className="mb-3">
                                                                    <Label htmlFor="digit3-input" className="visually-hidden">Digit 3</Label>
                                                                    <input type="text" className="form-control form-control-lg text-center two-step" placeholder="0" onKeyUp={(event) => moveToNext(3, event)} maxLength={1} id="digit3-input" ref={digit3Ref} />
                                                                </div>
                                                            </div>

                                                            <div className="col-3">
                                                                <div className="mb-3">
                                                                    <Label htmlFor="digit4-input" className="visually-hidden">Digit 4</Label>
                                                                    <input type="text" className="form-control form-control-lg text-center two-step" placeholder="0" onKeyUp={(event) => moveToNext(4, event)} maxLength={1} id="digit4-input" ref={digit4Ref} />
                                                                </div>
                                                            </div>
                                                        </Row>
                                                    </Form>

                                                    <div className="mt-4">
                                                        <Link to="/dashboard" className="btn btn-primary w-100">Confirm</Link>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="mt-5 text-center">
                                                <p className="text-muted mb-0">Didn't receive an email ? <Link to="#"
                                                    className="text-primary fw-semibold"> Resend </Link> </p>
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
};

export default TwoStepVerfication;