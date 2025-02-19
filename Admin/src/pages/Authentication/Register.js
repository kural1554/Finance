import React, { useEffect } from "react"
import { Row, Col, Alert, Container, Input, Label, Form, FormFeedback  } from "reactstrap"

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { registerUser, apiError } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom"

// import images
import logo from "../../assets/images/logo-sm.svg"
import CarouselPage from "../AuthenticationInner/CarouselPage"
import { createSelector } from "reselect";

const Register = props => {

  //meta title
  document.title = "Register | Minia - React Admin & Dashboard Template";

  const dispatch = useDispatch()

  const registerData = createSelector(
    (state) => state.Account,
    (state) => ({
      user: state.user,
      registrationError: state.registrationError,
      loading: state.loading,
    })
  );
  // Inside your component
  const { user, registrationError } = useSelector(registerData);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      username: 'admin@themesbrand.com' || '',
      password: '123456' || '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      username: Yup.string().required("Please Enter Your Username"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(registerUser(values));
    }
  });

  useEffect(() => {
    dispatch(apiError(""))
  }, [dispatch])

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
                        <h5 className="mb-0">Register Account</h5>
                        <p className="text-muted mt-2">Get your free Minia account now.</p>
                      </div>

                      <Form
                        className="needs-validation custom-form mt-4 pt-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        {user && user ? (
                          <Alert color="success">
                            Register User Successfully
                          </Alert>
                        ) : null}

                        {registrationError && registrationError ? (
                          <Alert color="danger">{registrationError}</Alert>
                        ) : null}

                        <div className="mb-3">
                          <Label className="form-label">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email && validation.errors.email ? true : false
                            }
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                          ) : null}
                        </div>


                        <div className="mb-3">
                          <Label className="form-label">Username</Label>
                          <Input
                            name="username"
                            type="text"
                            placeholder="Enter username"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.username || ""}
                            invalid={
                              validation.touched.username && validation.errors.username ? true : false
                            }
                          />
                          {validation.touched.username && validation.errors.username ? (
                            <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label className="form-label">Password</Label>
                          <Input
                            name="password"
                            type="password"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password && validation.errors.password ? true : false
                            }
                          />
                          {validation.touched.password && validation.errors.password ? (
                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                          ) : null}
                        </div>
                        
                        <div className="mb-4">
                          <p className="mb-0">
                            By registering you agree to the Minia{" "}
                            <Link to="#" className="text-primary">
                              Terms of Use
                            </Link>
                          </p>
                        </div>
                        <div className="mb-3">
                          <button
                            className="btn btn-primary w-100 waves-effect waves-light"
                            type="submit"
                          >
                            Register
                          </button>
                        </div>
                      </Form>

                      <div className="mt-5 text-center">
                        <p className="text-muted mb-0">Already have an account ? <Link to="/login"
                          className="text-primary fw-semibold"> Login </Link> </p>
                      </div>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">© {new Date().getFullYear()} Minia . Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
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

export default Register