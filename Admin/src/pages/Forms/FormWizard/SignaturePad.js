// components/SignaturePad.js
import React from "react";
import SignatureCanvas from "react-signature-canvas";
import { FormGroup, Label, Button } from "reactstrap";

const SignaturePad = ({ sigCanvas, error, onClear }) => (
  <FormGroup>
    <Label>Applicant Signature</Label>
    <div
      className="signature-container"
      style={{
        border: "1px solid #ced4da",
        borderRadius: "5px",
        padding: "10px",
        background: "#fff",
      }}
    >
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          className: "signature-canvas",
          style: { width: "100%", height: 200 },
        }}
      />
    </div>
    {error && <div className="text-danger small mt-1">{error}</div>}
    <Button color="secondary" size="sm" className="mt-2" onClick={onClear}>
      Clear Signature
    </Button>
  </FormGroup>
);

export default SignaturePad;
