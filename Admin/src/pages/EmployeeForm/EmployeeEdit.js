import React, { useState, useEffect, useCallback } from "react";
import {
  Container, Row, Col, Card, CardBody, CardHeader,
  Form, FormGroup, Label, Input, Button, Spinner, FormText, Table,FormFeedback 
} from "reactstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { get as apiGet, patch as apiPatch } from '../../helpers/api_helper';
// --- IMPORT YOUR DocumentUpload COMPONENT ---
import DocumentUpload from "../Applicants/IdProofSection"; 

const EmployeeEdit = () => {
  const location = useLocation();
  const { employee_id: routeParamEmployeePk } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const initialFormData = {
    id: null,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    title_choice: "",
       
    gender_choice: "",
    address_line1: "",
 
    city_district: "",
    state_province: "",
    country: "",
    postal_code: "",
    phone_number: "",
    date_of_birth_detail: "",
    joining_date: "",
    leaving_date: "",
    employee_photo: null,
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [initialPhotoUrl, setInitialPhotoUrl] = useState(null);
  const [formErrors, setFormErrors] = useState({}); 
  // --- STATE FOR DOCUMENTS ---
  const [existingDocuments, setExistingDocuments] = useState([]); // Docs fetched from backend
  const [newlyAddedDocuments, setNewlyAddedDocuments] = useState([]); // Docs added via DocumentUpload in this session
  const [documentIdsToDelete, setDocumentIdsToDelete] = useState([]); // IDs of existing docs to delete
  // --- END DOCUMENT STATE ---


  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const populateForm = (employeeData) => {
      if (!isMounted) return;
      console.log("Populating form with employee data:", employeeData);
      setFormData({
        id: employeeData.id || null,
        username: employeeData.username || "",
        email: employeeData.email || "",
        first_name: employeeData.first_name || "",
        last_name: employeeData.last_name || "",
        title_choice: employeeData.title_choice?.toString() || "",
       
        gender_choice: employeeData.gender_choice?.toString() || "",
        address_line1: employeeData.address_line1 || "",
        
        city_district: employeeData.city_district || "",
        state_province: employeeData.state_province || "",
        country: employeeData.country || "",
        postal_code: employeeData.postal_code || "",
        phone_number: employeeData.phone_number || "",
        date_of_birth_detail: employeeData.date_of_birth_detail || "",
        joining_date: employeeData.joining_date || "",
        leaving_date: employeeData.leaving_date || "",
        employee_photo: null,
        password: "", 
        confirmPassword: "",
      });
      setInitialPhotoUrl(employeeData.employee_photo || null);
      setExistingDocuments(employeeData.id_proofs || []); // Assumes backend sends 'id_proofs'
      setLoading(false);
    };

    const fetchEmployeeDataFromApi = async (empPk) => {
        // ... (your existing fetchEmployeeDataFromApi logic is good)
        // Ensure it calls populateForm(data) on success
        console.log(`Fetching employee data from API for Employee PK: ${empPk}`);
        const detailApiUrl = `api/employees/manage-profiles/${empPk}/`;
        console.log("API Get URL:", detailApiUrl);
        try {
            const data = await apiGet(detailApiUrl);
            console.log("Successfully fetched data from API:", data);
            if (!isMounted) return;
            if (!data || data.id === undefined) {
                throw new Error("Fetched data is missing the 'id' (EmployeeDetails PK).");
            }
            populateForm(data);
        } catch (fetchError) {
            console.error("Error fetching employee data from API:", fetchError);
            if (!isMounted) return;
            const errorMsg = fetchError.response?.data?.detail || fetchError.message || "Unknown error";
            toast.error(`Failed to load employee data for PK ${empPk}. ${errorMsg}`);
            setError(`Failed to load data: ${errorMsg}`);
            setLoading(false);
        }
    };

    // ... (Main logic to get PK and fetch/populate - your existing logic is good) ...
    let employeePkToUse = null;
    if (location.state?.isEdit && location.state?.employeeData?.id) {
        employeePkToUse = location.state.employeeData.id;
        populateForm(location.state.employeeData);
    } else if (routeParamEmployeePk) {
        employeePkToUse = routeParamEmployeePk;
        fetchEmployeeDataFromApi(employeePkToUse);
    } else {
        // ... (error handling if no PK) ...
        setError("Missing employee identifier.");
        setLoading(false);
    }


    return () => { isMounted = false; };
  }, [location.state, routeParamEmployeePk, navigate]);


  const handleInputChange = (e) => { /* ... your existing code ... */
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => { /* ... your existing code for profile photo ... */
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, employee_photo: file || null }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) setInitialPhotoUrl(reader.result.toString());
      };
      reader.readAsDataURL(file);
    }
  };

  // --- CALLBACK FOR DocumentUpload COMPONENT (for NEW docs) ---
  const handleNewDocumentsChange = useCallback((docs) => {
    console.log("EmployeeEdit received NEW ID proofs from child:", docs);
    setNewlyAddedDocuments(docs);
  }, []);

  
  const handleDeleteExistingDocument = (docId) => {
    // Optimistically remove from UI and add to delete list
    setExistingDocuments(prev => prev.filter(doc => doc.id !== docId));
    setDocumentIdsToDelete(prev => [...prev, docId]);
    toast.info("Document marked for deletion. Changes apply on save.");
  };
  // --- END DOCUMENT FUNCTIONS ---


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id) {
        toast.error("Cannot update: Employee primary key (ID) is missing.");
        return;
    }
    setIsSubmitting(true);
    setFormErrors({});

      // --- Client-side password validation ---
    const newFormErrors = {};
    if (formData.password || formData.confirmPassword) { // Only validate if user typed in password fields
        if (!formData.password) {
            newFormErrors.password = "Password is required if you intend to change it.";
        } else if (formData.password.length < 8) { // Example: min length
            newFormErrors.password = "Password must be at least 8 characters long.";
        }
        if (formData.password !== formData.confirmPassword) {
            newFormErrors.confirmPassword = "Passwords do not match.";
        }
    }
    if (Object.keys(newFormErrors).length > 0) {
        setFormErrors(newFormErrors);
        toast.error("Please correct the form errors.");
        setIsSubmitting(false);
        return;
    }

    const dataForSerializer = {
      email: formData.email,
      last_name: formData.last_name || null,
      title_choice: formData.title_choice ? parseInt(formData.title_choice, 10) : null,
     
      gender_choice: formData.gender_choice ? parseInt(formData.gender_choice, 10) : null,
      address_line1: formData.address_line1 || null,
     
      city_district: formData.city_district || null,
      state_province: formData.state_province || null,
      country: formData.country || null,
      postal_code: formData.postal_code || null,
      phone_number: formData.phone_number || null,
      date_of_birth_detail: formData.date_of_birth_detail || null,
      joining_date: formData.joining_date || null,
      leaving_date: formData.leaving_date || null,
    };

    const payload = new FormData();
    for (const key in dataForSerializer) {
      if (dataForSerializer[key] !== null && dataForSerializer[key] !== undefined) {
          payload.append(key, dataForSerializer[key]);
      } else if (dataForSerializer[key] === "") {
          payload.append(key, "");
      }
    }

    if (formData.employee_photo instanceof File) {
      payload.append("employee_photo", formData.employee_photo, formData.employee_photo.name);
    }
    // To explicitly clear employee_photo if backend expects it:
    // else if (formData.employee_photo === null && initialPhotoUrl !== null) { // Check if it was cleared
    //    payload.append("employee_photo", ""); // Or null, depending on backend
    // }
     // --- Append NEW PASSWORD if provided ---
    if (formData.password && formData.password.trim() !== "") {
        payload.append("password", formData.password);
        payload.append("confirm_password", formData.confirmPassword);
    }

    // --- APPEND NEW DOCUMENTS ---
    newlyAddedDocuments.forEach((doc, index) => {
        if (doc.file && doc.type && doc.idNumber) {
            payload.append(`new_id_proofs[${index}][type]`, doc.type);
            payload.append(`new_id_proofs[${index}][idNumber]`, doc.idNumber);
            payload.append(`new_id_proofs[${index}][file]`, doc.file, doc.file.name);
        }
    });

    // --- APPEND IDS OF DOCUMENTS TO DELETE ---
    if (documentIdsToDelete.length > 0) {
        documentIdsToDelete.forEach(id => {
            payload.append('delete_document_ids[]', id); // Backend needs to parse this
        });
    }
    // For debugging:
    // console.log("--- EmployeeEdit Payload (before submit) ---");
    // for (let pair of payload.entries()) {
    //   console.log(pair[0]+ ': ', pair[1] instanceof File ? pair[1].name : pair[1]);
    // }

    try {
        const apiUrl = `api/employees/manage-profiles/${formData.id}/`;
        await apiPatch(apiUrl, payload); // apiPatch from your helper
        toast.success("Employee updated successfully!");
        navigate("/employeelistpage");
    } catch (submitError) {
        console.error("Update failed:", submitError);
        const errorData = submitError.response?.data;
        let errorMessage = "Update failed. Please check the form for errors.";

        if (errorData) {
            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData.errors && typeof errorData.errors === 'object') {
                const backendErrors = {};
                for (const key in errorData.errors) {
                    // Map backend field names to frontend state names if different
                    const frontendKey = key === "confirm_password" ? "confirmPassword" : key;
                    backendErrors[frontendKey] = Array.isArray(errorData.errors[key]) ? errorData.errors[key].join(" ") : errorData.errors[key];
                }
                setFormErrors(backendErrors);
                // Focus on the first field with an error if possible
            } else if (errorData.detail) {
                errorMessage = errorData.detail;
            } else if (errorData.error) { // General error message
                errorMessage = errorData.error;
            }
        }
        toast.error("Update failed. Please check errors.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="page-content d-flex justify-content-center align-items-center"><Spinner /></div>;
  if (error) return <div className="page-content text-danger text-center"><p>Error loading data: {error}</p><Button onClick={() => navigate(-1)}>Go Back</Button></div>;


  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg="12">
            <Card>
              <CardHeader>
                {/* ... CardHeader content ... */}
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* Left column */}
                    <Col md="6">
                      {/* ... Username, Email, First Name (read-only), Last Name, Joining, Leaving Dates ... */}
                       <FormGroup>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" type="text" name="username" value={formData.username} readOnly disabled />
                        <FormText color="muted">Username cannot be changed.</FormText>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="email">Email*</Label>
                        <Input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input id="first_name" type="text" name="first_name" value={formData.first_name} readOnly disabled />
                        <FormText color="muted">First name cannot be changed.</FormText>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input id="last_name" type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} />
                      </FormGroup>
                    
                      <FormGroup>
                        <Label htmlFor="joining_date">Joining Date</Label>
                        <Input id="joining_date" type="date" name="joining_date" value={formData.joining_date} onChange={handleInputChange} />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="leaving_date">Leaving Date</Label>
                        <Input id="leaving_date" type="date" name="leaving_date" value={formData.leaving_date} onChange={handleInputChange} />
                        <FormText color="muted">Setting a leaving date marks the employee as inactive.</FormText>
                      </FormGroup>
                        {/* --- NEW PASSWORD SECTION --- */}
                      <hr className="my-4" />
                      <h6>Change Password (Optional)</h6>
                       <FormGroup>
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Leave blank to keep current password"
                            invalid={!!formErrors.password}
                        />
                        {formErrors.password && <FormFeedback>{formErrors.password}</FormFeedback>}
                        </FormGroup>
                        <FormGroup>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm new password"
                            invalid={!!formErrors.confirmPassword}
                        />
                        {formErrors.confirmPassword && <FormFeedback>{formErrors.confirmPassword}</FormFeedback>}
                        </FormGroup>
                      {/* --- END NEW PASSWORD SECTION --- */}
                    </Col>

                    {/* Right column */}
                    <Col md="6">
                      {/* ... Title, Gender, New Address Fields, Phone, DOB, Employee Photo ... */}
                       <FormGroup>
                        <Label htmlFor="title_choice">Title</Label>
                        <Input id="title_choice" type="select" name="title_choice" value={formData.title_choice} onChange={handleInputChange}>
                          <option value="">Select Title</option>
                          <option value="1">Mr.</option><option value="2">Mrs.</option>
                          <option value="3">Ms.</option><option value="4">Dr.</option>
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="gender_choice">Gender</Label>
                        <Input id="gender_choice" type="select" name="gender_choice" value={formData.gender_choice} onChange={handleInputChange}>
                          <option value="">Select Gender</option>
                          <option value="1">Male</option><option value="2">Female</option>
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="address_line1">Address Line 1</Label>
                        <Input id="address_line1" type="text" name="address_line1" value={formData.address_line1} onChange={handleInputChange} />
                      </FormGroup>
                      
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label htmlFor="city_district">City / District</Label>
                            <Input id="city_district" type="text" name="city_district" value={formData.city_district} onChange={handleInputChange} />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label htmlFor="state_province">State / Province</Label>
                            <Input id="state_province" type="text" name="state_province" value={formData.state_province} onChange={handleInputChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" type="text" name="country" value={formData.country} onChange={handleInputChange} />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label htmlFor="postal_code">Postal Code</Label>
                            <Input id="postal_code" type="text" name="postal_code" value={formData.postal_code} onChange={handleInputChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup>
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input id="phone_number" type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange} />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="date_of_birth_detail">Date of Birth</Label>
                        <Input id="date_of_birth_detail" type="date" name="date_of_birth_detail" value={formData.date_of_birth_detail} onChange={handleInputChange} />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="employee_photo">Employee Photo</Label>
                        {/* ... photo preview logic (your existing code is good) ... */}
                        {initialPhotoUrl && (
                           <div className="mb-2">
                             <img
                                src={initialPhotoUrl}
                                alt={formData.employee_photo instanceof File ? "New Profile Preview" : "Current Profile"}
                                style={{ width: '100px', height: 'auto', display: 'block', border: '1px solid #ddd', padding: '2px' }}
                             />
                             <FormText color="muted">
                               {formData.employee_photo instanceof File ? "New photo selected." : "Current photo."}
                             </FormText>
                           </div>
                        )}
                        <Input id="employee_photo" type="file" name="employee_photo" accept="image/*" onChange={handleFileChange} />
                        <FormText color="muted">Upload a new file to replace the current photo.</FormText>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* --- DOCUMENT MANAGEMENT SECTION --- */}
                  <Row className="mt-4">
                    <Col xs="12">
                      <hr />
                      <h4>Identification Documents</h4>

                      {/* Display Existing Documents */}
                      {existingDocuments.length > 0 && (
                        <>
                          <h5 className="mt-3">Current ID Proofs:</h5>
                          <Table striped responsive bordered size="sm" className="mb-3">
                            <thead>
                              <tr>
                                <th>Type</th>
                                <th>Number</th>
                                <th>File</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {existingDocuments.map((doc) => (
                                <tr key={doc.id}>
                                  <td className="text-capitalize">{doc.document_type}</td>
                                  <td>{doc.document_number}</td>
                                  <td>
                                    {doc.document_file_url ? (
                                      <a href={doc.document_file_url} target="_blank" rel="noopener noreferrer">
                                        View Document
                                      </a>
                                    ) : doc.document_file ? ( // Fallback if URL not present but file path is
                                      <span>{doc.document_file.split('/').pop()}</span>
                                    ): (
                                      "No file"
                                    )}
                                  </td>
                                  <td>
                                    <Button
                                      color="danger"
                                      outline
                                      size="sm"
                                      onClick={() => handleDeleteExistingDocument(doc.id)}
                                      title="Mark for deletion"
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </>
                      )}
                      {existingDocuments.length === 0 && !loading && <p>No existing ID proofs for this employee.</p>}
                      
                      {/* Section to Add New Documents */}
                      <h5 className="mt-3">Add New ID Proof(s):</h5>
                      <DocumentUpload
                          onDocumentsChange={handleNewDocumentsChange}
                          // Calculate max documents allowed based on existing ones not marked for deletion
                          // maxDocuments={3 - existingDocuments.length}
                          // The DocumentUpload component itself limits to 3, so this prop might be for display
                      />
                    </Col>
                  </Row>
                  {/* --- END DOCUMENT MANAGEMENT SECTION --- */}


                  <Row>
                    <Col xs="12" className="mt-4 text-center">
                      <Button color="primary" type="submit" className="w-50" disabled={isSubmitting || !formData.id}>
                        {isSubmitting ? <><Spinner size="sm" /> Updating...</> : "Update Employee"}
                      </Button>
                      <Button color="secondary" type="button" className="w-auto ms-2" onClick={() => navigate("/employeelistpage")} disabled={isSubmitting}>
                         Cancel
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
  );
};

export default EmployeeEdit;