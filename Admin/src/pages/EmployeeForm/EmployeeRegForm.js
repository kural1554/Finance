import React, { useState, useEffect,useCallback } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, FormFeedback } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { post as apiPost } from '../../helpers/api_helper'; // Ensure this path is correct
import DocumentUpload from "../Applicants/IdProofSection"; 
import FeatherIcon from "feather-icons-react";
import { InputGroup } from "reactstrap";
const EmployeeRegForm = () => {
  const navigate = useNavigate();
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [roleToCreate, setRoleToCreate] = useState("Manager"); // Default for Admin
  const [isCurrentUserSuperuser, setIsCurrentUserSuperuser] = useState(false);
 const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const initialFormData = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    first_name: "",
    last_name: "",
    // Profile fields
    title_choice: "", // Will be parsed to int or null
    gender_choice: "", // Will be parsed to int or null
    address_line1: "",
    city_district: "",
    state_province: "",
    country: "",
    postal_code: "",
    phone_number: "",
    date_of_birth_detail: "", // Backend expects 'YYYY-MM-DD'
    joining_date: "",         // Backend expects 'YYYY-MM-DD', optional
    employee_photo: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
   const [passwordError, setPasswordError] = useState("");
  const [employeeIdProofs, setEmployeeIdProofs] = useState([])

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const isSuperuser = localStorage.getItem("isSuperuser") === 'true';
    setCurrentUserRole(role);
    setIsCurrentUserSuperuser(isSuperuser);

     // Initial role selection logic
    if (isSuperuser) {
        setRoleToCreate("Admin"); // Superuser defaults to creating Admin
    } else if (role === 'Admin') {
        setRoleToCreate("Manager"); // Admin defaults to creating Manager
    } else if (role === 'Manager') {
        setRoleToCreate("Staff"); // Manager can only create Staff
    }

    if (!role || (role !== 'Admin' && role !== 'Manager' && !isSuperuser)) {
        toast.error("You are not authorized to create new users.");
        navigate("/dashboard"); // Or appropriate unauthorized page
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password" || name === "confirmPassword") {
        setPasswordError("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData((prev) => ({ ...prev, employee_photo: file }));
    } else {
        setFormData((prev) => ({ ...prev, employee_photo: null })); // Handle file removal
    }
  };

  const handleIdProofsChange = useCallback((docsFromChild) => {
    console.log("EmployeeRegForm received ID proofs from child:", docsFromChild);
    setEmployeeIdProofs(docsFromChild);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(""); // Clear previous errors

    // --- VALIDATE PASSWORDS MATCH ---
    if (formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords do not match!");
        toast.error("Passwords do not match!"); // Optional: show toast too
        setLoading(false); // Should not proceed
        return; // Stop submission
    }
    if (employeeIdProofs.length < 1) { // Example: require at least 1 ID proof
    toast.error("Please upload at least one ID proof document.");
       return;
    }
    setLoading(true);

    let targetRoleToSubmit = "";
    let submissionUrl = "";

    if (isCurrentUserSuperuser) { // Superuser logic
        targetRoleToSubmit = roleToCreate; // Admin, Manager, or Staff
        if (roleToCreate === "Admin") {
            submissionUrl = 'api/employees/user-creation/create-admin/';
        } else if (roleToCreate === "Manager") {
            submissionUrl = 'api/employees/user-creation/create-manager/';
        } else { // Staff
            submissionUrl = 'api/employees/user-creation/create-staff/';
        }
    } else if (currentUserRole === "Admin") { // Admin logic (cannot create Admin)
        targetRoleToSubmit = roleToCreate; // Manager or Staff
        if (roleToCreate === "Manager") {
             submissionUrl = 'api/employees/user-creation/create-manager/';
        } else { // Staff
             submissionUrl = 'api/employees/user-creation/create-staff/';
        }
    } else if (currentUserRole === "Manager") { // Manager logic
        targetRoleToSubmit = "Staff"; // Can only create Staff
        submissionUrl = 'api/employees/user-creation/create-staff/';
    } else {
      toast.error("Unauthorized to perform this action.");
      setLoading(false);
      return;
    }

    const dataForSerializer = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name || null, // Send null if empty
        role_group_name: targetRoleToSubmit,
        
        title_choice: formData.title_choice ? parseInt(formData.title_choice) : null,
       
        gender_choice: formData.gender_choice ? parseInt(formData.gender_choice) : null,
        address_line1: formData.address_line1 || null,
        address_line2: formData.address_line2 || null, // Optional, send null if empty
        city_district: formData.city_district || null,
        state_province: formData.state_province || null,
        country: formData.country || null,
        postal_code: formData.postal_code || null,
        phone_number: formData.phone_number || null,
        date_of_birth_detail: formData.date_of_birth_detail || null, // Send null if empty string
        joining_date: formData.joining_date || null, // Send null if empty string
    };

    const payload = new FormData();
    for (const key in dataForSerializer) {
        if (dataForSerializer[key] !== null && dataForSerializer[key] !== undefined) {
            payload.append(key, dataForSerializer[key]);
        }
    }

    if (formData.employee_photo && formData.employee_photo instanceof File) {
        payload.append("employee_photo", formData.employee_photo, formData.employee_photo.name);
    }

    employeeIdProofs.forEach((doc, index) => {
        if (doc.file && doc.type && doc.idNumber) { // Ensure all parts are present
            payload.append(`id_proofs[${index}][type]`, doc.type);
            payload.append(`id_proofs[${index}][idNumber]`, doc.idNumber);
            // The actual file
            payload.append(`id_proofs[${index}][file]`, doc.file, doc.file.name);
        }
    });

    try {
      const response = await apiPost(submissionUrl, payload); // Send FormData
      toast.success(`${targetRoleToSubmit} (ID: ${response.employee_id || 'N/A'}) registered successfully!`);
      setFormData(initialFormData); 
      setEmployeeIdProofs([]); 
      setPasswordError("");
      const fileInput = document.querySelector('input[name="employee_photo"]');
      if (fileInput) fileInput.value = "";

      navigate("/employeelistpage"); 
    } catch (error) {
      console.error("Registration error:", error.response || error);
      let errorMessages = "Error registering employee.";
      if (error.response && error.response.data) {
          const errors = error.response.data.errors || error.response.data;
          if (typeof errors === 'string') {
              errorMessages = errors;
          } else if (typeof errors === 'object') {
              errorMessages = Object.entries(errors)
                  .map(([key, value]) => {
                      const cleanKey = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()); // Capitalize
                      return `${cleanKey}: ${Array.isArray(value) ? value.join(', ') : value}`;
                  })
                  .join('; ');
          }
      } else if (error.message) { errorMessages = error.message; }
      toast.error(errorMessages, { autoClose: 7000 });
    } finally {
      setLoading(false);
    }
  };

  const renderRoleChoice = () => { // Renamed for clarity
    if (isCurrentUserSuperuser) {
      return (
        <FormGroup>
          <Label htmlFor="roleToCreate">Create As*</Label>
          <Input
            type="select"
            className="form-select"
            name="roleToCreate"
            id="roleToCreate"
            value={roleToCreate}
            onChange={(e) => setRoleToCreate(e.target.value)}
          >
            <option value="Admin">Admin</option> {/* <<< SUPERUSER CAN CREATE ADMIN */}
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </Input>
        </FormGroup>
      );
    } else if (currentUserRole === 'Admin') {
      return (
        <FormGroup>
          <Label htmlFor="roleToCreate">Create As*</Label>
          <Input
            type="select"
            className="form-select"
            name="roleToCreate"
            id="roleToCreate"
            value={roleToCreate}
            onChange={(e) => setRoleToCreate(e.target.value)}
          >
            {/* Admin cannot create another Admin through this form */}
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </Input>
        </FormGroup>
      );
    } else if (currentUserRole === 'Manager') {
        // Manager can only create Staff, so no dropdown needed, or a disabled one.
        // For simplicity, we can just show text or omit the choice.
        return (
             <FormGroup>
                <Label>Creating As:</Label>
                <Input type="text" value="Staff" readOnly disabled />
            </FormGroup>
        );
    }
    return null;
  };
  const buttonText = () => {
    if (loading) return "Registering...";
    return `Register New ${roleToCreate}`;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">
                    Register New Employee
                     {isCurrentUserSuperuser ? " (as Superuser)" : (currentUserRole && ` (as ${currentUserRole})`)}
                  </h4>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={handleSubmit}> {/* Changed from <form> to <Form> for Reactstrap */}
                    <Row>
                      <Col md="6"> {/* Use md for better responsiveness */}
                        {renderRoleChoice()}
                        <FormGroup className="mb-3">
                            <Label htmlFor="username">Username*</Label>
                            <Input type="text" name="username" id="username" value={formData.username} onChange={handleInputChange} required />
                        </FormGroup>
                        <FormGroup className="mb-3">
                    <Label htmlFor="password">Password*</Label>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        invalid={!!passwordError}
                        required
                        placeholder="Enter password"
                        autoComplete="new-password" // Important for password managers
                      />
                      <Button
                        color="light"
                        className="btn-icon" // For styling if you have it
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <FeatherIcon icon={showPassword ? "eye-off" : "eye"} />
                      </Button>
                    </InputGroup>
                    {/* FormFeedback for passwordError is now handled under confirmPassword */}
                  </FormGroup>
<FormGroup className="mb-3">
                    <Label htmlFor="confirmPassword">Confirm Password*</Label>
                    <InputGroup>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        invalid={!!passwordError}
                        required
                        placeholder="Confirm password"
                        autoComplete="new-password"
                      />
                       <Button
                        color="light"
                        className="btn-icon"
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        <FeatherIcon icon={showConfirmPassword ? "eye-off" : "eye"} />
                      </Button>
                    </InputGroup>
                    {/* Display mismatch error here, applying to both fields effectively */}
                    {passwordError && <FormFeedback type="invalid" style={{ display: 'block' }}>{passwordError}</FormFeedback>}
                  </FormGroup>
                        <FormGroup className="mb-3">
                            <Label htmlFor="email">Email*</Label>
                            <Input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <Label htmlFor="first_name">First Name*</Label>
                            <Input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleInputChange} required />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleInputChange} />
                        </FormGroup>
                         <FormGroup className="mb-3">
                            <Label htmlFor="joining_date">Joining Date</Label> {/* Added Joining Date */}
                            <Input type="date" name="joining_date" id="joining_date" value={formData.joining_date} onChange={handleInputChange} />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                            <Label htmlFor="title_choice">Title</Label>
                            <Input type="select" className="form-select" name="title_choice" id="title_choice" value={formData.title_choice} onChange={handleInputChange}>
                                <option value="">Select Title</option>
                                <option value="1">Mr.</option><option value="2">Mrs.</option>
                                <option value="3">Ms.</option><option value="4">Dr.</option>
                            </Input>
                        </FormGroup>
                        
                        <FormGroup className="mb-3">
                            <Label htmlFor="gender_choice">Gender</Label>
                            <Input type="select" className="form-select" name="gender_choice" id="gender_choice" value={formData.gender_choice} onChange={handleInputChange}>
                                <option value="">Select Gender</option>
                                <option value="1">Male</option><option value="2">Female</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-3">
                      <Label htmlFor="address_line1">Address Line 1</Label>
                      <Input type="text" name="address_line1" id="address_line1" value={formData.address_line1} onChange={handleInputChange} required />
                  </FormGroup>
                  
                  <Row> {/* Use a Row for better alignment of City/District and State/Province */}
                    <Col md="6">
                      <FormGroup className="mb-3">
                          <Label htmlFor="city_district">City / District*</Label>
                          <Input type="text" name="city_district" id="city_district" value={formData.city_district} onChange={handleInputChange} required />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="mb-3">
                          <Label htmlFor="state_province">State </Label>
                          <Input type="text" name="state_province" id="state_province" value={formData.state_province} onChange={handleInputChange} required />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row> {/* Use a Row for Country and Postal Code */}
                    <Col md="6">
                      <FormGroup className="mb-3">
                          <Label htmlFor="country">Country*</Label>
                          <Input type="text" name="country" id="country" value={formData.country} onChange={handleInputChange} required />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="mb-3">
                          <Label htmlFor="postal_code">Postal Code*</Label>
                          <Input type="text" name="postal_code" id="postal_code" value={formData.postal_code} onChange={handleInputChange} required />
                      </FormGroup>
                    </Col>
                  </Row>
                        <FormGroup className="mb-3">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input type="tel" name="phone_number" id="phone_number" value={formData.phone_number} onChange={handleInputChange} />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <Label htmlFor="date_of_birth_detail">Date of Birth</Label>
                            <Input type="date" name="date_of_birth_detail" id="date_of_birth_detail" value={formData.date_of_birth_detail} onChange={handleInputChange} />
                        </FormGroup>
                       
                        <FormGroup className="mb-3">
                            <Label htmlFor="employee_photo">Employee Photo</Label>
                            <Input type="file" name="employee_photo" id="employee_photo" accept="image/*" onChange={handleFileChange} />
                        </FormGroup>
                      </Col>
                    </Row>
                     <Row className="mt-4">
                        <Col xs="12">
                            <hr />
                            <h5>Identification Documents</h5>
                            <p className="text-muted">Upload up to 3 ID proof documents (e.g., PAN, Aadhar, Voter ID).</p>
                            <DocumentUpload
                                onDocumentsChange={handleIdProofsChange} // Pass the callback
                                // You can pass a prop to limit max documents if DocumentUpload supports it
                                // maxDocuments={3}
                            />
                        </Col>
                    </Row>
                    <Row> {/* Ensure button is on its own row or styled appropriately */}
                        <Col xs="12" className="mt-4">
                            <Button color="primary" type="submit" className="w-100" disabled={loading}>
                                {buttonText()}
                            </Button>
                        </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EmployeeRegForm;