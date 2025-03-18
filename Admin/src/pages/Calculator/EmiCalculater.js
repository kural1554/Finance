import React, { useState } from "react";
import { Row, Table } from "react-bootstrap";
import {
    Container,
    Col,
    FormGroup,
    Form,
    Card,
    CardBody,
    Input,
    Label,
    Button
} from "reactstrap";

const EmiCalculater = () => {
    // State Hooks
    const [loanAmount, setLoanAmount] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [totalMonths, setTotalMonths] = useState("");
    const [emiDetails, setEmiDetails] = useState([]);

    const calculateEMI = () => {
        if (!loanAmount || !interestRate || !totalMonths) {
            alert("Please enter all values!");
            return;
        }

        let remainingPrincipal = parseFloat(loanAmount);
        let rate = parseFloat(interestRate) / 100; // Monthly rate
        let totalMonthsValue = parseInt(totalMonths);
        let fixedPrincipalPayment = remainingPrincipal / totalMonthsValue;
        let emiBreakdown = [];

        for (let i = 1; i <= totalMonthsValue; i++) {
            let interest = remainingPrincipal * rate; // Calculate the interest
            let emiTotalMonth = interest + fixedPrincipalPayment; // Total EMI per month
            remainingPrincipal -= fixedPrincipalPayment; // Reduce principal

            emiBreakdown.push({
                month: i,
                emiTotalMonth: emiTotalMonth.toFixed(2),
                interest: interest.toFixed(2),
                principalPaid: fixedPrincipalPayment.toFixed(2),
                remainingBalance: remainingPrincipal.toFixed(2),
            });

            if (remainingPrincipal <= 0) break; // Stop loop if fully paid
        }

        setEmiDetails(emiBreakdown);
    };

    document.title = "Calculator | SPK Finance";

    return (
        <div className="page-content">
            <Container fluid>
                <Row className="justify-content-between align-items-center mt-3">
                    <Col>
                        <h3>Cashflow Management</h3>
                    </Col>
                </Row>

                {/* Form Section */}
                <Row className="justify-content-center mt-3" md={12}>
                    <Col >
                        <Card>
                            <CardBody>
                                <Form className="d-flex justify-content-evenly">
                                    <FormGroup>
                                        <Label>LOAN AMOUNT</Label>
                                        <Input
                                            type="number"
                                            placeholder="Enter loan amount"
                                            value={loanAmount}
                                            onChange={(e) => setLoanAmount(e.target.value)}
                                            min={0}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>INTEREST RATE (%)</Label>
                                        <Input
                                            type="number"
                                            placeholder="Enter interest rate"
                                            value={interestRate}
                                            onChange={(e) => setInterestRate(e.target.value)}
                                            min={0}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>TOTAL MONTHS</Label>
                                        <Input
                                            type="number"
                                            placeholder="Enter the months"
                                            value={totalMonths}
                                            onChange={(e) => setTotalMonths(e.target.value)}
                                            min={1}
                                        />
                                    </FormGroup>
                                </Form>
                                <Row className="mt-3">
                                    <Col>
                                        <Button color="primary" onClick={calculateEMI}>
                                            Calculate EMI
                                        </Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* EMI Calculation Results */}
            {emiDetails.length > 0 && (
                <Container className="mt-4" md={10}>
                    <Col >
                        <Row className="justify-content-center mt-3">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                    <th style={{ width: "15%" }}>Month</th>
                                    <th style={{ width: "20%" }}>Total EMI</th>
                                    <th style={{ width: "20%" }}>Interest Paid</th>
                                    <th style={{ width: "20%" }}>Principal Paid</th>
                                    <th style={{ width: "25%" }}>Remaining Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emiDetails.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.month}</td>
                                            <td>{row.emiTotalMonth}</td>
                                            <td>{row.interest}</td>
                                            <td>{row.principalPaid}</td>
                                            <td>{row.remainingBalance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Row>
                    </Col>
                </Container>
            )}
        </div>
    );
};

export default EmiCalculater;
