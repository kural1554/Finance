import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import { useLocation } from "react-router-dom";

const EmployeeEdit = () => {
  const location = useLocation();
  const { employeeID } = useParams(); // Get employeeID from URL
  const navigate = useNavigate();
  const { rowData } = location.state || {};

  const [formData, setFormData] = useState({
    title: rowData?.title || "",
    emp_type: rowData?.emp_type || "",
    empfirst_name: rowData?.empfirst_name || "",
    empfather_name: rowData?.empfather_name || "",
    gender: rowData?.gender || "",
    address: rowData?.address || "",
    email: rowData?.email || "",
    phone: rowData?.phone || "",
    date_of_birth: rowData?.date_of_birth || "",
    employee_photo: rowData?.employee_photo || null,
  });

  const [loading, setLoading] = useState(false);

  // Fetch Employee Data
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!employeeID) {
        console.error("No employeeID provided in URL.");
        alert("Invalid employee ID.");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/employees/${employeeID}/`);

        // Debugging: Check the response data
        console.log("API Response:", response.data);

        if (response.data) {
          setFormData(response.data);
        } else {
          console.warn("No data returned from API.");
          alert("Employee data not found.");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);

        if (error.response) {
          console.error("Server Error:", error.response.status, error.response.data);
          alert(`Error ${error.response.status}: ${error.response.data?.detail || "Failed to fetch employee details."}`);
        } else if (error.request) {
          console.error("No response received from server.");
          alert("No response from server. Please check your connection.");
        } else {
          console.error("Unexpected Error:", error.message);
          alert("An unexpected error occurred.");
        }
      }
    };

    fetchEmployee();
  }, [employeeID]);
  console.log("Received Employee ID:", employeeID);
  // console.log("Received Employee name:",empfather_name );
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, employee_photo: e.target.files[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "employee_photo" && formData[key]) {
        formDataObj.append(key, formData[key]);
      } else if (formData[key] !== null && formData[key] !== undefined) {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
      await axios.put(`http://127.0.0.1:8000/api/employees/${employeeID}/`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Employee updated successfully!");
      navigate("/employeelistpage");
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating employee: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col lg="12">
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0">Edit Employee</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col lg="6">
                  <div className="mb-3">
                    <label>Title</label>
                    <select className="form-control" name="title" value={formData.title} onChange={handleInputChange}>
                      <option value="">Select Title</option>
                      <option value="1">Mr.</option>
                      <option value="2">Mrs.</option>
                      <option value="3">Ms.</option>
                      <option value="4">Dr.</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Employee Type</label>
                    <select className="form-control" name="emp_type" value={formData.emp_type} onChange={handleInputChange}>
                      <option value="">Select Employee Type</option>
                      <option value="1">ADMIN</option>
                      <option value="2">MANAGER</option>
                      <option value="3">APPLICANT</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>First Name</label>
                    <input type="text" className="form-control" name="empfirst_name" value={formData.empfirst_name} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label>Father's Name</label>
                    <input type="text" className="form-control" name="empfather_name" value={formData.empfather_name} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label>Gender</label>
                    <select className="form-control" name="gender" value={formData.gender} onChange={handleInputChange}>
                      <option value="">Select Gender</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </select>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="mb-3">
                    <label>Address</label>
                    <textarea className="form-control" name="address" value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label>Phone</label>
                    <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label>Date of Birth</label>
                    <input type="date" className="form-control" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} />
                  </div>

                  {/* Image Preview */}
                  {formData.employee_photo && (
                    <div className="mb-3">
                      <label>Current Employee Photo</label>
                      <br />
                      <img
                        src={typeof formData.employee_photo === "string" ? formData.employee_photo : URL.createObjectURL(formData.employee_photo)}
                        alt="Employee"
                        style={{ width: "250px", height: "250px", objectFit: "cover", borderRadius: "4px" }}
                      />
                    </div>
                  )}
                </Col>
              </Row>
              <div className="col-12 mt-4">
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Updating..." : "Update Employee"}
                </button>
              </div>
            </form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default EmployeeEdit;
