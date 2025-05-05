import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Table } from "reactstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faTimes } from "@fortawesome/free-solid-svg-icons";

const ApprovalStatus = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}api/apply-loan/loan-applications/`);
            setLoans(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching loan applications:', error);
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case true:
                return <FontAwesomeIcon icon={faCheck} style={{ color: "green", fontSize: "1.2em" }} />;
            case false:
                return <FontAwesomeIcon icon={faTimes} style={{ color: "red", fontSize: "1.2em" }} />;
            default:
                return <FontAwesomeIcon icon={faClock} style={{ color: "#FFA500", fontSize: "1.2em" }} />;
        }
    };

    // Calculate total EMI amount from the schedule
    const getTotalEmiAmount = (emiSchedule) => {
        if (!emiSchedule || emiSchedule.length === 0) return 0;
        return emiSchedule.reduce((total, emi) => total + emi.paymentAmount, 0);
    };

    document.title = "Approval Status | SPK Finance";

    return (
        <div className="page-content">
            <Container fluid>
                <Row className="justify-content-between align-items-center mt-3">
                    <Col>
                        <h3>OutStanding</h3>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col>
                        <Card>
                            <CardBody>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Loan ID</th>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>EMI Amount</th>
                                            <th>EMI Months</th>
                                            <th>Phone Number</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="text-center">Loading...</td>
                                            </tr>
                                        ) : loans.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center">No loan applications found</td>
                                            </tr>
                                        ) : (
                                            loans.map((loan) => (
                                                <tr key={loan.id}>
                                                    <td>{loan.loanID}</td>
                                                    <td>{loan.LoanRegDate}</td>
                                                    <td>{loan.first_name}</td>
                                                    <td>{getTotalEmiAmount(loan.emiSchedule)}</td>
                                                    <td>{loan.term}</td>
                                                    <td>{loan.phone}</td>
                                                    <td className="text-center">
                                                        {/* You might need to adjust this based on your actual status field */}
                                                        {getStatusIcon(true)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ApprovalStatus;