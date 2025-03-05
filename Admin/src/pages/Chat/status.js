import React from 'react';  

import { useNavigate } from 'react-router-dom';
import { Container } from "react-bootstrap";  
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from "react-router-dom";

const LoanTable = () => {  
  const navigate = useNavigate();
  const location = useLocation();
  const rowData = location.state?.rowData;
  
  return ( 
    <div className="page-content">
      <Container fluid>
        <div className="container mt-4 p-4 .bg-primary rounded">  
          {/* Centered Image */}
          <div className="text-center mb-3">
          <img
            src={rowData?.customerphoto || "default-image.jpg"} // Use default if missing
            alt="Customer Passport"
            style={{ width: "120px", height: "120px", borderRadius: "10px", border: "3px solid black" }}
          />
          </div>  

          {/* Loan Information Form */}
          <div className="p-4 border rounded bg-white">
            <h5 className="text-center mb-4">Loan Information</h5>  

            <div className="row mb-3">  
              <div className="col-md-6">  
                <label><strong>Customer Name:</strong></label>  
                <input type="text" className="form-control" placeholder="Enter Customer Name" />  
              </div>  
              <div className="col-md-6">  
                <label><strong>Mob No:</strong></label>  
                <input type="text" className="form-control" placeholder="Enter Mobile Number" />  
              </div>  
            </div>  

            <div className="row mb-3">  
              <div className="col-md-6">  
                <label><strong>Loan Amount:</strong></label>  
                <input type="text" className="form-control" placeholder="Enter Loan Amount" />  
              </div>  
              <div className="col-md-6">  
                <label><strong>Loan No:</strong></label>  
                <input type="text" className="form-control" placeholder="Enter Loan Number" />  
              </div>  
            </div>  
          </div>  

          {/* Loan Table */}
          <table className="table table-bordered mt-4 bg-white">  
            <thead className="thead-dark text-center">  
              <tr>  
                <th>No.</th>  
                <th>Date</th>  
                <th>Loan Amount</th>  
                <th>Repaid</th>  
                <th>Closing Due</th>  
                <th>Status</th>  
              </tr>  
            </thead>  
            <tbody>  
              {[...Array(20)].map((_, index) => (  
                <tr key={index}>  
                  <td className="text-center">{index + 1}</td>  
                  <td><input type="date" className="form-control" /></td>  
                  <td><input type="text" className="form-control" placeholder="Amount" /></td>  
                  <td><input type="text" className="form-control" placeholder="Repaid Amount" /></td>  
                  <td><input type="text" className="form-control" placeholder="Due Amount" /></td>  
                  <td>
                    <select 
                    className="form-select text-white fw-bold bg-danger" 
                    onChange={(e) => {
                      const selectedClass = e.target.value === "Pending" ? "bg-danger" : "bg-success";
                      e.target.className = `form-select text-white fw-bold ${selectedClass}`;
                    }}
                    >
                      <option value="Pending" className="bg-danger text-white">Pending</option>
                      <option value="Completed" className="bg-success text-white">Completed</option>
                    </select>
                  </td>  
                </tr>  
              ))}  
            </tbody>  
          </table>  

          {/* Back Button on the Right */}
          <div className="d-flex justify-content-end mt-4">
            <button 
              className="btn btn-dark px-4"
              onClick={() => navigate(-1)}  
            >
              Back
            </button>
          </div>
        </div> 
      </Container>
    </div> 
  );  
};  

export default LoanTable;
