import React, { useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    FormFeedback,
    Alert
} from "reactstrap";

const LoanPayment = () => {
    const [formData, setFormData] = useState({
        name: "",
        loanId: "",
    });

    const [errors, setErrors] = useState({
        name: false,
        loanId: false,
    });

    const [loanDetails, setLoanDetails] = useState({
        totalAmount: "",
        remainingAmount: "",
        emiAmount: "",
        totalMonths: "",
        remainingMonths: "",
        enterAmount: "",
        cashAmount: "",
        onlineTransaction: "",
        transactionId: "",
    });

    const [showSecondForm, setShowSecondForm] = useState(false);
    const [showTransactionId, setShowTransactionId] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Ensure only numeric values for loanId
        if (name === "loanId" && !/^\d*$/.test(value)) return;

        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: false });
    };

    const handleLoanChange = (e) => {
        const { name, value } = e.target;
        setLoanDetails({ ...loanDetails, [name]: value });

        if (name === "onlineTransaction") {
            setShowTransactionId(value.trim() !== "");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = { name: false, loanId: false };

        if (formData.name.trim() === "") newErrors.name = true;
        if (formData.loanId.trim() === "") newErrors.loanId = true;

        setErrors(newErrors);

        if (!newErrors.name && !newErrors.loanId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/loan/${formData.loanId}/`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLoanDetails(data);
                    setShowSecondForm(true);
                } else {
                    alert("Loan details not found.");
                }
            } catch (error) {
                console.error("Error fetching loan details:", error);
            }
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/api/loan/payment/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loanDetails),
            });

            if (response.ok) {
                setSuccessMessage("Form submitted successfully! ✅");
            } else {
                alert("Failed to submit loan payment.");
            }
        } catch (error) {
            console.error("Error submitting payment:", error);
        }
    };

    const handleReset = () => {
        setFormData({ name: "", loanId: "" });
        setLoanDetails({
            totalAmount: "",
            remainingAmount: "",
            emiAmount: "",
            totalMonths: "",
            remainingMonths: "",
            enterAmount: "",
            cashAmount: "",
            onlineTransaction: "",
            transactionId: "",
        });
        setShowSecondForm(false);
        setShowTransactionId(false);
        setSuccessMessage("");
    };

    document.title = "Payment | SPK Finance";

    return (
        <div className="page-content">
            <Container fluid>
                <Row className="justify-content-center mt-5">
                    <Col md={6}>
                        <Card>
                            <CardHeader className="text-center">
                                <h4 className="card-title">Loan Payment Form</h4>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label for="name">Name</Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            autoComplete="off" 
                                            invalid={errors.name}
                                        />
                                        {errors.name && <FormFeedback>Name is required.</FormFeedback>}
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="loanId">Loan ID</Label>
                                        <Input
                                            type="number"
                                            name="loanId"
                                            id="loanId"
                                            placeholder="Enter your Loan ID"
                                            value={formData.loanId}
                                            onChange={handleChange}
                                            invalid={errors.loanId}
                                            min="0" // Prevents negative numbers
                                            autoComplete="off" 
                                            style={{ appearance: "textfield" }} // Removes spinner
                                            onKeyDown={(e) => {
                                                if (["e", "E", "+", "-"].includes(e.key)) {
                                                    e.preventDefault(); // Blocks non-numeric characters
                                                }
                                            }}
                                        />
                                        {errors.loanId && <FormFeedback>Loan ID is required.</FormFeedback>}
                                    </FormGroup>

                                    <div className="text-end">
                                        <Button color="primary" type="submit">
                                            Submit
                                        </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>

                        {showSecondForm && (
                            <Card className="mt-4">
                                <CardHeader className="text-center">
                                    <h4 className="card-title">Loan Details</h4>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={handleFinalSubmit}>
                                        <Row>
                                            {Object.keys(loanDetails).map((key) => (
                                                <Col md={6} key={key}>
                                                    <FormGroup>
                                                        <Label for={key}>{key.replace(/([A-Z])/g, " $1")}</Label>
                                                        <Input
                                                            type="text"
                                                            name={key}
                                                            placeholder={`Enter ${key}`}
                                                            value={loanDetails[key]}
                                                            onChange={handleLoanChange}
                                                            autoComplete="off" 
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            ))}
                                        </Row>

                                        <div className="text-end">
                                            <Button color="success" type="submit">
                                                Submit Loan Details
                                            </Button>
                                            <Button color="danger" className="ms-2" onClick={handleReset}>
                                                Reset
                                            </Button>
                                        </div>
                                    </Form>
                                    {successMessage && <Alert color="success" className="mt-3">{successMessage}</Alert>}
                                </CardBody>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoanPayment;
