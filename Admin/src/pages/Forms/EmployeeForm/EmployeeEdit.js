import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom"; 

const EmployeeEdit = () => {
  const { employeeID } = useParams(); // Get employeeID from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    emp_type: "",
    empfirst_name: "",
    empfather_name: "",
    gender: "",
    address: "",
    email: "",
    phone: "",
    date_of_birth: "",
    employee_photo: null,
  });

  const [loading, setLoading] = useState(false);

  // Fetch employee data based on employeeID
  useEffect(() => {
    console.log("Received Employee ID in Edit Page:", employeeID);
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8080/api/employees/${employeeID}/`);
        const data = response.data;
        
        setFormData({
          title: data.title.toString(),
          emp_type: data.emp_type.toString(),
          empfirst_name: data.empfirst_name,
          empfather_name: data.empfather_name,
          gender: data.gender.toString(),
          address: data.address,
          email: data.email,
          phone: data.phone,
          date_of_birth: data.date_of_birth,
          employee_photo: null, // Handle photo separately
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
        alert("Failed to load employee data.");
      }
    };

    if (employeeID) {
      fetchEmployeeData();
    }
  }, [employeeID]);

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, employee_photo: e.target.files[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title ? parseInt(formData.title) : "");
    formDataObj.append("emp_type", formData.emp_type ? parseInt(formData.emp_type) : "");
    formDataObj.append("empfirst_name", formData.empfirst_name);
    formDataObj.append("empfather_name", formData.empfather_name);
    formDataObj.append("gender", formData.gender ? parseInt(formData.gender) : "");
    formDataObj.append("address", formData.address);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("date_of_birth", formData.date_of_birth);

    if (formData.employee_photo) {
      formDataObj.append("employee_photo", formData.employee_photo);
    }

    try {
      await axios.put(`http://127.0.0.1:8080/api/employees/${employeeID}/`, formDataObj, {
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
                    <select className="form-control" name="title" value={formData.title} onChange={handleInputChange} required>
                      <option value="">Select Title</option>
                      <option value="1">Mr.</option>
                      <option value="2">Mrs.</option>
                      <option value="3">Ms.</option>
                      <option value="4">Dr.</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Employee Type</label>
                    <select className="form-control" name="emp_type" value={formData.emp_type} onChange={handleInputChange} required>
                      <option value="">Select Employee Type</option>
                      <option value="1">ADMIN</option>
                      <option value="2">MANAGER</option>
                      <option value="3">APPLICANT</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>First Name</label>
                    <input type="text" className="form-control" name="empfirst_name" value={formData.empfirst_name} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Father's Name</label>
                    <input type="text" className="form-control" name="empfather_name" value={formData.empfather_name} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Gender</label>
                    <select className="form-control" name="gender" value={formData.gender} onChange={handleInputChange} required>
                      <option value="">Select Gender</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </select>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="mb-3">
                    <label>Address</label>
                    <textarea className="form-control" name="address" value={formData.address} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Phone</label>
                    <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Date of Birth</label>
                    <input type="date" className="form-control" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Employee Photo</label>
                    <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                  </div>
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
