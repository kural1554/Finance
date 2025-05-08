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
            const filteredLoans = filterLoans(response.data);
            setLoans(filteredLoans);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching loan applications:', error);
            setLoading(false);
        }
    };

    // Filter loans to show only those with pending payments in current month
    const filterLoans = (loans) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
        
        // Calculate date range (29th of previous month to 28th of current month)
        let startDate, endDate;
        if (currentDate.getDate() >= 29) {
            // From 29th of current month to 28th of next month
            startDate = new Date(currentYear, currentMonth - 1, 29);
            endDate = new Date(currentYear, currentMonth, 28);
        } else {
            // From 29th of previous month to 28th of current month
            startDate = new Date(currentYear, currentMonth - 2, 29);
            endDate = new Date(currentYear, currentMonth - 1, 28);
        }

        return loans.filter(loan => {
            // Check if any EMI is in current period and has pending payment
            return loan.emiSchedule.some(emi => {
                const emiDate = new Date(emi.emiStartDate);
                return (
                    emiDate >= startDate && 
                    emiDate <= endDate && 
                    (emi.emiTotalMonth - emi.paymentAmount) > 0
                );
            });
        });
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

    // Calculate pending EMI amount from the schedule
    const getPendingEmiAmount = (emiSchedule) => {
        if (!emiSchedule || emiSchedule.length === 0) return 0;
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        let startDate, endDate;
        if (currentDate.getDate() >= 29) {
            startDate = new Date(currentYear, currentMonth - 1, 29);
            endDate = new Date(currentYear, currentMonth, 28);
        } else {
            startDate = new Date(currentYear, currentMonth - 2, 29);
            endDate = new Date(currentYear, currentMonth - 1, 28);
        }

        return emiSchedule
            .filter(emi => {
                const emiDate = new Date(emi.emiStartDate);
                return emiDate >= startDate && emiDate <= endDate;
            })
            .reduce((total, emi) => total + (emi.emiTotalMonth - emi.paymentAmount), 0);
    };

    document.title = "Outstanding | SPK Finance";

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
                                            <th>Pending EMI Amount</th>
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
                                                <td colSpan="7" className="text-center">No pending loan applications found</td>
                                            </tr>
                                        ) : (
                                            loans.map((loan) => (
                                                <tr key={loan.id}>
                                                    <td>{loan.loanID}</td>
                                                    <td>{loan.LoanRegDate}</td>
                                                    <td>{loan.first_name}</td>
                                                    <td>{getPendingEmiAmount(loan.emiSchedule)}</td>
                                                    <td>{loan.term}</td>
                                                    <td>{loan.phone}</td>
                                                    <td className="text-center">
                                                        {getStatusIcon(getPendingEmiAmount(loan.emiSchedule) === 0)}
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