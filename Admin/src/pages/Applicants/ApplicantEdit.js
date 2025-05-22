import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import { useDropzone } from "react-dropzone";
import classnames from "classnames";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentUpload from "../Chat/IdProofSection";
import { initialFormData, formFields } from '../Chat/formConfig';

const API_URL = process.env.REACT_APP_API_BASE_URL + "api/applicants/applicants/";

const ApplicationEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // State management
  const [formData, setFormData] = useState(initialFormData);
  const [isEditMode, setIsEditMode] = useState(location.state?.isEdit || false);
  const [applicantId, setApplicantId] = useState(location.state?.applicantId || null);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [applicantDocuments, setApplicantDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const documentUploadRef = useRef();

  // Transform API data to form data structure
  const transformAPIData = useCallback((apiData) => {
    if (!apiData) return initialFormData;

    return {
      ...initialFormData,
      ...apiData,
      employment: apiData.employment || initialFormData.employment,
      banking_details: apiData.banking_details || initialFormData.banking_details,
      properties: apiData.properties || initialFormData.properties,
      proofs: apiData.proofs || []
    };
  }, []);

  // Profile photo dropzone
  const { getRootProps: getRootProfilePhotoProps, getInputProps: getInputProfilePhotoProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setProfilePhotoFile(file);
        setProfilePhotoPreview(URL.createObjectURL(file));
      }
    },
    onDropRejected: () => {
      toast.error("Please upload a valid image file (JPEG, JPG, PNG)");
    }
  });

  const removeProfilePhoto = (e) => {
    e.stopPropagation();
    if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    setProfilePhotoFile(null);
    setProfilePhotoPreview(null);
  };

  // Handle document changes from DocumentUpload component
  const handleDocumentsChange = useCallback((docs) => {
    setApplicantDocuments(docs);
  }, []);

  // Handle input changes for both simple and nested fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = type === "checkbox" ? checked : value;

    // Handle number inputs
    if (type === "number") {
      processedValue = value === "" ? null : Number(value);
      if (isNaN(processedValue)) processedValue = null;
    } else if (e.target.tagName === "SELECT" && !isNaN(value)) {
      processedValue = value !== "" ? Number(value) : value;
    }

    // Handle nested fields (e.g., employment[0].monthlyIncome)
    if (name.includes('.')) {
      const [parent, index, field] = name.replace(']', '').split(/[\[\.]/);
      setFormData(prev => ({
        ...prev,
        [parent]: prev[parent].map((item, i) => 
          i === parseInt(index) ? { ...item, [field]: processedValue } : item
        )
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    }

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Prepare form data for submission
  const prepareFormData = () => {
    const formDataToSend = new FormData();
    
    // Append all simple fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'employment' || key === 'banking_details' || key === 'properties' || key === 'proofs' || key === 'profile_photo') {
        return;
      }
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });
  
    // Handle profile photo
    if (profilePhotoFile instanceof File) {
      formDataToSend.append("profile_photo", profilePhotoFile);
    } else if (isEditMode && typeof profilePhotoPreview === 'string') {
      formDataToSend.append("profile_photo_url", profilePhotoPreview);
    }
  
    // Handle nested data
    formDataToSend.append('employment', JSON.stringify(formData.employment));
    formDataToSend.append('banking_details', JSON.stringify(formData.banking_details));
    formDataToSend.append('properties', JSON.stringify(formData.properties));
  
    // Handle documents
    const validProofs = applicantDocuments.filter(
      doc => doc.type && doc.type.trim() !== "" && doc.idNumber && doc.idNumber.trim() !== ""
    );
    
    validProofs.forEach((doc, index) => {
      const prefix = `proofs[${index}]`;
      formDataToSend.append(`${prefix}[type]`, doc.type || '');
      formDataToSend.append(`${prefix}[idNumber]`, doc.idNumber || '');

      if (doc.id) {
        formDataToSend.append(`${prefix}[id]`, doc.id);
        if (doc.file instanceof File) {
          formDataToSend.append(`${prefix}[file]`, doc.file);
        }
      } else if (doc.file instanceof File) {
        formDataToSend.append(`${prefix}[file]`, doc.file);
      }
    });

    // Before sending FormData
    if (
      applicantDocuments.length > 0 &&
      !applicantDocuments.some(doc => doc.file instanceof File)
    ) {
      formDataToSend.append('proofs', JSON.stringify(applicantDocuments));
    }
  
    return formDataToSend;
  };

  // Form validation
  const validateForm = () => {
    const validationErrors = {};
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "postalCode"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        validationErrors[field] = `${field.replace(/_/g, " ")} is required`;
      }
    });

    // Validate employment
    if (formData.employment.length > 0) {
      const employment = formData.employment[0];
      if (!employment.employmentType) {
        validationErrors["employment[0].employmentType"] = "Employment type is required";
      }
      if (!employment.monthlyIncome) {
        validationErrors["employment[0].monthlyIncome"] = "Monthly income is required";
      }
    }

    // Validate banking details
    if (formData.banking_details.length > 0) {
      const banking = formData.banking_details[0];
      if (!banking.accountNumber) {
        validationErrors["banking_details[0].accountNumber"] = "Account number is required";
      }
      if (!banking.ifscCode) {
        validationErrors["banking_details[0].ifscCode"] = "IFSC code is required";
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Form submission
   // Form submission
   const handleSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return; // Prevent multiple submissions


  setIsSubmitting(true);

  // --- Prepare FormData ---
  const formDataToSend = new FormData();

  // 1. Append main applicant fields (non-nested, non-file)
  Object.keys(formData).forEach(key => {
    // Exclude nested array fields and file fields from this initial loop
    if (!['employment', 'banking_details', 'properties', 'proofs', 'profile_photo'].includes(key)) {
      if (formData[key] !== null && formData[key] !== undefined) {
        // Ensure booleans are sent as 'true'/'false' strings if backend form parser expects that
        if (typeof formData[key] === 'boolean') {
            formDataToSend.append(key, formData[key].toString());
        } else {
            formDataToSend.append(key, formData[key]);
        }
      }
    }
  });

  // 2. Append profile photo file (if a new one is selected)
  if (profilePhotoFile instanceof File) {
    formDataToSend.append('profile_photo', profilePhotoFile);
  }
  // Note: If editing and profile_photoFile is null, but profilePhotoPreview (URL) exists,
  // your backend PATCH logic should decide whether to keep the old photo or clear it.
  // If you want to explicitly clear, you might need to send a specific flag or empty value for 'profile_photo'.

  // 3. Append nested data in the format backend expects (fieldName[index].attribute)
  // Employment
  if (formData.employment && formData.employment.length > 0) {
    formData.employment.forEach((emp, index) => {
      const prefix = `employment[${index}]`;
      if (isEditMode && emp.id) formDataToSend.append(`${prefix}[id]`, emp.id); // For PATCH to identify existing
      if (emp.employmentType != null) formDataToSend.append(`${prefix}[employmentType]`, emp.employmentType);
      if (emp.jobTitle != null) formDataToSend.append(`${prefix}[jobTitle]`, emp.jobTitle);
      if (emp.yearsWithEmployer != null) formDataToSend.append(`${prefix}[yearsWithEmployer]`, emp.yearsWithEmployer);
      if (emp.monthlyIncome != null) formDataToSend.append(`${prefix}[monthlyIncome]`, emp.monthlyIncome);
      if (emp.otherIncome != null) formDataToSend.append(`${prefix}[otherIncome]`, emp.otherIncome);
    });
  }

  // Banking Details
  if (formData.banking_details && formData.banking_details.length > 0) {
    formData.banking_details.forEach((bank, index) => {
      const prefix = `banking_details[${index}]`;
      if (isEditMode && bank.id) formDataToSend.append(`${prefix}[id]`, bank.id);
      if (bank.accountHolderName != null) formDataToSend.append(`${prefix}[accountHolderName]`, bank.accountHolderName);
      if (bank.accountNumber != null) formDataToSend.append(`${prefix}[accountNumber]`, bank.accountNumber);
      if (bank.bankName != null) formDataToSend.append(`${prefix}[bankName]`, bank.bankName);
      if (bank.ifscCode != null) formDataToSend.append(`${prefix}[ifscCode]`, bank.ifscCode);
      if (bank.bankBranch != null) formDataToSend.append(`${prefix}[bankBranch]`, bank.bankBranch);
      if (bank.accountType != null) formDataToSend.append(`${prefix}[accountType]`, bank.accountType);
    });
  }

  // Properties
  if (formData.properties && formData.properties.length > 0) {
    formData.properties.forEach((prop, index) => {
      const prefix = `properties[${index}]`;
      if (isEditMode && prop.id) formDataToSend.append(`${prefix}[id]`, prop.id);
      if (prop.propertyType != null) formDataToSend.append(`${prefix}[propertyType]`, prop.propertyType);
      if (prop.property_address != null) formDataToSend.append(`${prefix}[property_address]`, prop.property_address);
      if (prop.propertyValue != null) formDataToSend.append(`${prefix}[propertyValue]`, prop.propertyValue);
      if (prop.propertyAge != null) formDataToSend.append(`${prefix}[propertyAge]`, prop.propertyAge);
      if (prop.propertyOwnership != null) formDataToSend.append(`${prefix}[propertyOwnership]`, prop.propertyOwnership);
      if (prop.remarks != null) formDataToSend.append(`${prefix}[remarks]`, prop.remarks);
    });
  }

  // Proofs
  if (applicantDocuments && applicantDocuments.length > 0) {
    applicantDocuments.forEach((doc, index) => {
      const prefix = `proofs[${index}]`;
      if (isEditMode && doc.id) formDataToSend.append(`${prefix}[id]`, doc.id); // For PATCH
      if (doc.type != null) formDataToSend.append(`${prefix}[type]`, doc.type);
      if (doc.idNumber != null) formDataToSend.append(`${prefix}[idNumber]`, doc.idNumber);
      if (doc.file instanceof File) { // Only append if it's a new file
        formDataToSend.append(`${prefix}[file]`, doc.file);
      }
      // If doc.file is a URL (existing file not changed for an existing proof item),
      // do not send the URL as 'file'. The backend should keep the existing file
      // if no new file is provided for an existing proof ID during PATCH.
      // If you need to send the URL for some reason (e.g., for display in a confirmation step),
      // use a different key like `${prefix}[file_url]`, but your serializer must handle it.
    });
  }

  // For debugging: Log the FormData
  console.log(`--- FormData to be sent (${isEditMode ? 'PATCH' : 'POST'}) ---`);
  for (let pair of formDataToSend.entries()) {
    console.log(pair[0] + ': ', pair[1]);
  }
  console.log("------------------------------------");

  // --- Token and API Call ---
  try {
    // USE localStorage CONSISTENTLY
    const token = localStorage.getItem("accessToken"); // Change from sessionStorage if needed

    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      setIsSubmitting(false);
      return;
    }

    const requestConfig = {
      method: isEditMode ? 'PATCH' : 'POST',
      url: isEditMode ? `${API_URL}${applicantId}/` : API_URL,
      data: formDataToSend,
      headers: {
        // 'Content-Type': 'multipart/form-data', // Axios sets this with boundary for FormData
        'Authorization': `Bearer ${token}`
      }
    };

    console.log("Axios request config:", requestConfig);

    const response = await axios(requestConfig);

    if (response.data.status === 'success') {
      toast.success(`Applicant ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/applicantlist'); // Or wherever you want to redirect
    } else {
      // This case might not be hit if backend returns non-2xx for errors
      toast.error(response.data.message || `Operation failed with non-success status: ${response.status}`);
    }

  } catch (error) {
    console.error(`${isEditMode ? 'Update' : 'Create'} error:`, error);
    let errorMsg = `${isEditMode ? 'Update' : 'Create'} failed. An unexpected error occurred.`;
    if (error.response) {
      console.error("Error Response Data:", error.response.data);
      const responseData = error.response.data;
      if (responseData && typeof responseData === 'object') {
          if (responseData.message && typeof responseData.message === 'string') {
               errorMsg = responseData.message;
          } else if (responseData.errors && typeof responseData.errors === 'object') {
              const fieldErrors = Object.entries(responseData.errors)
                  .map(([key, value]) => {
                      // Handle nested errors which might be objects themselves
                      let messages;
                      if (Array.isArray(value)) {
                          messages = value.join(', ');
                      } else if (typeof value === 'object' && value !== null) {
                          // If value is an object (e.g., nested serializer errors)
                          messages = Object.entries(value)
                              .map(([nestedKey, nestedValue]) => 
                                  `${nestedKey}: ${Array.isArray(nestedValue) ? nestedValue.join(', ') : nestedValue}`
                              )
                              .join('; ');
                      } else {
                          messages = String(value);
                      }
                      return `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${messages}`;
                  })
                  .join('; ');
              errorMsg = fieldErrors || "Validation failed. Please check the details.";
          } else if (responseData.detail && typeof responseData.detail === 'string') {
              errorMsg = responseData.detail;
          } else {
              // Fallback for other object structures
              try {
                errorMsg = JSON.stringify(responseData);
              } catch (e) {
                errorMsg = "Could not parse error response.";
              }
          }
      } else if (typeof responseData === 'string') {
          errorMsg = responseData;
      }
       toast.error(`${isEditMode ? 'Update' : 'Create'} failed: ${errorMsg}`);
    } else if (error.request) {
      toast.error(`${isEditMode ? 'Update' : 'Create'} failed: No response from server.`);
    } else {
      toast.error(`${isEditMode ? 'Update' : 'Create'} failed: ${error.message}`);
    }
  } finally {
    setIsSubmitting(false);
  }
};
  // Tab navigation
  const toggleTab = (tab) => {
    if (activeTab !== tab && tab >= 1 && tab <= 4) {
      setActiveTab(tab);
    }
  };

  // Fetch applicant data in edit mode
  useEffect(() => {
  const fetchData = async () => {
   
    const token = localStorage.getItem("accessToken"); 

    if (!token) { // Token illaati check panradhu mukkiyam
        toast.error("Authentication token not found. Please login again to edit.");
        console.error("Token not found for fetching applicant data in edit mode");
        return; 
    }

    try {
      
      const response = await axios.get(`${API_URL}${applicantId}/`, { // API_URL definition paathukonga
        headers: { 
            'Authorization': `Bearer ${token}` // <--- TOKEN INGAYUM ANUPPANUM
        }, 
      });

      const transformedData = transformAPIData(response.data);
      setFormData(transformedData);

      if (response.data.proofs) {
        setApplicantDocuments(response.data.proofs.map(proof => ({
            id: proof.id,
            type: proof.type,
            idNumber: proof.idNumber,
            file: proof.document_file_url || proof.file // Backend la irundhu vara URL
        })));
      }

      if (response.data.profile_photo) {
        setProfilePhotoPreview(response.data.profile_photo); // Backend la irundhu vara URL
      }
    } catch (error) {
      console.error("Error fetching applicant data:", error); // Line 446 la indha log varudhu
      let errorMsg = "Failed to load applicant data for editing.";
      if (error.response && error.response.status === 401) {
          errorMsg = "Unauthorized: Could not fetch applicant data. Please login again.";
      } else if (error.response && error.response.data && error.response.data.detail) {
          errorMsg = error.response.data.detail;
      }
      toast.error(errorMsg);
    }
  };

  if (isEditMode && applicantId) { // applicantId null-aa illaama irukkanum
    fetchData();
  }
 
}, [isEditMode, applicantId, transformAPIData]); 
  // Render form group with error handling
  const renderFormGroup = (label, name, type, options = [], value, onChange, disabled = false) => {
    const error = errors[name];
    
    return (
      <FormGroup className="mb-3">
        <Label>{label}</Label>
        {type === "select" ? (
          <Input
            type="select"
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            invalid={!!error}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Input>
        ) : (
          <Input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            invalid={!!error}
          />
        )}
        {error && <div className="text-danger small">{error}</div>}
      </FormGroup>
    );
  };

  // Render form fields based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 1: // Personal Details
        return (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={1} sm={2}>
                {renderFormGroup("Title", "title", "select", [
                  { value: 1, label: "Mr" },
                  { value: 2, label: "Mrs" },
                  { value: 3, label: "Ms" },
                  { value: 4, label: "Dr" },
                ], formData.title, handleInputChange)}
              </Col>
              <Col md={5} sm={10}>
                {renderFormGroup("First Name", "first_name", "text", [], formData.first_name, handleInputChange)}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup("Last Name", "last_name", "text", [], formData.last_name, handleInputChange)}
              </Col>
            </Row>

            <Row>
              <Col md={2} sm={12}>
                {renderFormGroup("Date of Birth", "dateOfBirth", "date", [], formData.dateOfBirth, handleInputChange)}
              </Col>
              <Col md={4} sm={12}>
                {renderFormGroup("Gender", "gender", "select", [
                  { value: 1, label: "Male" },
                  { value: 2, label: "Female" },
                  { value: 3, label: "Other" },
                ], formData.gender, handleInputChange)}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup("Marital Status", "maritalStatus", "select", [
                  { value: 1, label: "Single" },
                  { value: 2, label: "Married" },
                  { value: 3, label: "Divorced" },
                  { value: 4, label: "Widowed" },
                ], formData.maritalStatus, handleInputChange)}
              </Col>
            </Row>

            <Row>
              <Col md={6} sm={12}>
                {renderFormGroup("Email", "email", "email", [], formData.email, handleInputChange)}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup("Phone", "phone", "tel", [], formData.phone, handleInputChange)}
              </Col>
            </Row>

            <Row>
              <Col md={6} sm={12}>
                {renderFormGroup("Address", "address", "text", [], formData.address, handleInputChange)}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup("City", "city", "text", [], formData.city, handleInputChange)}
              </Col>
            </Row>

            <Row>
              <Col md={6} sm={12}>
                {renderFormGroup("State", "state", "text", [], formData.state, handleInputChange)}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup("Postal Code", "postalCode", "text", [], formData.postalCode, handleInputChange)}
              </Col>
            </Row>

            <Row className="mt-4">
              <Col md={12}>
                <h5>Upload ID Proof Documents</h5>
                <DocumentUpload
                  ref={documentUploadRef}
                  initialDocuments={applicantDocuments}
                  onDocumentsChange={handleDocumentsChange}
                />
              </Col>
            </Row>
          </Form>
        );

      case 2: // Employment Details
        return (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Employment Type",
                  "employment[0].employmentType",
                  "select",
                  [
                    { value: 1, label: "Agricultural Laborers" },
                    { value: 2, label: "Private Jobs" },
                    { value: 3, label: "Daily Wage Laborers" },
                    { value: 4, label: "Cottage Industry Workers" },
                    { value: 5, label: "Dairy Workers" },
                    { value: 6, label: "Rural Shopkeepers" },
                    { value: 7, label: "Government" },
                    { value: 8, label: "Transport Operators" },
                  ],
                  formData.employment[0]?.employmentType,
                  handleInputChange
                )}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Job Title",
                  "employment[0].jobTitle",
                  "text",
                  [],
                  formData.employment[0]?.jobTitle,
                  handleInputChange
                )}
              </Col>
            </Row>

            <Row>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Years with Employer",
                  "employment[0].yearsWithEmployer",
                  "number",
                  [],
                  formData.employment[0]?.yearsWithEmployer,
                  handleInputChange
                )}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Monthly Income",
                  "employment[0].monthlyIncome",
                  "number",
                  [],
                  formData.employment[0]?.monthlyIncome,
                  handleInputChange
                )}
              </Col>
            </Row>

            <Row>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Other Income",
                  "employment[0].otherIncome",
                  "number",
                  [],
                  formData.employment[0]?.otherIncome,
                  handleInputChange
                )}
              </Col>
            </Row>
          </Form>
        );

      case 3: // Bank Details
        return (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Account Holder",
                  "banking_details[0].accountHolderName",
                  "text",
                  [],
                  formData.banking_details[0]?.accountHolderName,
                  handleInputChange
                )}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Account Number",
                  "banking_details[0].accountNumber",
                  "text",
                  [],
                  formData.banking_details[0]?.accountNumber,
                  handleInputChange
                )}
              </Col>
            </Row>
            <Row>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Bank Name",
                  "banking_details[0].bankName",
                  "text",
                  [],
                  formData.banking_details[0]?.bankName,
                  handleInputChange
                )}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "IFSC Code",
                  "banking_details[0].ifscCode",
                  "text",
                  [],
                  formData.banking_details[0]?.ifscCode,
                  handleInputChange
                )}
              </Col>
            </Row>
            <Row>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Bank Branch",
                  "banking_details[0].bankBranch",
                  "text",
                  [],
                  formData.banking_details[0]?.bankBranch,
                  handleInputChange
                )}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Account Type",
                  "banking_details[0].accountType",
                  "select",
                  [
                    { value: 1, label: "Savings" },
                    { value: 2, label: "Current" },
                  ],
                  formData.banking_details[0]?.accountType,
                  handleInputChange
                )}
              </Col>
            </Row>
          </Form>
        );

      case 4: // Property Details
        return (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col className="col-12">
                <CardBody className="d-flex justify-content-end">
                  <div className="col-md-4">
                    <div {...getRootProfilePhotoProps()} className="dropzone">
                      <input {...getInputProfilePhotoProps()} />
                      <div className="dz-message">
                        {profilePhotoPreview ? (
                          <>
                            <img src={profilePhotoPreview} alt="Preview" className="profile-preview" />
                            <Button color="danger" size="sm" onClick={removeProfilePhoto}>
                              Remove Photo
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="photo-placeholder">
                              <i className="bx bx-camera fs-3" />
                            </div>
                            <h6>Upload Passport Photo</h6>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Col>
            </Row>

            <Row>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Property Type",
                  "properties[0].propertyType",
                  "select",
                  [
                    { value: 1, label: "Agricultural Land" },
                    { value: 2, label: "Kutcha House" },
                    { value: 3, label: "Pucca House" },
                    { value: 4, label: "Farm House" },
                    { value: 5, label: "Cattle Shed" },
                    { value: 6, label: "Storage Shed" },
                    { value: 7, label: "Residential Plot" },
                    { value: 8, label: "Village Shop" },
                    { value: 9, label: "Joint Family House" },
                    { value: 10, label: "Vacant Land" },
                  ],
                  formData.properties[0]?.propertyType,
                  handleInputChange
                )}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Property Address",
                  "properties[0].property_address",
                  "text",
                  [],
                  formData.properties[0]?.property_address,
                  handleInputChange
                )}
              </Col>
            </Row>

            <Row>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Property Value",
                  "properties[0].propertyValue",
                  "number",
                  [],
                  formData.properties[0]?.propertyValue,
                  handleInputChange
                )}
              </Col>
              <Col md={6} sm={12}>
                {renderFormGroup(
                  "Property Age",
                  "properties[0].propertyAge",
                  "number",
                  [],
                  formData.properties[0]?.propertyAge,
                  handleInputChange
                )}
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                {renderFormGroup(
                  "Ownership",
                  "properties[0].propertyOwnership",
                  "select",
                  [
                    { value: 1, label: "Owned" },
                    { value: 2, label: "Mortgaged" },
                  ],
                  formData.properties[0]?.propertyOwnership,
                  handleInputChange
                )}
              </Col>
            </Row>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <h3 className="card-title mb-0">
            {isEditMode ? "Edit Applicant" : "New Loan Application"}
          </h3>
        </CardHeader>
        <CardBody>
          <div id="basic-pills-wizard" className="twitter-bs-wizard">
            <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
              {["Personal", "Employment", "Bank", "Property"].map((label, index) => (
                <NavItem key={index} className="flex-sm-fill text-sm-center">
                  <NavLink
                    className={classnames({ active: activeTab === index + 1 })}
                    onClick={() => toggleTab(index + 1)}
                  >
                    <div className="step-icon" id={`Step${index + 1}`}>
                      <i className={`bx ${['bx-user', 'bx-briefcase', 'mdi mdi-bank', 'bx-home'][index]}`}></i>
                      <UncontrolledTooltip placement="top" target={`Step${index + 1}`}>
                        {`${label} Details`}
                      </UncontrolledTooltip>
                    </div>
                  </NavLink>
                </NavItem>
              ))}
            </ul>

            <TabContent activeTab={activeTab}>
              <div className="text-center mt-2 mb-3">
                <h5>{["Personal", "Employment", "Bank", "Property"][activeTab - 1]} Details</h5>
                <p className="card-title-desc">Fill all information below</p>
              </div>

              {renderTabContent()}
            </TabContent>

            <ul className="pager wizard twitter-bs-wizard-pager-link d-flex flex-wrap justify-content-between mt-3">
              <li className={activeTab === 1 ? "previous disabled" : "previous"}>
                <Button
                  color="primary"
                  disabled={activeTab === 1}
                  onClick={() => toggleTab(activeTab - 1)}
                >
                  <i className="bx bx-chevron-left me-1"></i> Previous
                </Button>
              </li>

              <li className="next">
                {activeTab === 4 ? (
                  <Button color="success" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : isEditMode ? "Update Applicant" : "Submit Application"}
                    <i className="bx bx-check-circle ms-1"></i>
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={() => toggleTab(activeTab + 1)}
                    disabled={activeTab === 4}
                  >
                    Next <i className="bx bx-chevron-right ms-1"></i>
                  </Button>
                )}
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ApplicationEdit;