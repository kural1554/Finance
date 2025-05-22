import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from "react-table";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumbs from "../../components/Common/Breadcrumb"; // Assuming this exists
import { Card, CardBody, CardHeader, Col, Container, Row, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FeatherIcon from "feather-icons-react";
import { Button } from "reactstrap";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const API_URL = `${process.env.REACT_APP_API_BASE_URL}api/applicants/applicants/`;

// Global Filter Component 
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
    // ... (no changes here)
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

// Table Component (apdiye irukkattum)
function Table({ columns, data, exportPDF, onEdit, onDelete, onView }) {
    // ... (no changes here, or minor UI tweaks if needed)
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
function ApplicantListview() {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getToken = () => {
        // Assuming you store token in localStorage after login
        // If you use sessionStorage or context, adjust accordingly
        return localStorage.getItem("accessToken"); // Use the same key as in LoanApplicationForm
    };

    const fetchApplicantData = async () => {
        setIsLoading(true);
        const token = getToken();

        if (!token) {
            setError("Authentication token not found. Please login.");
            setIsLoading(false);
            toast.error("Please login to view applicants.");
            // Optionally redirect to login
            // navigate("/login"); 
            return;
        }

        try {
            const response = await axios.get(API_URL, {
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });
            setTableData(response.data || []); 
            setError(null);
        } catch (err) {
            console.error("Error fetching applicant data:", err);
            let errorMsg = "Failed to load applicant data. Please try again later.";
            if (err.response) {
                if (err.response.status === 401) {
                    errorMsg = "Unauthorized. Your session may have expired. Please login again.";
                    // Optionally handle token refresh or redirect to login
                } else if (err.response.data && err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                }
            }
            setError(errorMsg);
            toast.error(errorMsg);
            // Fallback data (Remove or use only for extreme debugging)
            // setTableData([{ /* ... sample data ... */ }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicantData();
    }, []); 

    const handleViewApplicant = (rowData) => {
        navigate(`/applicantstatus/${rowData.userID}`);
    };

    const handleEditApplicant = (applicantData) => {
        const transformedData = {
            ...applicantData,
            employmentType: applicantData.employment?.[0]?.employmentType || '',
            jobTitle: applicantData.employment?.[0]?.jobTitle || '',
            yearsWithEmployer: applicantData.employment?.[0]?.yearsWithEmployer || '',
            monthlyIncome: applicantData.employment?.[0]?.monthlyIncome || '',
            otherIncome: applicantData.employment?.[0]?.otherIncome || '',
            accountHolderName: applicantData.banking_details?.[0]?.accountHolderName || '',
            accountNumber: applicantData.banking_details?.[0]?.accountNumber || '',
            bankName: applicantData.banking_details?.[0]?.bankName || '',
            ifscCode: applicantData.banking_details?.[0]?.ifscCode || '',
            bankBranch: applicantData.banking_details?.[0]?.bankBranch || '',
            accountType: applicantData.banking_details?.[0]?.accountType || '',
            propertyType: applicantData.properties?.[0]?.propertyType || '',
            property_address: applicantData.properties?.[0]?.property_address || '',
            propertyValue: applicantData.properties?.[0]?.propertyValue || '',
            propertyAge: applicantData.properties?.[0]?.propertyAge || '',
            propertyOwnership: applicantData.properties?.[0]?.propertyOwnership || '',
            dateOfBirth: applicantData.date_of_birth || '',
            maritalStatus: applicantData.marital_status || '',
            postalCode: applicantData.postal_code || ''
        };
        navigate('/applicantEdit', {
            state: {
                isEdit: true,
                applicantId: applicantData.userID,
                applicantData: transformedData
            }
        });
    };

    const handleDeleteApplicant = async (applicantUserID) => {
        if (window.confirm(`Are you sure you want to soft-delete applicant ID: ${applicantUserID}? This can be restored later.`)) {
            const token = getToken(); // Use the consistent getToken function

            if (!token) {
                toast.error("Authentication token not found. Please login.");
                return;
            }

            try {
                // API_URL already ends with a slash, so just append the ID and another slash for DRF standard
                const response = await axios.delete(`${API_URL}${applicantUserID}/`, { 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (response.status === 204) {
                    toast.success('Applicant soft-deleted successfully');
                    fetchApplicantData(); // Refresh table
                } else {
                    toast.error(response.data?.message || 'Failed to delete applicant.');
                }
            } catch (error) {
                console.error('Error deleting applicant:', error);
                let errorMsg = 'An error occurred while deleting.';
                if (error.response) {
                     if (error.response.status === 401) {
                        errorMsg = "Unauthorized. Your session may have expired. Please login again.";
                    } else if (error.response.data) {
                        errorMsg = error.response.data.detail || error.response.data.message || errorMsg;
                    }
                }
                toast.error(`Delete failed: ${errorMsg}`);
            }
        }
    };

    const exportPDF = (data) => {
        // ... (PDF export logic apdiye irukkattum) ...
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
                accessor: "profile_photo", // Make sure backend sends this field and it's correct
                Cell: ({ row }) => (
                    <img
                        src={row.original.profile_photo || "https://via.placeholder.com/50x40?text=No+Image"} // Fallback image
                        alt="Applicant"
                        style={{ width: "50px", height: "40px", objectFit: "cover" }}
                        onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/50x40?text=Error"; }} // Handle broken image links
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
                    <div className="d-flex gap-2"> {/* Added gap for better spacing */}
                        <Button
                            color="primary"
                            size="sm" // Make buttons smaller
                            className="btn-icon" // For icon-only button style if you have CSS for it
                            onClick={() => handleEditApplicant(row.original)}
                            title="Edit"
                        >
                            <FeatherIcon icon="edit" size="16" /> {/* Adjust icon size */}
                        </Button>
                        <Button
                            color="info" // Changed to info for view
                            size="sm"
                            className="btn-icon"
                            onClick={() => handleViewApplicant(row.original)}
                            title="View applicant status"
                        >
                            <FeatherIcon icon="eye" size="16" />
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            className="btn-icon"
                            onClick={() => handleDeleteApplicant(row.original.userID)}
                            title="Delete" // Added title
                        >
                            <FeatherIcon icon="trash-2" size="16" />
                        </Button>
                    </div>
                ),
            },
        ],
        [navigate] // navigate dependency for handlers that use it
    );

    document.title = "Applicant Management | SPK Finance";

    return (
        <div className="page-content">
            <Container fluid>
                {/* Breadcrumbs can be added here if needed */}
                <Row>
                    <Col className="col-12">
                        <Card>
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Applicant Management</h4>
                                <Button color="success" onClick={() => navigate('/applicantform')}> {/* Changed color to success */}
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
                                        {error} {/* Display the error message */}
                                    </div>
                                ) : (
                                    <Table
                                        columns={columns}
                                        data={tableData}
                                        exportPDF={exportPDF}
                                        // Pass handlers to Table component if they are used inside it, otherwise keep here
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



export default ApplicantListview;