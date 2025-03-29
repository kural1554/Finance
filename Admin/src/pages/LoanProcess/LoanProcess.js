import React, { useState } from "react";
import {
  CardBody,
  NavItem,
  TabContent,
  TabPane,
  NavLink,
  UncontrolledTooltip,
  Card,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
  Label,
  Button,
  Table
} from "reactstrap";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Line,
  BarChart,
  Bar
} from 'recharts';
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import classnames from "classnames";
import { Link } from "react-router-dom";

const LoanProcess = () => {
  // State
  const [emiDetails, setEmiDetails] = useState([]);
  const [loanData, setLoanData] = useState({
    amount: "",
    term: "",
    termType: "months",
    interestRate: "",
    purpose: "",
    repaymentSource: ""
  });
  const [formData, setFormData] = useState({
    agreeTerms: false
  });
  const [activeTab, setactiveTab] = useState(1);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [profilephoto, setprofilephoto] = useState([]);
  const [viewMode, setViewMode] = useState("table");

  // Handlers
  const handleInputChange = (e) => {
    setLoanData({ ...loanData, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    const { name, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : e.target.value,
    }));
  };

  const calculateEMI = () => {
    const { amount, term, interestRate, termType } = loanData;

    if (!amount || !term || !interestRate || !termType) {
      alert("Please fill all required loan details!");
      return;
    }

    let remainingPrincipal = parseFloat(amount);
    let rate = parseFloat(interestRate) / 100; // Monthly rate
    let termValue = parseInt(term);

    // Convert term to months based on termType
    let totalMonths;
    switch (termType) {
      case "daily":
        totalMonths = Math.ceil(termValue / 30);
        break;
      case "weeks":
        totalMonths = termValue;
        break;
      case "months":
        totalMonths = termValue;
        break;
      case "years":
        totalMonths = termValue * 12;
        break;
      default:
        totalMonths = termValue;
    }

    let fixedPrincipalPayment = remainingPrincipal / totalMonths;
    let emiBreakdown = [];

    for (let i = 1; i <= totalMonths; i++) {
      let interest = remainingPrincipal * rate; // Calculate interest
      let emiTotalMonth = interest + fixedPrincipalPayment; // Total EMI per month
      remainingPrincipal -= fixedPrincipalPayment; // Reduce principal

      emiBreakdown.push({
        month: i,
        emiTotalMonth: parseFloat(emiTotalMonth.toFixed(2)),
        interest: parseFloat(interest.toFixed(2)),
        principalPaid: parseFloat(fixedPrincipalPayment.toFixed(2)),
        remainingBalance: Math.max(0, parseFloat(remainingPrincipal.toFixed(2))),
      });

      if (remainingPrincipal <= 0) break;
    }

    setEmiDetails(emiBreakdown);
    setactiveTab(3);
  };

  const resetForm = () => {
    setLoanData({
      amount: "",
      term: "",
      termType: "months",
      interestRate: "",
      purpose: "",
      repaymentSource: ""
    });
    setEmiDetails([]);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip p-2 bg-white border shadow-sm rounded">
          <p className="mb-1"><strong>Month {label}</strong></p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-0" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        setactiveTab(tab);
      }
    }
  };

  // Calculate totals for summary
  const totalInterest = emiDetails.reduce((sum, row) => sum + row.interest, 0);
  const totalPrincipal = parseFloat(loanData.amount || 0);
  const totalPayment = totalInterest + totalPrincipal;

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">Loan Application Process</h4>
        </CardHeader>
        <CardBody>
          <div id="basic-pills-wizard" className="twitter-bs-wizard">
            <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 1 })}
                  onClick={() => toggleTab(1)}
                >
                  <div className="step-icon" id="Applicant">
                    <i className="bx bx-user"></i>
                    <UncontrolledTooltip placement="top" target="Applicant">
                      Applicant
                    </UncontrolledTooltip>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 2 })}
                  onClick={() => toggleTab(2)}
                >
                  <div className="step-icon" id="LoanDetails">
                    <i className="bx bx-rupee"></i>
                    <UncontrolledTooltip placement="top" target="LoanDetails">
                      Loan Details
                    </UncontrolledTooltip>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 3 })}
                  onClick={() => toggleTab(3)}
                >
                  <div className="step-icon" id="EMISchedule">
                    <i className="bx bxs-calculator"></i>
                    <UncontrolledTooltip placement="top" target="EMISchedule">
                      EMI Schedule
                    </UncontrolledTooltip>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 4 })}
                  onClick={() => toggleTab(4)}
                >
                  <div className="step-icon" id="Agreement">
                    <i className="bx bx-file"></i>
                    <UncontrolledTooltip placement="top" target="Agreement">
                      Agreement
                    </UncontrolledTooltip>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 5 })}
                  onClick={() => toggleTab(5)}
                >
                  <div className="step-icon" id="Documents">
                    <i className="bx bx-check-shield"></i>
                    <UncontrolledTooltip placement="top" target="Documents">
                      Documents
                    </UncontrolledTooltip>
                  </div>
                </NavLink>
              </NavItem>
            </ul>

            <TabContent activeTab={activeTab}>
              {/* Tab 1 - Applicant Info */}
              <TabPane tabId={1}>
                <div className="text-center mb-4">
                  <h5>Applicant Information</h5>
                  <p className="card-title-desc">Fill all information below</p>
                </div>
                <Form className="d-flex flex-column align-items-center">
                  <div className="w-50"> {/* Adjust width as needed */}
                    <FormGroup >
                      <Label>Full Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        {...register("fullName", { required: "Full name is required" })}
                      />
                      {errors.fullName && <span className="text-danger">{errors.fullName.message}</span>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Aadhar Number</Label>
                      <Input
                        type="text"
                        placeholder="Enter Aadhar number"
                        {...register("aadhar", {
                          required: "Aadhar is required",
                          pattern: {
                            value: /^[0-9]{12}$/,
                            message: "Invalid Aadhar number"
                          }
                        })}
                      />
                      {errors.aadhar && <span className="text-danger">{errors.aadhar.message}</span>}
                    </FormGroup>
                  </div>
                </Form>
              </TabPane>


              {/* Tab 2 - Loan Details Form */}
              <TabPane tabId={2}>
                <div className="text-center mb-4">
                  <h5>Loan Details</h5>
                  <p className="card-title-desc">Fill all information below</p>
                </div>
                <Form>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Loan Amount (₹)</Label>
                        <Input
                          type="number"
                          name="amount"
                          value={loanData.amount}
                          onChange={handleInputChange}
                          placeholder="Enter loan amount"
                          min="1000"
                          step="1000"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Loan Term</Label>
                        <Input
                          type="number"
                          name="term"
                          value={loanData.term}
                          onChange={handleInputChange}
                          placeholder="Enter loan term"
                          min="1"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Loan Term Type</Label>
                        <Input
                          type="select"
                          name="termType"
                          value={loanData.termType}
                          onChange={handleInputChange}
                        >
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Interest Rate (%)</Label>
                        <Input
                          type="number"
                          name="interestRate"
                          value={loanData.interestRate}
                          onChange={handleInputChange}
                          placeholder="Enter interest rate"
                          min="0"
                          max="30"
                          step="0.1"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Loan Purpose</Label>
                        <Input
                          type="select"
                          name="purpose"
                          value={loanData.purpose}
                          onChange={handleInputChange}
                        >
                          <option value="">Select purpose</option>
                          <option value="education">Children's Education</option>
                          <option value="medical">Medical Expenses</option>
                          <option value="business">Business</option>
                          <option value="home">Home</option>
                          <option value="other">Other</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Source of Repayment</Label>
                        <Input
                          type="text"
                          name="repaymentSource"
                          value={loanData.repaymentSource}
                          onChange={handleInputChange}
                          placeholder="Enter repayment source"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="text-center mt-4">
                    {/* <Button color="primary" onClick={calculateEMI} className="me-2">
                      Calculate EMI
                    </Button> */}
                    <Button color="secondary" onClick={resetForm}>
                      Reset
                    </Button>
                  </div>
                </Form>
              </TabPane>

              {/* Tab 3 - EMI Schedule */}
              <TabPane tabId={3}>
                <div className="text-center mb-4">
                  <h5>EMI Repayment Schedule</h5>
                  <p className="card-title-desc">
                    {emiDetails.length > 0
                      ? `Loan of ${formatCurrency(loanData.amount)} at ${loanData.interestRate}% interest`
                      : "Calculate your EMI in Tab 2 to view schedule"}
                  </p>
                </div>

                {emiDetails.length > 0 ? (
                  <>
                    <div className="text-center mb-3">
                      <Button
                        color={viewMode === "table" ? "primary" : "light"}
                        onClick={() => setViewMode("table")}
                        className="me-2"
                      >
                        <i className="bx bx-table"></i> Table View
                      </Button>
                      <Button
                        color={viewMode === "chart" ? "primary" : "light"}
                        onClick={() => setViewMode("chart")}
                      >
                        <i className="bx bx-line-chart"></i> Chart View
                      </Button>
                    </div>

                    {viewMode === "table" ? (
                      <div className="table-responsive">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Month</th>
                              <th>EMI</th>
                              <th>Principal</th>
                              <th>Interest</th>
                              <th>Remaining Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {emiDetails.map((row, index) => (
                              <tr key={index}>
                                <td>{row.month}</td>
                                <td>{formatCurrency(row.emiTotalMonth)}</td>
                                <td>{formatCurrency(row.principalPaid)}</td>
                                <td>{formatCurrency(row.interest)}</td>
                                <td>{formatCurrency(row.remainingBalance)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th>Total</th>
                              <th>{formatCurrency(totalPayment)}</th>
                              <th>{formatCurrency(totalPrincipal)}</th>
                              <th>{formatCurrency(totalInterest)}</th>
                              <th>-</th>
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={emiDetails}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis
                            tickFormatter={(value) =>
                              new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0
                              }).format(value)
                            }
                          />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="emiTotalMonth"
                            name="Total EMI"
                            stroke="#8884d8"
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="principalPaid"
                            name="Principal"
                            stroke="#82ca9d"
                          />
                          <Line
                            type="monotone"
                            dataKey="interest"
                            name="Interest"
                            stroke="#ff7300"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}

                    <div className="summary-card mt-4 p-3 bg-light rounded">
                      <Row>
                        <Col md={4} className="text-center">
                          <h6>Loan Amount</h6>
                          <h4 className="text-primary">{formatCurrency(totalPrincipal)}</h4>
                        </Col>
                        <Col md={4} className="text-center">
                          <h6>Total Interest</h6>
                          <h4 className="text-danger">{formatCurrency(totalInterest)}</h4>
                        </Col>
                        <Col md={4} className="text-center">
                          <h6>Total Payment</h6>
                          <h4 className="text-success">{formatCurrency(totalPayment)}</h4>
                        </Col>
                      </Row>
                    </div>

                    <div className="text-center mt-4">
                      <Button color="secondary" onClick={() => setactiveTab(2)} className="me-2">
                        <i className="bx bx-edit"></i> Edit Loan Details
                      </Button>
                      {/* <Button color="primary" onClick={() => setactiveTab(4)}>
                        Continue to Agreement <i className="bx bx-chevron-right"></i>
                      </Button> */}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-5">
                    <i className="bx bx-calculator display-4 text-muted mb-3"></i>
                    <h5>No EMI Schedule Available</h5>
                    <p className="text-muted mb-4">
                      Please fill in your loan details and click "Calculate EMI" to view your repayment schedule
                    </p>
                    <Button color="primary" onClick={() => setactiveTab(2)}>
                      <i className="bx bx-arrow-back"></i> Go to Loan Details
                    </Button>
                  </div>
                )}
              </TabPane>

              {/* Tab 4 - Agreement */}
              <TabPane tabId={4}>
                <Form>
                  <Row>
                    <Col md={12}>
                      <div className="declaration-text mt-3">
                        <h5>
                          Declaration and Undertaking by Applicant to SPK Micro
                          Financial Services (Promoted by SPK Foundation)
                        </h5>
                        <p>
                          I/We, declare that all the information given in the
                          application form are true, correct and complete and
                          that they shall form the basis of any loan SPK Micro
                          Financial Services (Promoted by SPK Foundation) may
                          decide to grant me/us. SPK Micro Financial Services
                          (Promoted by SPK Foundation) may seek / receive
                          information from any source/person to consider this
                          application. I/We further agree that my/our loan shall
                          be governed by rules of SPK Micro Financial Services
                          (Promoted by SPK Foundation) which may be in force
                          time to time. I/We agree that SPK Micro Financial
                          Services (Promoted by SPK Foundation) reserves the
                          right to accept/reject this application without
                          assigning any reason whatsoever. I/We have read the
                          brochure and understood the contents. I/We understand
                          that the fee paid along with the loan application form
                          is non-refundable. I/We undertake to inform SPK Small
                          Finance Bank regarding any change in my/our
                          occupation/employment/residential address and to
                          provide any further information that SPK Micro
                          Financial Services (Promoted by SPK Foundation)
                          require. SPK Micro Financial Services (Promoted by SPK
                          Foundation) may make available any information
                          contained in this form, other documents submitted to
                          SPK Micro Financial Services (Promoted by SPK
                          Foundation) and, information pertaining to any
                          institution or body. I/We confirm that I/We have/had
                          no insolvency proceedings against me/us nor I/We
                          have/had ever been adjudicated insolvent. CIBIL- SPK
                          can initiate any Internal/External/3rd Party
                          Verification with respect to Loan Application.
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="agreeTerms"
                            onChange={handleInputChange}
                          />{" "}
                          I agree to the terms and conditions
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="agreeCreditCheck"
                            onChange={handleInputChange}
                          />{" "}
                          I agree to a credit check
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="agreeDataSharing"
                            onChange={handleInputChange}
                          />{" "}
                          I agree to data sharing
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </TabPane>

              {/* Tab 5 - Documents */}
              <TabPane tabId={5}>
                <Row>
                  <Col className="col-12">
                    <CardBody className="position-relative">
                      {/* Preview images in a circular frame */}
                      <div
                        className="position-absolute"
                        style={{
                          top: "40px",
                          right: "82px",
                          zIndex: "100",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {profilephoto.map((f, i) => (
                          <div key={i} className="d-flex flex-column align-items-center">
                            {/* Circular Image Preview */}
                            <img
                              src={f.preview}
                              alt={f.name}
                              width="80"
                              height="80"
                              className="rounded-circle border"
                              style={{ objectFit: "cover" }}
                            />
                            <small className="d-block text-center">{f.name}</small>
                            <small className="text-muted">{f.formattedSize}</small>
                            <button
                              type="button"
                              className="btn btn-link btn-sm text-danger p-0"
                              onClick={() => {
                                setprofilephoto(profilephoto.filter((_, index) => index !== i));
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Dropzone for Image Upload */}
                      <Form className="d-flex justify-content-end">
                        <div className="col-md-4 col-lg-3">
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              const newFiles = acceptedFiles.map(file => ({
                                ...file,
                                preview: URL.createObjectURL(file),
                                formattedSize: formatFileSize(file.size)
                              }));
                              setprofilephoto([...profilephoto, ...newFiles]);
                            }}
                            accept={{ "image/*": [] }}
                            maxFiles={1}
                            maxSize={2 * 1024 * 1024}
                            onDropRejected={() => {
                              alert("Invalid file type or size. Please upload a valid file.");
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div className="dropzone" style={{ minHeight: "100px" }}>
                                <div
                                  {...getRootProps()}
                                  className="dz-message p-3 border rounded text-center"
                                  style={{ cursor: "pointer" }}
                                >
                                  <input {...getInputProps()} />
                                  <div className="d-flex flex-column align-items-center">
                                    {/* Placeholder Circle */}
                                    <div
                                      className="rounded-circle d-flex align-items-center justify-content-center border"
                                      style={{
                                        width: "80px",
                                        height: "80px",
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      <i className="bx bx-camera fs-3 text-muted" />
                                    </div>
                                    <h6 className="mb-0 mt-2">Upload Passport Photo</h6>
                                    <small className="text-muted">Click or drag an image</small>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Dropzone>
                          {errors.passportPhoto && (
                            <div className="text-danger small mt-2">{errors.passportPhoto}</div>
                          )}
                        </div>
                      </Form>
                    </CardBody>
                  </Col>
                </Row>

                {/* Form Section */}
                <Form>
                  <Row className="mt-3">
                    <Col md={4} sm={12}>
                      <FormGroup>
                        <Label htmlFor="translatorName">Translator Name</Label>
                        <Input
                          type="text"
                          id="translatorName"
                          name="translatorName"
                          placeholder="Enter Translator Name"
                          {...register("translatorName", { required: "Translator name is required" })}
                        />
                        {errors.translatorName && <p className="text-danger">{errors.translatorName.message}</p>}
                      </FormGroup>
                    </Col>

                    <Col md={4} sm={12}>
                      <FormGroup>
                        <Label htmlFor="translatorPlace">Place</Label>
                        <Input
                          type="text"
                          id="translatorPlace"
                          name="translatorPlace"
                          placeholder="Enter Place"
                          {...register("translatorPlace", { required: "Place is required" })}
                        />
                        {errors.translatorPlace && <p className="text-danger">{errors.translatorPlace.message}</p>}
                      </FormGroup>
                    </Col>

                    <Col md={4} sm={12}>
                      <FormGroup>
                        <Label htmlFor="LoanRegDate">Date</Label>
                        <Input
                          type="date"
                          id="LoanRegDate"
                          name="LoanRegDate"
                          {...register("LoanRegDate", { required: "Date is required" })}
                        />
                        {errors.LoanRegDate && <p className="text-danger">{errors.LoanRegDate.message}</p>}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={12}>
                      <FormGroup>
                        <Label htmlFor="remarks">Remarks</Label>
                        <Input
                          type="textarea"
                          id="remarks"
                          name="remarks"
                          placeholder="Enter remarks"
                          {...register("remarks")}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Button type="submit" color="primary">
                    Submit Application
                  </Button>
                </Form>
              </TabPane>
            </TabContent>

            <ul className="pager wizard twitter-bs-wizard-pager-link">
              <li className={activeTab === 1 ? "previous disabled" : "previous"}>
                <Link
                  to="#"
                  onClick={() => toggleTab(activeTab - 1)}
                  className={activeTab === 1 ? "btn btn-primary disabled" : "btn btn-primary"}
                >
                  <i className="bx bx-chevron-left me-1"></i> Previous
                </Link>
              </li>
              <li className="next">
                <Link
                  to="#"
                  onClick={() => {
                    if (activeTab === 2) {
                      calculateEMI(); // Calculate EMI when in Tab 2 before proceeding
                    } else if (activeTab < 5) {
                      toggleTab(activeTab + 1);
                    }
                  }}
                  className="btn btn-primary"
                >
                  {activeTab === 5 ? "Submit" : "Next"} <i className="bx bx-chevron-right ms-1"></i>
                </Link>
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default LoanProcess;