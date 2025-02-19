import React, { useState } from "react";
import { Col, Form, Input, Label, Row } from "reactstrap";

const Formlayouts = () => {
  const [state, setState] = useState("")
  return (
    <React.Fragment>
      <Row>
        <Col lg={5}>
          <div>
            <h5 className="font-size-14 mb-4">
              <i className="mdi mdi-arrow-right text-primary me-1"></i> Form
              groups
            </h5>
            <Form>
              <div className="mb-3">
                <Label className="form-label" htmlFor="formrow-firstname-input">
                  First name
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="formrow-firstname-input"
                  placeholder="Enter Your First Name"
                />
              </div>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="formrow-email-input">
                      Email
                    </Label>
                    <Input
                      type="email"
                      className="form-control"
                      id="formrow-email-input"
                      placeholder="Enter Your Email"
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label
                      className="form-label"
                      htmlFor="formrow-password-input"
                    >
                      Password
                    </Label>
                    <Input
                      type="password"
                      className="form-control"
                      id="formrow-password-input"
                      placeholder="Enter Your Password"
                    />
                  </div>
                </Col>
              </Row>

              <div className="form-group">
                <div className="form-check">
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    id="formrow-customCheck"
                  />
                  <Label
                    className="form-check-label"
                    htmlFor="formrow-customCheck"
                  >
                    Check me out
                  </Label>
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="btn btn-primary w-md">
                  Submit
                </button>
              </div>
            </Form>
          </div>
        </Col>
        <Col lg={6} className="ms-lg-auto">
          <div className="mt-4 mt-lg-0">
            <h5 className="font-size-14 mb-4">
              <i className="mdi mdi-arrow-right text-primary me-1"></i>{" "}
              Horizontal form
            </h5>

            <Form>
              <Row className="mb-4">
                <Label
                  htmlFor="horizontal-firstname-input"
                  className="col-sm-3 col-form-label"
                >
                  First name
                </Label>
                <Col sm={9}>
                  <Input
                    type="text"
                    className="form-control"
                    id="horizontal-firstname-input"
                    placeholder="Enter Your First Name"
                  />
                </Col>
              </Row>
              <Row className="mb-4">
                <Label
                  htmlFor="horizontal-email-input"
                  className="col-sm-3 col-form-label"
                >
                  Email
                </Label>
                <Col sm={9}>
                  <Input
                    type="email"
                    className="form-control"
                    id="horizontal-email-input"
                    placeholder="Enter Your Email"
                  />
                </Col>
              </Row>
              <Row className="mb-4">
                <Label
                  htmlFor="horizontal-password-input"
                  className="col-sm-3 col-form-label"
                >
                  Password
                </Label>
                <Col sm={9}>
                  <Input
                    type="password"
                    className="form-control"
                    id="horizontal-password-input"
                    placeholder="Enter Your Password"
                  />
                </Col>
              </Row>

              <Row className="justify-content-end">
                <Col sm={9}>
                  <div className="form-check mb-4">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="horizontal-customCheck"
                    />
                    <Label
                      className="form-check-label"
                      htmlFor="horizontal-customCheck"
                    >
                      Remember me
                    </Label>
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary w-md">
                      Submit
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col lg={6}>
          <h5 className="font-size-14 mb-4">
            <i className="mdi mdi-arrow-right text-primary me-1"></i> Inline
            forms layout
          </h5>

          <form className="row gx-3 gy-2 align-items-center">
            <Col sm={4}>
              <Label
                className="visually-hidden"
                htmlFor="specificSizeInputName"
              >
                Name
              </Label>
              <Input
                type="text"
                className="form-control"
                id="specificSizeInputName"
                placeholder="Enter Name"
              />
            </Col>
            <Col sm={4}>
              <Label
                className="visually-hidden"
                htmlFor="specificSizeInputGroupUsername"
              >
                Username
              </Label>
              <div className="input-group">
                <div className="input-group-text">@</div>
                <Input
                  type="text"
                  className="form-control"
                  id="specificSizeInputGroupUsername"
                  placeholder="Username"
                />
              </div>
            </Col>
            <div className="col-auto">
              <div className="form-check">
                <Input
                  className="form-check-input"
                  type="checkbox"
                  id="autoSizingCheck2"
                />
                <Label className="form-check-label" htmlFor="autoSizingCheck2">
                  Remember me
                </Label>
              </div>
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </Col>
        <Col lg={6}>
          <h5 className="font-size-14 mb-4">
            <i className="mdi mdi-arrow-right text-primary me-1"></i> Floating
            Label
          </h5>

          <Row>
            <Col lg={6}>
              <div className="form-floating mb-3 mb-lg-0">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
            </Col>
            <Col lg={6}>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>
            </Col>
          </Row>
        </Col>

        <Row className="mt-4">
          <Col lg={6}>
            <h5 className="font-size-14 mb-4"><i className="mdi mdi-arrow-right text-primary me-1"></i> Inline forms layout used by hstack</h5>
            <form className="row gx-3 gy-2 align-items-center">
              <div className="hstack gap-3">
                <Input onChange={(e) => setState(e.target.value)} className="form-control me-auto" type="text" placeholder="Add your item here..." />
                <button type="button" className="btn btn-secondary">Submit</button>
                <div className="vr"></div>
                <button onClick={() => setState('')} type="reset" className="btn btn-outline-danger">Reset</button>
              </div>
            </form>
          </Col>
        </Row>
      </Row>
    </React.Fragment>
  );
};

export default Formlayouts;
