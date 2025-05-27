// Loanpayment.js
import React, { useState, useEffect } from "react";
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
  Alert,
  Table,
  Badge,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import classnames from "classnames";
import { toast } from "react-toastify";
import { post as apiPost, patch as apiPatch } from "../../helpers/api_helper";

const LoanProcess = () => {
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    control,
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      first_name: "",
      phone: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [loanDetails, setLoanDetails] = useState({
    db_id: null,
    amount: "",
    loanID: "",
    term: "",
    termType: "",
    interestRate: "",
    purpose: "",
    repaymentSource: "",
    status: "",
    status_display: "", // To store the display name of the status
    emiSchedule: [],
  });

  const [isLoanCompleted, setIsLoanCompleted] = useState(false);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [loanStatusMessage, setLoanStatusMessage] = useState("");

  useEffect(() => {
    const currentStatus = loanDetails.status;
    setIsLoanCompleted(currentStatus === 'PAID');

    const payableStatuses = ['ACTIVE', 'OVERDUE'];
    if (payableStatuses.includes(currentStatus) || (currentStatus === 'APPROVED' && loanDetails.loanID)) {
        setCanMakePayment(true);
    } else {
        setCanMakePayment(false);
    }

    if (currentStatus === 'PAID') {
        setLoanStatusMessage("This loan has been fully paid and closed.");
    } else if (!loanDetails.db_id) { // If no loan is loaded (e.g., after reset)
        setLoanStatusMessage(""); // Clear message if no loan is loaded
    }
    // For other statuses, loanStatusMessage is primarily set by handleNext
  }, [loanDetails.status, loanDetails.loanID, loanDetails.db_id]);


  const handleLoanChange = (e) => {
    if (isLoanCompleted || !canMakePayment) return;

    const { name, value } = e.target;
    if (name.startsWith("emiSchedule")) {
      const match = name.match(/emiSchedule\[(\d+)\]\.(\w+)/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        setLoanDetails((prev) => {
          const updatedSchedule = [...prev.emiSchedule];
          if (!updatedSchedule[index]) updatedSchedule[index] = {}; // Should not happen
          
          updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
          if (field === "paymentAmount") {
            const emiTotal = parseFloat(updatedSchedule[index].emiTotalMonth) || 0;
            const paymentMade = parseFloat(value) || 0;
            updatedSchedule[index].pendingAmount = (emiTotal - paymentMade).toFixed(2);
          }
          return { ...prev, emiSchedule: updatedSchedule };
        });
      }
    }
  };
  
  const calculateSummary = (schedule = loanDetails.emiSchedule) => {
    let totalPaid = 0, totalPending = 0, paidEmis = 0, totalEmiAmount = 0, totalPrincipalScheduled = 0;
    schedule?.forEach((emi) => {
      const paymentAmount = parseFloat(emi.paymentAmount || 0);
      const emiTotalMonth = parseFloat(emi.emiTotalMonth || 0);
      totalPaid += paymentAmount;
      totalEmiAmount += emiTotalMonth;
      totalPrincipalScheduled += parseFloat(emi.principalPaid || 0);
      if (paymentAmount > 0 && (emiTotalMonth - paymentAmount <= 0.005)) paidEmis++;
    });
    totalPending = Math.max(0, totalEmiAmount - totalPaid);
    return { totalPaid, totalPending, paidEmis, totalEmiAmount, totalPrincipalScheduled };
  };

  const validateApplicantBackend = async (applicantData) => {
    setLoading(true);
    setLoanStatusMessage(""); 
    try {
      const response = await apiPost(
        `api/loan-applications/loan-applications/validate-applicant/`,
        {
          first_name: applicantData.first_name.trim(),
          phone: applicantData.phone.trim(),
        }
      );
      return response; 
    } catch (error) {
      console.error("Validation API error:", error);
      let message = "Network error during validation";
      if (error.response && error.response.data) {
        const errData = error.response.data;
        message = errData.message || errData.detail || (typeof errData === "string" ? errData : "Validation request failed");
      } else if (error.message) {
        message = error.message;
      }
      return { valid: false, message: message, application: null, actionable_payment: false };
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (activeTab !== 1) return;
    const isValidForm = await trigger(["first_name", "phone"]);
    if (!isValidForm) {
      toast.error("Please correct the form errors");
      return;
    }

    const values = getValues();
    const validationResponse = await validateApplicantBackend(values);

    if (!validationResponse || typeof validationResponse.valid === 'undefined') {
        toast.error("Unexpected response from validation server.");
        setLoanDetails({ db_id: null, amount: "", loanID: "", term: "", termType: "", interestRate: "", purpose: "", repaymentSource: "", status: "", status_display:"", emiSchedule: [] });
        setLoanStatusMessage("Error validating applicant.");
        return;
    }
    
    if (!validationResponse.valid || !validationResponse.application) {
      toast.error(validationResponse.message || "Applicant validation failed or no loan found.");
      setLoanDetails({ db_id: null, amount: "", loanID: "", term: "", termType: "", interestRate: "", purpose: "", repaymentSource: "", status: "", status_display:"", emiSchedule: [] });
      setLoanStatusMessage(validationResponse.message || "No loan application found.");
      return;
    }
    
    const { application, actionable_payment, message } = validationResponse;

    setLoanDetails({
      db_id: application.id,
      amount: application.amount,
      loanID: application.loanID,
      term: application.term,
      termType: application.termType,
      interestRate: application.interestRate,
      purpose: application.purpose || "",
      repaymentSource: application.repaymentSource || "",
      status: application.status,
      status_display: application.status_display || application.status,
      emiSchedule: Array.isArray(application.emiSchedule)
        ? application.emiSchedule.map(emi => ({
            ...emi,
            pendingAmount: (parseFloat(emi.emiTotalMonth || 0) - parseFloat(emi.paymentAmount || 0)).toFixed(2)
          }))
        : [],
    });
    
    
    setLoanStatusMessage(message || "");

    if (application.status === 'PAID') {
        toast.info(message || "This loan has already been fully paid.");
    } else if (!actionable_payment) {
        toast.warn(message || "Loan found, but not ready for payment at this time.");
    }
    
    toggleTab(2);
  };

  const onFinalSubmit = async () => {
    if (isLoanCompleted) {
        toast.info("This loan is already fully paid and closed.");
        return;
    }
    if (!canMakePayment) {
        toast.warn(loanStatusMessage || "Payments are not currently accepted for this loan's status.");
        return;
    }

    setLoading(true);
    const databasePk = loanDetails.db_id;
    if (!databasePk) { 
        toast.error("❌ Loan reference not found.");
        setLoading(false); 
        return; 
    }

    const relativeUrl = `api/loan-applications/loan-applications/${databasePk}/`;
    try {
      const payloadEmiSchedule = loanDetails.emiSchedule.map((emi) => ({
        id: emi.id && typeof emi.id === 'number' ? emi.id : undefined, 
        paymentAmount: parseFloat(emi.paymentAmount || 0).toFixed(2),
        pendingAmount: parseFloat(emi.pendingAmount || 0).toFixed(2),
        month: emi.month, emiStartDate: emi.emiStartDate,
        emiTotalMonth: parseFloat(emi.emiTotalMonth || 0).toFixed(2),
        interest: parseFloat(emi.interest || 0).toFixed(2),
        principalPaid: parseFloat(emi.principalPaid || 0).toFixed(2),
        remainingBalance: parseFloat(emi.remainingBalance || 0).toFixed(2),
      }));

      const responseData = await apiPatch(relativeUrl, { emiSchedule: payloadEmiSchedule });
      
      toast.success("✅ EMI Schedule updated successfully!");
      
      if (responseData && responseData.id) {
        const currentFormValues = getValues(); // To preserve name/phone on Tab 2
        setLoanDetails({ 
            // Preserve form values explicitly if they are not part of loanDetails state
            first_name: currentFormValues.first_name, 
            phone: currentFormValues.phone,
            // Update with API response
            db_id: responseData.id, 
            amount: responseData.amount, 
            loanID: responseData.loanID,
            term: responseData.term, 
            termType: responseData.termType, 
            interestRate: responseData.interestRate,
            purpose: responseData.purpose || "", 
            repaymentSource: responseData.repaymentSource || "",
            status: responseData.status,
            status_display: responseData.status_display || responseData.status,
            emiSchedule: Array.isArray(responseData.emiSchedule)
              ? responseData.emiSchedule.map(emi => ({
                  ...emi,
                  pendingAmount: (parseFloat(emi.emiTotalMonth || 0) - parseFloat(emi.paymentAmount || 0)).toFixed(2)
                }))
              : [],
        });
      } else {
          handleReset();
        toast.error("❌ Unexpected response from server after update.");
      }
    } catch (error) {
        console.error("PATCH error:", error);
        let errorMessage = "❌ Error updating EMI schedule.";
        if (error.response && error.response.data) {
            const errData = error.response.data;
            if (typeof errData === "string") errorMessage = errData;
            else if (errData.detail) errorMessage = errData.detail;
            else if (errData.emiSchedule && Array.isArray(errData.emiSchedule) && errData.emiSchedule.length > 0) {
                const firstEmiError = errData.emiSchedule[0];
                if (typeof firstEmiError === 'string') errorMessage = `EMI Error: ${firstEmiError}`;
                else if (typeof firstEmiError === 'object') errorMessage = `EMI Data Error: ${JSON.stringify(firstEmiError)}`;
            } else {
              errorMessage = errData.message || JSON.stringify(errData);
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        toast.error(errorMessage);
    } 
    finally { setLoading(false); }
  };

  

  const toggleTab = (tab) => { if (tab >= 1 && tab <= 2) setActiveTab(tab); };
  const visualSummary = loanDetails.emiSchedule.length > 0 ? calculateSummary() : null;

 return (
    <React.Fragment>
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="card-title mb-0"><i className="bx bx-credit-card me-2"></i> Loan Repayment Portal</h4>
            {loanDetails.loanID && (
              <Badge 
                color={isLoanCompleted ? "success" : (canMakePayment ? "info" : "warning")} 
                className="fs-6"
              >
                Loan ID: {loanDetails.loanID} 
                {isLoanCompleted ? " (Completed)" : (!canMakePayment && loanDetails.status ? ` (${loanDetails.status_display || loanDetails.status})` : "")}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <div id="basic-pills-wizard" className="twitter-bs-wizard">
            <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified mb-4">
              {[1, 2].map((tabIndex) => (
                <NavItem key={tabIndex}>
                  <NavLink
                    className={classnames({
                      active: activeTab === tabIndex,
                      completed: activeTab > tabIndex,
                    })}
                    style={{ cursor: "default" }}
                  >
                    <div className="step-icon" id={`step${tabIndex}`}>
                      <i className={`bx ${tabIndex === 1 ? "bx-user-check" : "bx-money"}`}></i>
                      <UncontrolledTooltip placement="top" target={`step${tabIndex}`}>
                        {tabIndex === 1 ? "Applicant Verification" : "Payment Details"}
                      </UncontrolledTooltip>
                    </div>
                  </NavLink>
                </NavItem>
              ))}
            </ul>

            <Form onSubmit={handleSubmit(onFinalSubmit)}>
              <TabContent activeTab={activeTab} className="p-3">
                <TabPane tabId={1}>
                  <div className="text-center mb-4">
                    <h4 className="text-primary">Applicant Verification</h4>
                    <p className="text-muted">Enter applicant's name and phone to fetch loan details</p>
                  </div>
                  <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                      <Card className="shadow-none border">
                        <CardBody>
                          <FormGroup>
                            <Label htmlFor="first_name" className="fw-bold">Full Name <span className="text-danger">*</span></Label>
                            <Controller
                              name="first_name"
                              control={control}
                              rules={{ required: "Full name is required" }}
                              render={({ field }) => (
                                <Input id="first_name" type="text" placeholder="Enter applicant's full name" autoComplete="name" invalid={!!errors.first_name} {...field} />
                              )}
                            />
                            {errors.first_name && <span className="text-danger small">{errors.first_name.message}</span>}
                          </FormGroup>
                          <FormGroup>
                            <Label htmlFor="phone" className="fw-bold">Mobile Number <span className="text-danger">*</span></Label>
                            <Controller
                              name="phone"
                              control={control}
                              rules={{
                                required: "Mobile number is required",
                                pattern: { value: /^[6-9]\d{9}$/, message: "Invalid Indian Mobile number" },
                              }}
                              render={({ field }) => (
                                <Input id="phone" type="tel" placeholder="Enter 10-digit Mobile number" autoComplete="tel-national" invalid={!!errors.phone} {...field} />
                              )}
                            />
                            {errors.phone && <span className="text-danger small">{errors.phone.message}</span>}
                          </FormGroup>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tabId={2}>
                  <div className="text-center mb-4">
                    <h4 className="text-primary">Loan Payment Details</h4>
                    <p className="text-muted">Review loan information and update EMI payment status</p>
                  </div>
                  
                  {isLoanCompleted && (
                    <Alert color="success" className="mt-0 mb-4 text-center">
                      <i className="bx bx-check-double fs-3 me-2 align-middle"></i>
                      <strong style={{ fontSize: '1.1rem' }}>Loan Fully Paid & Closed!</strong>
                      <p className="mb-0 mt-1">No further payments are required for this loan.</p>
                    </Alert>
                  )}
                  {!isLoanCompleted && loanStatusMessage && loanDetails.db_id && (
                    <Alert color={canMakePayment ? "info" : "warning"} className="mt-0 mb-4 text-center">
                      <i className={`bx bx-${canMakePayment ? 'info' : (loanDetails.status && loanDetails.status !=='PAID' ? 'error' : 'info')}-circle fs-3 me-2 align-middle`}></i>
                      {loanStatusMessage}
                    </Alert>
                  )}

                  {loanDetails.db_id && (
                    <>
                      <Card className="shadow-none border mb-4">
                        <CardBody>
                          <Row>
                            <Col md={4}><FormGroup><Label className="fw-bold">Name</Label><Input type="text" value={getValues("first_name")} readOnly className="bg-light" /></FormGroup></Col>
                            <Col md={4}><FormGroup><Label className="fw-bold">Phone</Label><Input type="text" value={getValues("phone")} readOnly className="bg-light" /></FormGroup></Col>
                            <Col md={4}><FormGroup><Label className="fw-bold">Loan ID</Label><Input type="text" value={loanDetails.loanID} readOnly className="bg-light" /></FormGroup></Col>
                            <Col md={4}><FormGroup><Label className="fw-bold">Amount</Label><Input type="text" value={loanDetails.amount ? `₹${parseFloat(loanDetails.amount).toLocaleString('en-IN')}` : ''} readOnly className="bg-light" /></FormGroup></Col>
                            <Col md={4}><FormGroup><Label className="fw-bold">Term</Label><Input type="text" value={`${loanDetails.term} ${ { "1": "Days", "2": "Weeks", "3": "Months", "4": "Years" }[loanDetails.termType] || loanDetails.termType || "" }`} readOnly className="bg-light" /></FormGroup></Col>
                            <Col md={4}><FormGroup><Label className="fw-bold">Interest Rate</Label><Input type="text" value={loanDetails.interestRate ? `${loanDetails.interestRate}%` : ''} readOnly className="bg-light" /></FormGroup></Col>
                          </Row>
                        </CardBody>
                      </Card>

                      <Card className="shadow-none border">
                        <CardBody>
                          <h5 className="mb-3"><i className="bx bx-calendar me-2"></i> EMI Schedule</h5>
                          <div className="table-responsive">
                            <Table bordered striped hover className="mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>EMI No.</th>
                                  <th>Due Date</th>
                                  <th>EMI Amt (₹)</th>
                                  <th>Interest (₹)</th>
                                  <th>Principal (₹)</th>
                                  <th>Balance (₹)</th>
                                  <th>Payment Amt (₹)</th>
                                  <th>Pending (₹)</th>
                                  <th>Processed By</th> 
                                  <th>Processed At</th> 
                                </tr>
                              </thead>
                              <tbody>
                                {loanDetails.emiSchedule.map((emi, index) => (
                                  <tr key={emi.id || index}>
                                    <td>{emi.month}</td>
                                    <td>{emi.emiStartDate ? new Date(emi.emiStartDate).toLocaleDateString() : '-'}</td>
                                    <td className="text-end">{parseFloat(emi.emiTotalMonth || 0).toFixed(2)}</td>
                                    <td className="text-end">{parseFloat(emi.interest || 0).toFixed(2)}</td>
                                    <td className="text-end">{parseFloat(emi.principalPaid || 0).toFixed(2)}</td>
                                    <td className="text-end">{parseFloat(emi.remainingBalance || 0).toFixed(2)}</td>
                                    <td>
                                      <Input
                                        type="number" step="0.01" name={`emiSchedule[${index}].paymentAmount`}
                                        value={emi.paymentAmount || ""} onChange={handleLoanChange}
                                        placeholder="0.00" autoComplete="off" bsSize="sm" className="text-end"
                                        onWheel={(e) => e.target.blur()}
                                        onFocus={(e) => { if (isLoanCompleted || !canMakePayment) return; e.target.select(); }}
                                        disabled={isLoanCompleted || !canMakePayment}
                                        style={{ MozAppearance: "textfield", WebkitAppearance: "none", margin: 0 }}
                                      />
                                    </td>
                                    <td className="text-end">
                                      <Input type="text" value={parseFloat(emi.pendingAmount || 0).toFixed(2)} readOnly bsSize="sm" className="text-end bg-light" />
                                    </td>
                                    <td>{emi.payment_processed_by_username || '-'}</td> {/* Display Username */}
                                    <td>{emi.payment_processed_at ? new Date(emi.payment_processed_at).toLocaleString() : '-'}</td> {/* Display Timestamp */}
                                  </tr>
                                ))}
                                {loanDetails.emiSchedule.length === 0 && (
                                  <tr><td colSpan="10" className="text-center py-4"><div className="text-muted">No EMI schedule available for this loan.</div></td></tr>
                                )}
                              </tbody>
                            </Table>
                          </div>

                          {visualSummary && loanDetails.emiSchedule.length > 0 && (
                            <div className="mt-4">
                              <h5 className="mb-3"><i className="bx bx-stats me-2"></i> Payment Summary</h5>
                              <div className="row g-3">
                                {[
                                  { label: "Total Paid", value: visualSummary.totalPaid, icon: "bx-check-circle", color: "success" },
                                  { label: "Total Pending", value: visualSummary.totalPending, icon: "bx-error-circle", color: "danger" },
                                  { label: "EMIs Paid", value: visualSummary.paidEmis, icon: "bx-list-check", color: "primary", isRaw: true },
                                  { label: "Total EMI Amount", value: visualSummary.totalEmiAmount, icon: "bx-credit-card", color: "info" },
                                  { label: "Total Principal (Scheduled)", value: visualSummary.totalPrincipalScheduled, icon: "bx-money", color: "warning" },
                                ].map(item => (
                                  <Col md={item.label === "Total EMI Amount" || item.label === "Total Principal (Scheduled)" ? 6 : 4} key={item.label}>
                                    <div className={`p-3 bg-soft-${item.color} rounded border`}>
                                      <div className="d-flex align-items-center">
                                        <div className="avatar-sm me-3"><span className={`avatar-title bg-${item.color} rounded-circle`}><i className={`bx ${item.icon}`}></i></span></div>
                                        <div>
                                          <p className="text-muted mb-1">{item.label}</p>
                                          <h5 className={`mb-0 text-${item.color}`}>{item.isRaw ? item.value : `₹${item.value.toFixed(2)}`}</h5>
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </>
                  )}
                </TabPane>
              </TabContent>

              <div className="d-flex justify-content-between mt-4">
                <div>
                  {activeTab > 1 && (
                    <Button color="light" onClick={() => toggleTab(activeTab - 1)} disabled={loading} className="me-2">
                      <i className="bx bx-chevron-left me-1"></i> Back
                    </Button>
                  )}
                </div>
                <div>
                  {activeTab === 1 ? (
                    <Button color="primary" type="button" onClick={handleNext} disabled={loading}>
                      {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span> Verifying...</>) : (<>Verify & Proceed <i className="bx bx-chevron-right ms-1"></i></>)}
                    </Button>
                  ) : (
                    <div className="d-flex gap-2">
                     
                      {loanDetails.db_id &&
                        <Button
                          color="success" type="submit"
                          disabled={ loading || !loanDetails.emiSchedule || loanDetails.emiSchedule.length === 0 || isLoanCompleted || !canMakePayment }
                        >
                          {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span> Processing...</>) : (<><i className="bx bx-check-circle me-1"></i> Submit Payments</>)}
                        </Button>
                      }
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default LoanProcess;