import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from "react-table";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, CardHeader, Col, Container, Row, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FeatherIcon from "feather-icons-react";
import { Button } from "reactstrap";
import axios from "axios";
import { toast } from 'react-toastify'; // <--- INTHA LINE ADD PANNUNGA
import 'react-toastify/dist/ReactToastify.css';
// API URL for applicant data
const API_URL = `${process.env.REACT_APP_API_BASE_URL}api/applicants/applicants/`;


// Global Filter Component
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        <span>
            <input
                className="form-control"
                value={value || ""}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`Search ${count} records...`}
            />
        </span>
    );
}

// Table Component
function Table({ columns, data, exportPDF, onEdit, onDelete, onView }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hiddenColumns, setHiddenColumns] = useState([]);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const defaultColumn = useMemo(() => ({}), []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
        allColumns,
        setHiddenColumns: setTableHiddenColumns,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            initialState: {
                hiddenColumns,
            },
        },
        useFilters,
        useGlobalFilter
    );

    useEffect(() => {
        setTableHiddenColumns(hiddenColumns);
    }, [hiddenColumns, setTableHiddenColumns]);

    const toggleColumnVisibility = (columnId) => {
        setHiddenColumns((prevHiddenColumns) => {
            if (prevHiddenColumns.includes(columnId)) {
                return prevHiddenColumns.filter((id) => id !== columnId);
            } else {
                return [...prevHiddenColumns, columnId];
            }
        });
    };

    return (
        <React.Fragment>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2 mb-2 mb-md-0">
                    <CopyToClipboard text={JSON.stringify(data)}>
                        <button type="button" className="btn btn-secondary">
                            <span>Copy</span>
                        </button>
                    </CopyToClipboard>
                    <CSVLink data={data} filename="Applicants.csv" className="btn btn-secondary">
                        <span>Excel</span>
                    </CSVLink>
                    <button onClick={() => exportPDF(data)} type="button" className="btn btn-secondary">
                        <span>PDF</span>
                    </button>
                </div>

                <div className="d-flex gap-2 align-items-center">
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle caret color="primary">
                            <FeatherIcon icon="filter" />
                        </DropdownToggle>
                        <DropdownMenu>
                            {allColumns.map((column) => (
                                <div key={column.id} className="px-3 py-1">
                                    <label
                                        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleColumnVisibility(column.id);
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={!hiddenColumns.includes(column.id)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleColumnVisibility(column.id);
                                            }}
                                            role="checkbox"
                                            aria-checked={!hiddenColumns.includes(column.id)}
                                            tabIndex="0"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    toggleColumnVisibility(column.id);
                                                }
                                            }}
                                            style={{ marginRight: "8px" }}
                                        />
                                        {column.id}
                                    </label>
                                </div>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table" {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th key={column.id} {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr key={row.id} {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td key={cell.id} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}

