import React, { useState, useEffect } from "react";
import { CardBody, Row, Col, Form } from "reactstrap";
import Dropzone from "react-dropzone";

const ImagePreview = ({ selectedFiles, setSelectedFiles }) => (
  <div 
    className="position-absolute p-2 rounded shadow bg-light" 
    style={{ top: "40px", right: "82px", zIndex: "100" }}
  >
    {selectedFiles.map((file, index) => (
      <div key={index} className="d-flex align-items-center mb-1">
        <img src={file.preview} alt={file.name} width="60" height="60" className="rounded me-2" />
        <div className="d-flex flex-column">
          <small className="d-block">{file.name}</small>
          <small className="text-muted">{file.formattedSize}</small>
          <button 
            type="button" 
            className="btn btn-link btn-sm text-danger p-0 text-start" 
            onClick={() => {
              URL.revokeObjectURL(file.preview); // ✅ Clean up memory leak
              setSelectedFiles(prev => prev.filter((_, i) => i !== index));
            }}
          >
            Remove
          </button>
        </div>
      </div>
    ))}
  </div>
);

const FileUpload = ({ handleAcceptedFiles, selectedFiles, error }) => (
  <Form className="d-flex justify-content-end">
    <div className="col-md-4 col-lg-3">
      <Dropzone
        onDrop={(acceptedFiles, fileRejections) => {
          if (fileRejections.length > 0) {
            alert("File too large or invalid type! Only images under 2MB allowed.");
            return;
          }
          handleAcceptedFiles(acceptedFiles);
        }}
        accept="image/*"
        maxSize={2 * 1024 * 1024} // 2MB limit
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone border rounded p-3" style={{ cursor: "pointer", minHeight: "100px" }}>
            <input {...getInputProps()} />
            <div className="d-flex align-items-center justify-content-center">
              <i className="bx bx-cloud-upload me-2" />
              <div>
                <h6 className="mb-0">Upload passport photo</h6>
                <small className="text-muted">Click or drag an image</small>
              </div>
            </div>
          </div>
        )}
      </Dropzone>
      {error && <p className="text-danger small mt-2">{error}</p>}
      {selectedFiles.length > 0 && (
        <div className="text-center mt-3">
          <button className="btn btn-primary btn-sm">
            Upload {selectedFiles.length} File(s)
          </button>
        </div>
      )}
    </div>
  </Form>
);

const ImageUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");

  const handleAcceptedFiles = (files) => {
    const formattedFiles = files.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file), // ✅ Generate preview
      formattedSize: formatBytes(file.size), // ✅ Format size
    }));
    setSelectedFiles((prev) => [...prev, ...formattedFiles]);
  };

  useEffect(() => {
    return () => {
      // ✅ Cleanup previews on unmount
      selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [selectedFiles]);

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
  };

  return (
    <Row>
      <Col className="col-12">
        <CardBody className="position-relative">
          {selectedFiles.length > 0 && (
            <ImagePreview selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
          )}
          <FileUpload handleAcceptedFiles={handleAcceptedFiles} selectedFiles={selectedFiles} error={error} />
        </CardBody>
      </Col>
    </Row>
  );
};

export default ImageUploader;
