// ... imports remain unchanged
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
    Alert,
    Table,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import classnames from "classnames";
import { toast } from "react-toastify";
import axios from "axios";

const LoanProcess = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        trigger,
        control,
        setValue,
        watch,
        reset,
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            first_name: "",
            phone: "",
            amount: "",
            term: "",
            termType: "months",
            interestRate: 0,
            purpose: "",
            repaymentSource: "",
            emiSchedule: []
        }
    });

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [successMessage, setSuccessMessage] = useState("");
    const [loanDetails, setLoanDetails] = useState({
        amount: "",
        loanID: "",
        term: "",
        termType: "",
        interestRate: "",
        purpose: "",
        repaymentSource: "",
        emiSchedule: []
    });

    const handleLoanChange = (e) => {
        const { name, value } = e.target;
    
        if (name.startsWith("emiSchedule")) {
            const match = name.match(/emiSchedule\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
    
                setLoanDetails(prev => {
                    const updatedSchedule = [...prev.emiSchedule];
                    updatedSchedule[index] = {
                        ...updatedSchedule[index],
                        [field]: value
                    };
    
                    // If paymentAmount is updated, recalculate pendingAmount
                    if (field === "paymentAmount") {
                        const emiAmount = parseFloat(updatedSchedule[index].emiTotalMonth) || 0;
                        const paymentAmount = parseFloat(value) || 0;
                        updatedSchedule[index].pendingAmount = (emiAmount - paymentAmount).toFixed(2);
                    }
    
                    return {
                        ...prev,
                        emiSchedule: updatedSchedule
                    };
                });
            }
        } else {
            setLoanDetails(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateApplicantBackend = async (applicantData) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/apply-loan/loan-applications/validate/`,
                {
                    first_name: applicantData.first_name.trim(),
                    phone: applicantData.phone.trim()
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.valid) {
                return {
                    valid: true,
                    message: response.data.message,
                    application: response.data.application
                };
            }
            return {
                valid: false,
                message: response.data?.message || "Validation failed"
            };
        } catch (error) {
            console.error("Validation error:", error);
            return {
                valid: false,
                message: error.response?.data?.message ||
                    error.response?.data?.detail ||
                    "Network error during validation"
            };
        } finally {
            setLoading(false);
        }
    };

    const onFinalSubmit = async () => {
        setLoading(true);
        const loanID = loanDetails.loanID;
    
        if (!loanID) {
            toast.error("❌ Loan ID not found. Cannot update EMI schedule.");
            setLoading(false);
            return;
        }
    
        const API_URL = `${process.env.REACT_APP_API_BASE_URL}/apply-loan/loan-applications/${loanDetails.loanID}/`;
    
        try {
            console.log("Sending PATCH to:", API_URL);
            console.log("Payload:", loanDetails.emiSchedule);
    
            const response = await axios.patch(API_URL, {
                emiSchedule: loanDetails.emiSchedule
            });
    
            setSuccessMessage('✅ EMI Schedule updated successfully!');
            reset();
            setLoanDetails({
                amount: "",
                loanID: "",
                term: "",
                termType: "",
                interestRate: "",
                purpose: "",
                repaymentSource: "",
                emiSchedule: []
            });
            setActiveTab(1);
        } catch (error) {
            console.error("PATCH error:", error);
            const errorMessage = error.response?.data?.message || '❌ Error updating EMI schedule.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setLoanDetails({
            amount: "",
            term: "",
            loanID: "",
            termType: "",
            interestRate: "",
            purpose: "",
            repaymentSource: "",
            emiSchedule: []
        });
        reset();
        setSuccessMessage("");
    };


    const handleNext = async () => {
        if (activeTab !== 1) return;

        // Validate form fields
        const isValid = await trigger(["first_name", "phone"]);
        if (!isValid) {
            toast.error("Please correct the form errors");
            return;
        }

        const values = getValues();
        const validation = await validateApplicantBackend(values);

        if (!validation.valid) {
            toast.error(validation.message);
            return;
        }

        // Update loan details if validation succeeded
        if (validation.application) {
            setLoanDetails({
                amount: validation.application.amount,
                loanID: validation.application.loanID,
                term: validation.application.term,
                termType: validation.application.termType,
                interestRate: validation.application.interestRate,
                purpose: validation.application.purpose || "",
                repaymentSource: validation.application.repaymentSource || "",
                emiSchedule: validation.application.emiSchedule || []
            });
        }

        // Move to next tab
        toggleTab(2);
    };
    
    const calculateSummary = () => {
        let totalPaid = 0;
        let totalPending = 0;
        let paidEmis = 0;
        let totalEmiAmount = 0;
        let totalPrincipalPaid = 0;

        loanDetails.emiSchedule?.forEach((emi) => {
            totalPaid += parseFloat(emi.paymentAmount || 0);
            totalPending += parseFloat(emi.pendingAmount || 0);
            totalEmiAmount += parseFloat(emi.emiTotalMonth || 0);
            totalPrincipalPaid += parseFloat(emi.principalPaid || 0);

            if (emi.paymentAmount && parseFloat(emi.paymentAmount) > 0) {
                paidEmis++;
            }
        });

        return {
            totalPaid,
            totalPending,
            paidEmis,
            totalEmiAmount,
            totalPrincipalPaid
        };
    };


    const toggleTab = (tab) => {
        if (tab >= 1 && tab <= 2) {
            setActiveTab(tab);  // Switch between Tab 1 and Tab 2
        }
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
                            {[1, 2].map((tabIndex) => (
                                <NavItem key={tabIndex}>
                                    <NavLink
                                        className={classnames({ active: activeTab === tabIndex })}
                                        style={{ cursor: activeTab === tabIndex ? 'default' : 'pointer' }}
                                    >
                                        <div className="step-icon" id={`step${tabIndex}`}>
                                            <i className={`bx ${tabIndex === 1 ? 'bx-user' : 'bx-rupee'}`}></i>
                                            <UncontrolledTooltip placement="top" target={`step${tabIndex}`}>
                                                {tabIndex === 1 ? 'Applicant' : 'Loan Details'}
                                            </UncontrolledTooltip>
                                        </div>
                                    </NavLink>
                                </NavItem>
                            ))}
                        </ul>

                        <Form onSubmit={handleSubmit(onFinalSubmit)}>
                            <TabContent activeTab={activeTab}>
                                {/* Tab 1 - Applicant Info */}
                                <TabPane tabId={1}>
                                    <div className="text-center mb-4">
                                        <h5>Applicant Information</h5>
                                        <p className="card-title-desc">Enter applicant name and phone to verify.</p>
                                    </div>

                                    <Row className="justify-content-center">
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="first_name">Full Name</Label>
                                                <Controller
                                                    name="first_name"
                                                    control={control}
                                                    rules={{ required: "Full name is required" }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <Input
                                                            id="first_name"
                                                            type="text"
                                                            placeholder="Enter applicant's full name"
                                                            autoComplete="name"
                                                            invalid={!!error}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {errors.first_name && (
                                                    <span className="text-danger small">{errors.first_name.message}</span>
                                                )}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor="phone">Mobile Number</Label>
                                                <Controller
                                                    name="phone"
                                                    control={control}
                                                    rules={{
                                                        required: "Mobile number is required",
                                                        pattern: {
                                                            value: /^[6-9]\d{9}$/,
                                                            message: "Invalid Indian Mobile number",
                                                        },
                                                    }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <Input
                                                            id="phone"
                                                            type="tel"
                                                            placeholder="Enter 10-digit Mobile number"
                                                            autoComplete="tel-national"
                                                            invalid={!!error}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {errors.phone && (
                                                    <span className="text-danger small">{errors.phone.message}</span>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </TabPane>

                                {/* Tab 2 - Loan Details */}
                                <TabPane tabId={2}>
                                    <div className="text-center mb-4">
                                        <h5>Loan Details</h5>
                                        <p className="card-title-desc">Fetched Loan Info & Editable EMI Schedule</p>
                                    </div>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Name</Label>
                                                <Input type="text" value={getValues("first_name")} readOnly />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Phone</Label>
                                                <Input type="text" value={getValues("phone")} readOnly />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Loan Id</Label>
                                                <Input type="text" value={loanDetails.loanID} readOnly />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Amount</Label>
                                                <Input type="text" value={loanDetails.amount} readOnly />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Term</Label>
                                                <Input type="text" value={loanDetails.term} readOnly />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Term Type</Label>
                                                <Input
                                                    type="text"
                                                    value={
                                                        {
                                                            1: 'Days',
                                                            2: 'Weeks',
                                                            3: 'Months',
                                                            4: 'Years'
                                                        }[loanDetails.termType] || 'Unknown'
                                                    }
                                                    readOnly
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Interest Rate</Label>
                                                <Input type="text" value={loanDetails.interestRate} readOnly />
                                            </FormGroup>
                                        </Col>

                                    </Row>

                                    {/* EMI Table */}
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup>
                                                <Label>EMI Schedule</Label>
                                                <Table bordered>
                                                    <thead>
                                                        <tr>
                                                            <th>EMI No.</th>
                                                            <th>EMI Start Date</th>
                                                            <th>EMI Amount</th>
                                                            <th>Interest</th>
                                                            <th>Principal Paid</th>
                                                            <th>Remaining Balance</th>
                                                            <th>Payment Amount</th>
                                                            <th>Pending Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {loanDetails.emiSchedule.map((emi, index) => (
                                                            <tr key={emi.id || index}>
                                                                <td>{emi.month}</td>
                                                                <td>{emi.emiStartDate}</td>
                                                                <td>{emi.emiTotalMonth}</td>
                                                                <td>{emi.interest}</td>
                                                                <td>{emi.principalPaid}</td>
                                                                <td>{emi.remainingBalance}</td>
                                                                <td>
                                                                    <Input
                                                                        type="number"
                                                                        name={`emiSchedule[${index}].paymentAmount`}
                                                                        value={emi.paymentAmount || ""}
                                                                        onChange={handleLoanChange}
                                                                        autoComplete="off"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Input
                                                                        type="number"
                                                                        name={`emiSchedule[${index}].pendingAmount`}
                                                                        value={emi.pendingAmount || ""}
                                                                        onChange={handleLoanChange}
                                                                        autoComplete="off"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </FormGroup>

                                            {/* 🔽 Payment Summary Section */}
                                            {loanDetails.emiSchedule.length > 0 && (
                                                <div className="mt-4">
                                                    <h5 className="mb-3">💰 Payment Summary</h5>
                                                    <div className="card shadow-sm border-0">
                                                        <div className="card-body">
                                                            {(() => {
                                                                const {
                                                                    totalPaid,
                                                                    totalPending,
                                                                    paidEmis,
                                                                    totalEmiAmount,
                                                                    totalPrincipalPaid
                                                                } = calculateSummary();

                                                                return (
                                                                    <div className="row text-center">
                                                                        <div className="col-md-4 mb-3">
                                                                            <div className="p-3 bg-light rounded">
                                                                                <h6 className="text-muted">Total Amount Paid</h6>
                                                                                <h5 className="text-success fw-bold">₹{totalPaid.toFixed(2)}</h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4 mb-3">
                                                                            <div className="p-3 bg-light rounded">
                                                                                <h6 className="text-muted">Total Pending</h6>
                                                                                <h5 className="text-danger fw-bold">₹{totalPending.toFixed(2)}</h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4 mb-3">
                                                                            <div className="p-3 bg-light rounded">
                                                                                <h6 className="text-muted">EMIs Paid</h6>
                                                                                <h5 className="text-primary fw-bold">{paidEmis}</h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6 mb-3">
                                                                            <div className="p-3 bg-light rounded">
                                                                                <h6 className="text-muted">Total EMI Amount</h6>
                                                                                <h5 className="text-dark fw-bold">₹{totalEmiAmount.toFixed(2)}</h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6 mb-3">
                                                                            <div className="p-3 bg-light rounded">
                                                                                <h6 className="text-muted">Total Principal Paid</h6>
                                                                                <h5 className="text-dark fw-bold">₹{totalPrincipalPaid.toFixed(2)}</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Col>
                                    </Row>
                                </TabPane>
                            </TabContent>

                            {/* Navigation Buttons */}
                            <ul className="pager wizard twitter-bs-wizard-pager-link mt-4">
                                <li className={activeTab === 1 ? "previous disabled" : "previous"}>
                                    <Button
                                        color="primary"
                                        onClick={() => toggleTab(activeTab - 1)}
                                        disabled={activeTab === 1 || loading}
                                    >
                                        <i className="bx bx-chevron-left me-1"></i> Previous
                                    </Button>
                                </li>

                                <li className="next">
                                    {activeTab === 2 ? (
                                        <div className="d-flex justify-content-end gap-2">
                                            <Button color="danger" onClick={handleReset}>
                                                Reset
                                            </Button>
                                            <Button color="success" type="submit" disabled={loading}>
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <> Submit <i className="bx bx-check-circle ms-1"></i> </>
                                                )}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            color="primary"
                                            type="button"
                                            onClick={handleNext}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Verifying...
                                                </>
                                            ) : (
                                                <> Next <i className="bx bx-chevron-right ms-1"></i> </>
                                            )}
                                        </Button>
                                    )}
                                </li>
                            </ul>

                            {successMessage && <Alert color="success" className="mt-3">{successMessage}</Alert>}
                        </Form>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default LoanProcess;