// Main Component
function ApplicantsTable() {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch applicant data from API
    const fetchApplicantData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL);
            setTableData(response.data || []); // Assuming API returns array of applicants
            setError(null);
        } catch (err) {
            console.error("Error fetching applicant data:", err);
            setError("Failed to load applicant data. Please try again later.");
            // Fallback to sample data in case of API failure
            setTableData([{
                "id": 1,
                "employment": [],
                "properties": [],
                "userID": "AP875449",
                "loan_id": null,
                "loanreg_date": "2025-03-31",
                "title": 1,
                "first_name": "palanisamy",
                "last_name": "pandiyan",
                "date_of_birth": "2025-03-10",
                "gender": 1,
                "marital_status": 1,
                "email": "palanisamy@gmail.com",
                "phone": "7854562321",
                "address": "thjojo",
                "city": "trichy",
                "state": "tamilnadu",
                "postal_code": "621212",
                "applicant_photo": "http://127.0.0.1:8080/media/uploads/images/customer/aadhar.jpg",
                "is_approved": false,
                "loan_count": 0
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicantData();
    }, []);

    // Handle view applicant details
    const handleViewApplicant = (rowData) => {
        navigate(`/status/${rowData.id}`); // ✅ navigates to: /status/5
      };

    // Handle edit applicant
    const handleEditApplicant = (applicantData) => {
        // Transform the API data to match your form structure
        const transformedData = {
            ...applicantData,
            // Map nested fields if needed
            employmentType: applicantData.employment?.[0]?.employmentType || '',
            jobTitle: applicantData.employment?.[0]?.jobTitle || '',
            yearsWithEmployer: applicantData.employment?.[0]?.yearsWithEmployer || '',
            monthlyIncome: applicantData.employment?.[0]?.monthlyIncome || '',
            otherIncome: applicantData.employment?.[0]?.otherIncome || '',

            // Banking details
            accountHolderName: applicantData.banking_details?.[0]?.accountHolderName || '',
            accountNumber: applicantData.banking_details?.[0]?.accountNumber || '',
            bankName: applicantData.banking_details?.[0]?.bankName || '',
            ifscCode: applicantData.banking_details?.[0]?.ifscCode || '',
            bankBranch: applicantData.banking_details?.[0]?.bankBranch || '',
            accountType: applicantData.banking_details?.[0]?.accountType || '',

            // Property details
            propertyType: applicantData.properties?.[0]?.propertyType || '',
            property_address: applicantData.properties?.[0]?.property_address || '',
            propertyValue: applicantData.properties?.[0]?.propertyValue || '',
            propertyAge: applicantData.properties?.[0]?.propertyAge || '',
            propertyOwnership: applicantData.properties?.[0]?.propertyOwnership || '',

            // Map field names if they differ between API and form
            dateOfBirth: applicantData.date_of_birth || '',
            maritalStatus: applicantData.marital_status || '',
            postalCode: applicantData.postal_code || ''
        };

        navigate('/LoanApplicantEdit', {
            state: {
                isEdit: true,
                applicantId: applicantData.id, // For API calls if needed
                applicantData: transformedData
            }
        });
    };

    // Handle delete applicant with confirmation

        // Handle delete applicant with confirmation
        const handleDeleteApplicant = async (id) => {
            
            // Confirmation dialog
            if (window.confirm(`Are you sure you want to soft-delete applicant ID: ${id}? This can be restored later.`)) {
                try {
                    const token = sessionStorage.getItem("token"); // Get token
                    // --- CORRECTED URL ---
                    // Use the standard endpoint for DELETE request defined by your router for the ViewSet
                    const response = await axios.delete(`${API_URL}${id}/`, { // API_URL already includes /api/applicants/applicants/
                        headers: {
                            'Authorization': `Bearer ${token}` // Include Authorization header
                        }
                    });
                    // --- End CORRECTED URL ---
    
                    // Check response status code for success (usually 204 No Content for DELETE)
                    if (response.status === 204) {
                        toast.success('Applicant soft-deleted successfully'); // Use toast for consistency
                        fetchApplicantData(); // Refresh the table data
                    } else {
                        // This might not be hit if backend throws error, catch block handles errors
                        toast.error(response.data?.message || 'Failed to delete applicant.');
                    }
                } catch (error) {
                    console.error('Error deleting applicant:', error);
                    // Display error from backend if available, otherwise generic message
                    const errorMsg = error.response?.data?.message || error.response?.data?.detail || 'An error occurred while deleting.';
                    toast.error(`Delete failed: ${errorMsg}`);

                }
            }
        };

    // Function to export data as PDF
    const exportPDF = (data) => {
        const unit = "pt";
        const size = "A4";
        const orientation = "portrait";
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);
        const title = "Applicant Details";
        const headers = [["ID", "Name", "Phone", "Email", "Status"]];
        const pdfData = data.map((elt) => [
            elt.userID,
            `${elt.first_name} ${elt.last_name}`,
            elt.phone,
            elt.email,
            elt.is_approved ? "Approved" : "Pending"
        ]);

        doc.text(title, marginLeft, 40);
        doc.autoTable({
            startY: 50,
            head: headers,
            body: pdfData,
        });

        doc.save("Applicants.pdf");
    };

    const columns = React.useMemo(
        () => [
            { Header: "ID", accessor: "userID" },
            {
                Header: "Photo",
                accessor: "profile_photo",
                Cell: ({ row }) => (
                    <img
                        src={row.original.profile_photo}
                        alt="Applicant"
                        style={{ width: "50px", height: "40px" }}
                       
                    />
                ),
            },
            {
                Header: "Name",
                accessor: "first_name",
                Cell: ({ row }) => (
                    <span>{row.original.first_name} {row.original.last_name}</span>
                )
            },
            { Header: "Phone", accessor: "phone" },
            { Header: "Email", accessor: "email" },
            { Header: "Registration Date", accessor: "loanreg_date" },
            {
                Header: "Status",
                accessor: "is_approved",
                Cell: ({ row }) => (
                    <span className={`badge ${row.original.is_approved ? 'bg-success' : 'bg-warning'}`}>
                        {row.original.is_approved ? "Approved" : "Pending"}
                    </span>
                )
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <div>
                        <button
                            className="border-0 text-blue-300 me-2 bg-transparent"
                            onClick={() => handleEditApplicant(row.original)}
                            title="Edit"
                        >
                            <FeatherIcon icon="edit" />
                        </button>
                        <button
                            className="border-0 text-success me-2 bg-transparent"
                            onClick={() => handleViewApplicant(row.original)}
                            title="View applicant status"
                        >
                            <FeatherIcon icon="eye" />
                        </button>
                        <button
                            className="border-0 text-danger bg-transparent"
                            onClick={() => handleDeleteApplicant(row.original.id)}
                        >
                            <FeatherIcon icon="trash-2" />
                        </button>
                    </div>
                ),
            },
        ],
        [navigate]
    );

    // Meta title
    document.title = "Applicant Management | SPK Finance";

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col className="col-12">
                        <Card>
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Applicant Management</h4>
                                <Button color="primary" onClick={() => navigate('/loanform')}>
                                    <FeatherIcon icon="plus-circle" className="me-2" />New Applicant
                                </Button>
                            </CardHeader>
                            <CardBody>
                                {isLoading ? (
                                    <div className="text-center p-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                ) : (
                                    <Table
                                        columns={columns}
                                        data={tableData}
                                        exportPDF={exportPDF}
                                        onEdit={handleEditApplicant}
                                        onDelete={handleDeleteApplicant}
                                        onView={handleViewApplicant}
                                    />
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

ApplicantsTable.propTypes = {
    preGlobalFilteredRows: PropTypes.array,
};

export default ApplicantsTable;