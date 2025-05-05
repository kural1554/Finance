import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Table, Button, Input } from "reactstrap";
import Dropzone from "react-dropzone";

const DocumentUpload = ({ initialDocuments = [], onDocumentsChange }) => {
  const [currentDoc, setCurrentDoc] = useState({
    id: null, // Add id field to track edits
    type: "",
    idNumber: "",
    file: null,
  });
  const [documents, setDocuments] = useState(initialDocuments);
  const [errors, setErrors] = useState({});

  // Sync documents when initialDocuments changes
  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      documents.forEach((doc) => {
        if (doc.file?.preview) URL.revokeObjectURL(doc.file.preview);
      });
      if (currentDoc.file?.preview) URL.revokeObjectURL(currentDoc.file.preview);
    };
  }, [documents, currentDoc.file]);

  // Notify parent component when documents change
  useEffect(() => {
    if (typeof onDocumentsChange === "function") {
      onDocumentsChange(documents);
    }
  }, [documents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDoc({ ...currentDoc, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const handleFileUpload = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length > 0) {
      setCurrentDoc(prev => ({
        ...prev,
        file: acceptedFiles[0]
      }));
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateDocumentNumber = (type, idNumber) => {
    switch (type) {
      case "pan":
        return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(idNumber);
      case "aadhar":
        return /^\d{4}\s?\d{4}\s?\d{4}$/.test(idNumber);
      case "voterId":
        return /^[A-Z]{3}[0-9]{7}$/.test(idNumber);
      case "drivingLicense":
        return /^[A-Z]{2}\d{13}$/.test(idNumber);
      default:
        return false;
    }
  };

  const validateCurrentDoc = () => {
    const errs = {};

    if (!currentDoc.type) {
      errs.type = "Please select an ID proof type";
    }

    if (!currentDoc.idNumber) {
      errs.idNumber = "Please enter the document number";
    } else if (!validateDocumentNumber(currentDoc.type, currentDoc.idNumber)) {
      errs.idNumber = `Invalid ${currentDoc.type.toUpperCase()} number format`;
    }

    if (!currentDoc.file) {
      errs.file = "Please upload a document file";
    }

    return errs;
  };

  const handleAddDocument = () => {
    const errs = validateCurrentDoc();
    if (Object.keys(errs).length > 0) return setErrors(errs);
  
    if (currentDoc.id) {
      // Update existing document
      setDocuments(documents.map(doc => 
        doc.id === currentDoc.id 
          ? { ...doc, type: currentDoc.type, idNumber: currentDoc.idNumber, file: currentDoc.file }
          : doc
      ));
    } else {
      // Add new document with temporary local id
      setDocuments([...documents, {
        ...currentDoc,
        id: `local-${Date.now()}`
      }]);
    }
  
    setCurrentDoc({ id: null, type: "", idNumber: "", file: null });
    setErrors({});
  };
  

  const handleRemoveDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleEditDocument = (doc) => {
    setCurrentDoc({
      id: doc.id,
      type: doc.type,
      idNumber: doc.idNumber,
      file: doc.file
    });
  };

  const renderFilePreview = (file) => {
    if (!file) return null;
    if (typeof file === "string") {
      return file.endsWith(".pdf") ? (
        <a href={file} target="_blank" rel="noopener noreferrer">View PDF</a>
      ) : (
        <img src={file} alt="Document" className="img-thumbnail" style={{ width: "80px", height: "auto" }} />
      );
    }
    return file.type.startsWith("image/") ? (
      <img src={file.preview} alt={file.name} className="img-thumbnail" style={{ width: "80px", height: "auto" }} />
    ) : (
      <a href={file.preview} target="_blank" rel="noopener noreferrer">View PDF</a>
    );
  };
  const prepareDocumentsForBackend = (documents) => {
    return documents.map(doc => {
      if (typeof doc.file === "string") {
        // Already uploaded file, send as URL or skip file
        return {
          id: doc.id,
          type: doc.type,
          idNumber: doc.idNumber,
          file: null, // Or remove file key if not needed
        };
      } else {
        // New file uploaded, send the file
        return {
          id: doc.id?.toString().replace("local-", "") || null,
          type: doc.type,
          idNumber: doc.idNumber,
          file: doc.file, // Real file object
        };
      }
    });
  };

  const handleSubmit = () => {
    const applicantDocuments = prepareDocumentsForBackend(documents);
    const formDataToSend = new FormData();

    if (applicantDocuments.length > 0 && !applicantDocuments.some(doc => doc.file instanceof File)) {
      formDataToSend.append('proofs', JSON.stringify(applicantDocuments));
    }

    // Further processing of formDataToSend
  };

  const remainingDocs = 3 - documents.length;

  return (
    <div className="document-upload container">
      <Row className="mb-4">
        <Col xs={12} md={4}>
          <FormGroup>
            <Label for="documentType">ID Proof Type</Label>
            <select
              id="documentType"
              name="type"
              value={currentDoc.type}
              onChange={handleChange}
              className={`form-select ${errors.type ? "is-invalid" : ""}`}
            >
              <option value="">Select Document</option>
              {["pan", "aadhar", "voterId", "drivingLicense"].map((docType) => (
                <option 
                  key={docType} 
                  value={docType} 
                  disabled={documents.some(doc => doc.type === docType && doc.id !== currentDoc.id)}
                >
                  {docType === "pan" ? "PAN Card" :
                   docType === "aadhar" ? "Aadhar Card" :
                   docType === "voterId" ? "Voter ID" : "Driving License"}
                </option>
              ))}
            </select>
            {errors.type && <div className="invalid-feedback">{errors.type}</div>}
          </FormGroup>
        </Col>

        <Col xs={12} md={4}>
          <FormGroup>
            <Label for="documentNumber">Document Number</Label>
            <Input
              id="documentNumber"
              name="idNumber"
              value={currentDoc.idNumber}
              onChange={handleChange}
              className={`form-control ${errors.idNumber ? "is-invalid" : ""}`}
              placeholder={
                currentDoc.type === "pan" ? "ABCDE1234F" :
                currentDoc.type === "aadhar" ? "1234 5678 9012" :
                currentDoc.type === "voterId" ? "ABC1234567" :
                currentDoc.type === "drivingLicense" ? "DL1234567890123" : ""
              }
            />
            {errors.idNumber && <div className="invalid-feedback">{errors.idNumber}</div>}
          </FormGroup>
        </Col>

        <Col xs={12} md={4}>
          <FormGroup>
            <Label>Upload Document</Label>
            <Dropzone
              onDrop={handleFileUpload}
              accept={{ "image/*": [], "application/pdf": [] }}
              maxFiles={1}
              maxSize={2 * 1024 * 1024}
            >
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                  {...getRootProps()}
                  className={`dropzone ${isDragActive ? "active" : ""} ${errors.file ? "is-invalid" : ""}`}
                >
                  <input {...getInputProps()} />
                  <div className="dropzone-content">
                    <i className="bx bx-cloud-upload fs-3"></i>
                    <p>{isDragActive ? "Drop file here" : "Drag & drop or click to upload"}</p>
                    <small className="text-muted">Max file size: 2MB</small>
                  </div>
                </div>
              )}
            </Dropzone>
            {errors.file && <div className="invalid-feedback d-block">{errors.file}</div>}
          </FormGroup>
        </Col>
      </Row>

      {currentDoc.file && (
        <Row className="mb-4">
          <Col xs={12}>
            <div className="file-preview d-flex align-items-center gap-3">
              {renderFilePreview(currentDoc.file)}
              <div>
                <p className="mb-0">{currentDoc.file.name}</p>
                <small className="text-muted">{currentDoc.file.formattedSize}</small>
              </div>
              <Button
                color="danger"
                size="sm"
                onClick={() => setCurrentDoc({ ...currentDoc, file: null })}
              >
                Remove File
              </Button>
            </div>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col xs={12}>
          <Button
            color="primary"
            onClick={handleAddDocument}
            disabled={!currentDoc.type || !currentDoc.idNumber || !currentDoc.file}
          >
            {currentDoc.id ? "Update Document" : "Add Document"}
          </Button>
          {currentDoc.id && (
            <Button
              color="secondary"
              onClick={() => setCurrentDoc({ id: null, type: "", idNumber: "", file: null })}
              className="ms-2"
            >
              Cancel Edit
            </Button>
          )}
        </Col>
      </Row>

      {documents.length > 0 && (
        <Row>
          <Col xs={12}>
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Document Number</th>
                  <th>Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.type}</td>
                    <td>{doc.idNumber}</td>
                    <td>{renderFilePreview(doc.file)}</td>
                    <td>
                      <Button
                        color="warning"
                        size="sm"
                        onClick={() => handleEditDocument(doc)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleRemoveDocument(doc.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DocumentUpload;