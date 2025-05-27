import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Button,
  Table,
  Badge
} from 'reactstrap';
import { useParams, useNavigate, Link } from "react-router-dom";
import { get as apiGet } from '../../helpers/api_helper';
import { toast } from 'react-toastify';
import FeatherIcon from "feather-icons-react";

const getTitle = (value) => {
  const titles = { "1": "Mr.", "2": "Mrs.", "3": "Ms.", "4": "Dr." };
  return titles[String(value)] || value || 'N/A';
};

const getGender = (value) => {
  const genders = { "1": "Male", "2": "Female", "3": "Other" };
  return genders[String(value)] || value || 'N/A';
};

const EmployeeStatusView = () => {
  const { employeePk } = useParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!employeePk) {
        setError("Employee ID not provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/";
        const data = await apiGet(`api/employees/manage-profiles/${employeePk}/`);

        if (!data) throw new Error("No data received for employee.");

        setEmployeeData({
          ...data,
          id_proofs: data.id_proofs || [],
          groups: data.groups || [],
        });

      } catch (err) {
        console.error("Error fetching employee details:", err);
        const errorMsg = err.response?.data?.detail || err.message || "Failed to fetch employee details";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeePk]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="page-content d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="ms-3">Loading Employee Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <Container>
          <div className="alert alert-danger text-center">
            <h4>Error Loading Data</h4>
            <p>{error}</p>
            <Button color="primary" onClick={() => navigate("/employeelistpage")}>Back to Employee List</Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="page-content">
        <Container>
          <div className="alert alert-warning text-center">No employee data found.</div>
          <Button color="primary" onClick={() => navigate("/employeelistpage")}>Back to Employee List</Button>
        </Container>
      </div>
    );
  }

  // Determine overall status
  const isActive = employeeData.is_active;
  const isDeleted = employeeData.is_deleted;
  const hasLeavingDate = !!employeeData.leaving_date;
  let statusText = "Unknown";
  let statusBadgeClass = "bg-secondary";

  if (isActive && !isDeleted && !hasLeavingDate) {
    statusText = "Active";
    statusBadgeClass = "bg-success";
  } else if (hasLeavingDate || isDeleted) {
    statusText = "Inactive";
    statusBadgeClass = "bg-danger";
  } else if (!isActive && !isDeleted && !hasLeavingDate) {
    statusText = "Disabled";
    statusBadgeClass = "bg-warning text-dark";
  }

  // Summary data for the image
  const summaryData = [
    { label: 'Employee ID', value: employeeData.employee_id },
    { label: 'Role', value: employeeData.role },
    { label: 'Joining Date', value: formatDate(employeeData.joining_date) },
    { label: 'Status', value: statusText, badgeClass: statusBadgeClass }
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Link to="/employeelistpage" className="btn btn-outline-secondary">
              <FeatherIcon icon="arrow-left" className="me-1" /> Back to Employee List
            </Link>
          </Col>
        </Row>
        
        {/* Summary Card */}
        <Card className="shadow-sm mb-4">
          <CardBody className="p-4">
            <Row className="align-items-center">
              <Col md={2} className="text-center mb-3 mb-md-0">
                {employeeData.employee_photo ? (
                  <img
                    src={employeeData.employee_photo}
                    alt={`${employeeData.first_name} ${employeeData.last_name}`}
                    className="img-fluid rounded-circle shadow"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-light text-secondary d-flex align-items-center justify-content-center rounded-circle mx-auto"
                       style={{ width: '120px', height: '120px', fontSize: '3rem' }}>
                    <FeatherIcon icon="user" />
                  </div>
                )}
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <h3 className="mb-1">{getTitle(employeeData.title_choice)} {employeeData.first_name} {employeeData.last_name}</h3>
                <p className="text-muted mb-2">{employeeData.email}</p>
                <div>
                  <Badge color="info" className="me-2">
                    <FeatherIcon icon="phone" size={14} className="me-1" /> {employeeData.phone_number || 'N/A'}
                  </Badge>
                  <Badge color="secondary">
                    <FeatherIcon icon="calendar" size={14} className="me-1" /> {formatDate(employeeData.date_of_birth_detail)}
                  </Badge>
                </div>
              </Col>
              <Col md={6}>
                <Card className="border-0 bg-light">
                  <CardBody className="p-3">
                    <Row>
                      {summaryData.map((item, index) => (
                        <Col xs={6} key={index} className="mb-2">
                          <small className="text-muted d-block">{item.label}</small>
                          {item.badgeClass ? (
                            <Badge className={item.badgeClass}>{item.value}</Badge>
                          ) : (
                            <strong>{item.value}</strong>
                          )}
                        </Col>
                      ))}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Main Details Card */}
        <Card className="shadow-sm">
          <CardHeader className="bg-light py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0 card-title">
                <FeatherIcon icon="user-check" className="me-2" />
                Employee Details
              </h4>
              <span className={`badge fs-6 ${statusBadgeClass}`}>
                Status: {statusText}
              </span>
            </div>
          </CardHeader>

          <CardBody className="p-4">
            {/* Personal Information */}
            <section className="mb-4 pb-4 border-bottom">
              <h5 className="mb-3 text-primary d-flex align-items-center">
                <FeatherIcon icon="user" size={20} className="me-2" />
                Personal Information
              </h5>
              <Row>
                 <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Full Name</span>
                    <p className="fw-bold">{getTitle(employeeData.title_choice)} {employeeData.first_name} {employeeData.last_name}</p>
                  </div>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Username</span>
                    <p className="fw-bold">{employeeData.username}</p>
                  </div>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Gender</span>
                    <p className="fw-bold">{getGender(employeeData.gender_choice)}</p>
                  </div>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Date of Birth</span>
                    <p className="fw-bold">{formatDate(employeeData.date_of_birth_detail)}</p>
                  </div>
                </Col>
               
              </Row>
            </section>

            {/* Contact Information */}
            <section className="mb-4 pb-4 border-bottom">
              <h5 className="mb-3 text-primary d-flex align-items-center">
                <FeatherIcon icon="mail" size={20} className="me-2" />
                Contact Information
              </h5>
              <Row>
                <Col md={6} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Email</span>
                    <p className="fw-bold">{employeeData.email}</p>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Phone</span>
                    <p className="fw-bold">{employeeData.phone_number || 'N/A'}</p>
                  </div>
                </Col>
              </Row>
            </section>

            {/* Address Information */}
            <section className="mb-4 pb-4 border-bottom">
              <h5 className="mb-3 text-primary d-flex align-items-center">
                <FeatherIcon icon="map-pin" size={20} className="me-2" />
                Address Information
              </h5>
              <Row>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Address Line 1</span>
                    <p className="fw-bold">{employeeData.address_line1 || 'N/A'}</p>
                  </div>
                </Col>
               
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">City/District</span>
                    <p className="fw-bold">{employeeData.city_district || 'N/A'}</p>
                  </div>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">State/Province</span>
                    <p className="fw-bold">{employeeData.state_province || 'N/A'}</p>
                  </div>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Country</span>
                    <p className="fw-bold">{employeeData.country || 'N/A'}</p>
                  </div>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Postal Code</span>
                    <p className="fw-bold">{employeeData.postal_code || 'N/A'}</p>
                  </div>
                </Col>
              </Row>
            </section>

            {/* Employment Details */}
            <section className="mb-4 pb-4 border-bottom">
              <h5 className="mb-3 text-primary d-flex align-items-center">
                <FeatherIcon icon="briefcase" size={20} className="me-2" />
                Employment Details
              </h5>
              <Row>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Employee ID</span>
                    <p className="fw-bold">{employeeData.employee_id}</p>
                  </div>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Role</span>
                    <p className="fw-bold">{employeeData.role}</p>
                  </div>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Groups</span>
                    <p className="fw-bold">{employeeData.groups.join(', ') || 'N/A'}</p>
                  </div>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Joining Date</span>
                    <p className="fw-bold">{formatDate(employeeData.joining_date)}</p>
                  </div>
                </Col>
                {hasLeavingDate && (
                  <Col md={6} lg={3} className="mb-3">
                    <div className="detail-item">
                      <span className="text-muted">Leaving Date</span>
                      <p className="fw-bold">{formatDate(employeeData.leaving_date)}</p>
                    </div>
                  </Col>
                )}
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Currently Employed</span>
                    <p className={employeeData.is_currently_employed ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {employeeData.is_currently_employed ? "Yes" : "No"}
                    </p>
                  </div>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <div className="detail-item">
                    <span className="text-muted">Account Status</span>
                    <p className={employeeData.is_active ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {employeeData.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </Col>
                {isDeleted && (
                  <Col md={6} lg={3} className="mb-3">
                    <div className="detail-item">
                      <span className="text-muted">Deleted At</span>
                      <p className="fw-bold">{formatDate(employeeData.deleted_at)}</p>
                    </div>
                  </Col>
                )}
              </Row>
            </section>

            {/* ID Proofs */}
            <section className="mb-4">
              <h5 className="mb-3 text-primary d-flex align-items-center">
                <FeatherIcon icon="file-text" size={20} className="me-2" />
                Identification Documents
              </h5>
              {employeeData.id_proofs && employeeData.id_proofs.length > 0 ? (
                <div className="table-responsive">
                  <Table striped bordered hover size="sm">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Document Type</th>
                        <th>Document Number</th>
                        <th>File</th>
                        <th>Uploaded At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeData.id_proofs.map((doc, index) => (
                        <tr key={doc.id}>
                          <td>{index + 1}</td>
                          <td className="text-capitalize">{doc.document_type}</td>
                          <td>{doc.document_number}</td>
                          <td>
                            {doc.document_file_url ? (
                              <Button 
                                color="link" 
                                href={doc.document_file_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-0 text-decoration-none"
                              >
                                <FeatherIcon icon="eye" size={14} className="me-1" /> View
                              </Button>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td>{formatDate(doc.uploaded_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="alert alert-light">
                  No ID proof documents uploaded for this employee.
                </div>
              )}
            </section>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default EmployeeStatusView;