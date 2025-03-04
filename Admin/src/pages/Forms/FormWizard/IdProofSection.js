import React, { useState } from "react";
import {
  Accordion, AccordionItem, AccordionHeader, AccordionBody,
  Row, Col, Label, Input, Button
} from "reactstrap";
import Dropzone from "react-dropzone";

const idTypes = ["Aadhar", "PAN", "Driving License", "Voter ID"]; // Fixed ID Types

const IdProofSection = ({ idProofs, setIdProofs, openIndex, setOpenIndex }) => {
  const [errors, setErrors] = useState({}); // Validation errors

  const handleIdProofChange = (index, value) => {
    const updatedProofs = [...idProofs];
    updatedProofs[index].type = value;
    setIdProofs(updatedProofs);
  };

  const handleIdProofFiles = (index, files) => {
    if (files.length === 0) return;

    const newFiles = files.map(file => ({
      ...file,
      preview: URL.createObjectURL(file),
      formattedSize: (file.size / 1024).toFixed(2) + " KB",
    }));

    const updatedProofs = [...idProofs];
    updatedProofs[index].files = newFiles; // Replace existing file
    setIdProofs(updatedProofs);

    // Clear file validation error
    setErrors(prev => ({ ...prev, [`files${index}`]: "" }));

    if (index < 3) setOpenIndex(index + 1);
    else setOpenIndex(null);
  };

  const validateFields = (index) => {
    const newErrors = { ...errors };
    const proof = idProofs[index];

    if (!proof.number) {
      newErrors[`number${index}`] = "ID Number is required";
    } else if (proof.type === "Aadhar" && !/^\d{12}$/.test(proof.number)) {
      newErrors[`number${index}`] = "Enter a valid 12-digit Aadhar number";
    } else if (proof.type === "PAN" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(proof.number)) {
      newErrors[`number${index}`] = "Enter a valid PAN (ABCDE1234F)";
    } else {
      newErrors[`number${index}`] = "";
    }

    if (proof.files.length === 0) {
      newErrors[`files${index}`] = "Upload required";
    } else {
      newErrors[`files${index}`] = "";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every(error => error === "");
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-2">
      <h6 className="text-primary text-center fw-semibold">Upload ID Proofs (Max 4)</h6>
      <Accordion open={openIndex?.toString()} toggle={() => {}}>
        {idTypes.map((idType, index) => (
          <AccordionItem key={index} className="mb-1 border shadow-sm rounded">
            <AccordionHeader targetId={index.toString()} onClick={() => toggleAccordion(index)}>
              <span className="fw-semibold" style={{ fontSize: "12px" }}>
                {idType} {idProofs[index]?.number ? ` - ${idProofs[index]?.number}` : ""}
              </span>
            </AccordionHeader>
            <AccordionBody accordionId={index.toString()} className="p-2">
              <Row>
                <Col xs={12}>
                  <Label className="fw-bold" style={{ fontSize: "11px" }}>{idType} Number</Label>
                  <Input 
                    type="text" 
                    className={`form-control-sm ${errors[`number${index}`] ? "is-invalid" : ""}`}
                    value={idProofs[index]?.number || ""}
                    onChange={(e) => handleIdProofChange(index, { ...idProofs[index], number: e.target.value, type: idType })}
                    onBlur={() => validateFields(index)}
                    style={{ fontSize: "11px" }}
                  />
                  {errors[`number${index}`] && <div className="text-danger" style={{ fontSize: "10px" }}>{errors[`number${index}`]}</div>}
                </Col>
              </Row>

              {/* Dropzone for File Upload */}
              <Label className="mt-1 fw-bold" style={{ fontSize: "10px" }}>Upload {idType} File</Label>
              <Dropzone
                onDrop={(files) => handleIdProofFiles(index, files)}
                accept={{ "application/pdf": [], "image/jpeg": [], "image/png": [] }}
                maxFiles={1}
                maxSize={2 * 1024 * 1024} // 2MB limit
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className={`dropzone p-1 border rounded text-center bg-light d-flex align-items-center justify-content-center ${errors[`files${index}`] ? "border-danger" : ""}`}
                    style={{ cursor: "pointer", height: "40px", width: "100%", borderStyle: "dashed", fontSize: "10px" }}
                  >
                    <input {...getInputProps()} />
                    <i className="bx bx-upload fs-6 text-primary me-1" />
                    <small className="text-muted">PDF, JPG, PNG</small>
                  </div>
                )}
              </Dropzone>

              {/* Validation Error */}
              {errors[`files${index}`] && <div className="text-danger mt-1" style={{ fontSize: "10px" }}>{errors[`files${index}`]}</div>}

              {/* File Preview */}
              {idProofs[index]?.files?.length > 0 && (
                <div className="mt-1 d-flex flex-wrap gap-1">
                  {idProofs[index].files.map((file, fileIndex) => (
                    <div key={fileIndex} className="p-1 border rounded d-flex align-items-center gap-1 shadow-sm">
                      <a href={file.preview} target="_blank" rel="noopener noreferrer" className="text-center">
                        <i className="bx bx-file fs-6 text-primary"></i>
                        <small className="d-block text-muted">{file.formattedSize}</small>
                      </a>
                      <button
                        type="button"
                        className="btn btn-link btn-sm text-danger p-0"
                        onClick={() => {
                          const updatedProofs = [...idProofs];
                          updatedProofs[index].files = [];
                          setIdProofs(updatedProofs);
                        }}
                      >
                        <i className="bx bx-x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default IdProofSection;
