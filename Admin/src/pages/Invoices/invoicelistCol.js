import React from "react";
import { Link } from "react-router-dom";

const Id = (cell) => {
  return cell.value ? cell.value : '';
};

const InvoiceId = (cell) => {
  return (
    <Link className="text-dark fw-medium" to="#">{cell.value}</Link>
  );
};

const Date = (cell) => {
  return cell.value ? cell.value : '';
};

const BillingName = (cell) => {
  return cell.value ? cell.value : '';
};

const Amount = (cell) => {
  return cell.value ? cell.value : '';
};

const DownloadPdf = (cell) => {
  return (
    <>
      <div>
        <button
          type="button"
          className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
        >
          <i className="bx bx-download label-icon"></i> Pdf
        </button>
      </div>
    </>
  );
};

export {
  Id,
  InvoiceId,
  Date,
  BillingName,
  Amount,
  DownloadPdf
};