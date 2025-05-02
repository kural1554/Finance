import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Table } from "reactstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faTimes } from "@fortawesome/free-solid-svg-icons";

const ApprovalStatus = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/applicants/applicants/');
            setApplicants(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching applicants:', error);
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

    document.title = "Approval Status | SPK Finance";

    return (
        <div className="page-content">
            <Container fluid>
                <Row className="justify-content-between align-items-center mt-3">
                    <Col>
                        <h3>Approval Status</h3>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col>
                        <Card>
                            <CardBody>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>User ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">Loading...</td>
                                            </tr>
                                        ) : applicants.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">No applicants found</td>
                                            </tr>
                                        ) : (
                                            applicants.map((applicant) => (
                                                <tr key={applicant.userID}>
                                                    <td>{applicant.userID}</td>
                                                    <td>{`${applicant.first_name} ${applicant.last_name}`}</td>
                                                    <td>{applicant.email}</td>
                                                    <td>{applicant.phone}</td>
                                                    <td className="text-center">
                                                        {getStatusIcon(applicant.is_approved)}
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
