import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Table, Button, Input } from "reactstrap";
import Dropzone from "react-dropzone";

const DocumentUpload = ({ onDocumentsChange }) => {
  const [currentDoc, setCurrentDoc] = useState({
    type: "",
    idNumber: "",
    file: null,
  });
  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});

  // Cleanup object URLs when component unmounts or documents change
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
    if (rejectedFiles?.length > 0) {
      setErrors({ ...errors, file: "File must be an image or PDF and less than 2MB" });
      return;
    }

    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      setCurrentDoc({
        ...currentDoc,
        file: Object.assign(file, {
          preview: URL.createObjectURL(file),
          formattedSize: formatFileSize(file.size),
        }),
      });
      setErrors({ ...errors, file: null });
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Validate document number based on document type
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

    // Validate document type
    if (!currentDoc.type) {
      errs.type = "Please select an ID proof type";
    }

    // Validate document number
    if (!currentDoc.idNumber) {
      errs.idNumber = "Please enter the document number";
    } else if (!validateDocumentNumber(currentDoc.type, currentDoc.idNumber)) {
      errs.idNumber = `Invalid ${currentDoc.type.toUpperCase()} number format`;
    }

    // Validate file
    if (!currentDoc.file) {
      errs.file = "Please upload a document file";
    }

    return errs;
  };

  const handleAddDocument = () => {
    const errs = validateCurrentDoc();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setDocuments([...documents, currentDoc]);
    setCurrentDoc({ type: "", idNumber: "", file: null });
    setErrors({});
  };

  const handleRemoveDocument = (index) => {
    const newDocs = documents.filter((_, i) => i !== index);
    setDocuments(newDocs);
  };

  const handleEditDocument = (index) => {
    const docToEdit = documents[index];
    setCurrentDoc(docToEdit);
    handleRemoveDocument(index);
  };

  const renderFilePreview = (file) => {
    if (!file) return null;
    return file.type.startsWith("image/") ? (
      <img
        src={file.preview}
        alt={file.name}
        className="img-thumbnail"
        style={{ width: "80px", height: "auto" }}
        aria-label="Document preview"
      />
    ) : (
      <a href={file.preview} target="_blank" rel="noopener noreferrer" aria-label="View PDF">
        View PDF
      </a>
    );
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
  aria-invalid={!!errors.type}
  aria-describedby="documentTypeError"
>
  <option value="">Select Document</option>
  {["pan", "aadhar", "voterId", "drivingLicense"].map((docType) => (
    <option key={docType} value={docType} disabled={documents.some((doc) => doc.type === docType)}>
      {docType === "pan"
        ? "PAN Card"
        : docType === "aadhar"
        ? "Aadhar Card"
        : docType === "voterId"
        ? "Voter ID"
        : "Driving License"}
    </option>
  ))}
</select>
            {errors.type && (
              <div id="documentTypeError" className="invalid-feedback">
                {errors.type}
              </div>
            )}
          </FormGroup>
        </Col>

        <Col xs={12} md={4}>
          <FormGroup>
            <Label for="documentNumber">{currentDoc.type?`${currentDoc.type.toUpperCase()} `:"Document "}Number</Label>
            <Input
              id="documentNumber"
              name="idNumber"
              value={currentDoc.idNumber}
              onChange={handleChange}
              className={`form-control ${errors.idNumber ? "is-invalid" : ""}`}
              placeholder={
                currentDoc.type === "pan"
                  ? "ABCDE1234F"
                  : currentDoc.type === "aadhar"
                  ? "1234 5678 9012"
                  : currentDoc.type === "voterId"
                  ? "ABC1234567"
                  : currentDoc.type === "drivingLicense"
                  ? "DL1234567890123"
                  : ""
              }
              aria-invalid={!!errors.idNumber}
              aria-describedby="documentNumberError"
            />
            {errors.idNumber && (
              <div id="documentNumberError" className="invalid-feedback">
                {errors.idNumber}
              </div>
            )}
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
                  className={`dropzone-border ${isDragActive ? "active" : ""} ${
                    errors.file ? "is-invalid" : ""
                  }`}
                  style={{
                    border: "2px dashed #dee2e6",
                    borderRadius: "0.375rem",
                    padding: "1.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "border-color 0.3s ease",
                    ...(isDragActive && {
                      borderColor: "#0d6efd",
                      backgroundColor: "rgba(13, 110, 253, 0.05)",
                    }),
                  }}
                  aria-invalid={!!errors.file}
                  aria-describedby="fileUploadError"
                >
                  <input {...getInputProps()} />
                  <div className="dropzone-content">
                    <i className="bx bx-cloud-upload fs-3"></i>
                    <p className="mb-0">
                      {isDragActive ? "Drop file here" : "Drag & drop or click to upload"}
                    </p>
                    <small className="text-muted">Max file size: 2MB</small>
                  </div>
                </div>
              )}
            </Dropzone>
            {errors.file && (
              <div id="fileUploadError" className="invalid-feedback d-block">
                {errors.file}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      {currentDoc.file && (
        <Row className="mb-4">
          <Col xs={12}>
            <div
              className="file-preview d-flex align-items-center gap-3 flex-wrap"
              style={{
                padding: "1rem",
                border: "1px solid #dee2e6",
                borderRadius: "0.375rem",
                backgroundColor: "#f8f9fa",
              }}
            >
              {renderFilePreview(currentDoc.file)}
              <div>
                <p className="mb-0">{currentDoc.file.name}</p>
                <small className="text-muted">{currentDoc.file.formattedSize}</small>
              </div>
              <Button
                color="danger"
                size="sm"
                onClick={() => setCurrentDoc({ ...currentDoc, file: null })}
                aria-label="Remove file"
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
            aria-label="Add document"
          >
            {currentDoc.file ? "Add Document" : "Upload & Add Document"}
          </Button>
        </Col>
      </Row>

      {documents.length > 0 && (
        <Row>
          <Col xs={12}>
            <Table striped bordered responsive>
              <thead className="bg-light">
                <tr>
                  <th>Document Type</th>
                  <th>Document Number</th>
                  <th>Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={index}>
                    <td className="text-capitalize">{doc.type}</td>
                    <td>{doc.idNumber}</td>
                    <td>{renderFilePreview(doc.file)}</td>
                    <td>
                      <Button
                        color="warning"
                        size="sm"
                        onClick={() => handleEditDocument(index)}
                        className="me-2"
                        aria-label="Edit document"
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleRemoveDocument(index)}
                        aria-label="Remove document"
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

      {documents.length < 3 && (
        <Row>
          <Col xs={12}>
            {/* <div className="alert alert-warning">
              {remainingDocs > 0 && (
                <div>
                  Please upload at least {remainingDocs} more{" "}
                  {remainingDocs === 1 ? "document" : "documents"}.
                </div>
              )}
            </div> */}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DocumentUpload;