import React, { useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from "react-table";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
    Card, 
    CardBody, 
    CardHeader, 
    Col, 
    Container, 
    Row, 
    Dropdown, 
    DropdownToggle, 
    DropdownMenu, 
    Badge,
    Button, 
    Spinner,
    Alert
} from "reactstrap";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FeatherIcon from "feather-icons-react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}api/applicants/applicants/`;

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
GlobalFilter.propTypes = {
    preGlobalFilteredRows: PropTypes.array.isRequired,
    globalFilter: PropTypes.string,
    setGlobalFilter: PropTypes.func.isRequired,
};

function Table({ columns, data, exportPDF }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hiddenColumns, setHiddenColumns] = useState(['email', 'is_approved']); // Set email and profile status as hidden by default

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
                        <Button type="button" color="secondary" outline>
                            <FeatherIcon icon="copy" size="16" className="me-1" /> Copy
                        </Button>
                    </CopyToClipboard>
                    <CSVLink data={data} filename="Applicants.csv" className="btn btn-outline-secondary">
                         <FeatherIcon icon="file-text" size="16" className="me-1" /> Excel
                    </CSVLink>
                    <Button onClick={() => exportPDF(data)} type="button" color="secondary" outline>
                        <FeatherIcon icon="download" size="16" className="me-1" /> PDF
                    </Button>
                </div>

                <div className="d-flex gap-2 align-items-center">
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle caret color="primary" outline>
                            <FeatherIcon icon="columns" size="16" className="me-1"/> Columns
                        </DropdownToggle>
                        <DropdownMenu end>
                            {allColumns.map((column) => (
                                !['action'].includes(column.id) &&
                                <div key={column.id} className="px-3 py-1">
                                    <label
                                        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleColumnVisibility(column.id);
                                        }}
                                        className="form-check-label"
                                    >
                                        <input
                                            type="checkbox"
                                            className="form-check-input me-2"
                                            checked={!hiddenColumns.includes(column.id)}
                                            onChange={() => {}}
                                            role="checkbox"
                                            aria-checked={!hiddenColumns.includes(column.id)}
                                            readOnly
                                        />
                                        {typeof column.Header === 'string' ? column.Header : column.id}
                                    </label>
                                </div>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover table-striped table-bordered" {...getTableProps()}>
                    <thead className="table-light">
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
Table.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    exportPDF: PropTypes.func.isRequired,
};

const getLoanStatusBadgeColor = (status) => {
    if (!status) return "secondary";
    const upperStatus = status.toUpperCase();
    if (upperStatus.includes("REJECTED")) return "danger";
    if (upperStatus.includes("APPROVED (FINAL)")) return "success";
    if (upperStatus.includes("MANAGER APPROVED")) return "info";
    if (upperStatus.includes("ACTIVE")) return "success";
    if (upperStatus.includes("PENDING")) return "warning";
    if (upperStatus.includes("NO LOAN")) return "light";
    return "secondary"; 
};

function ApplicantListview() {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getToken = useCallback(() => {
        return localStorage.getItem("accessToken");
    }, []);

    const fetchApplicantData = useCallback(async () => {
        setIsLoading(true);
        const token = getToken();

        if (!token) {
            setError("Authentication token not found. Please login.");
            setIsLoading(false);
            toast.error("Please login to view applicants.");
            return;
        }

        try {
            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = response.data.results || response.data || [];
            setTableData(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching applicant data:", err);
            let errorMsg = "Failed to load applicant data. Please try again later.";
            if (err.response) {
                if (err.response.status === 401) {
                    errorMsg = "Unauthorized. Your session may have expired. Please login again.";
                } else if (err.response.data && err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                }
            }
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        fetchApplicantData();
    }, [fetchApplicantData]);

    const handleViewApplicant = useCallback((rowData) => {
        navigate(`/applicantstatus/${rowData.userID}`);
    }, [navigate]);

    const handleEditApplicant = useCallback((applicantData) => {
        const transformedData = {
            ...applicantData,
            employmentType: applicantData.employment?.[0]?.employmentType || '',
            jobTitle: applicantData.employment?.[0]?.jobTitle || '',
        };
        navigate('/applicantEdit', {
            state: {
                isEdit: true,
                applicantId: applicantData.userID,
                applicantData: transformedData
            }
        });
    }, [navigate]);

    const handleDeleteApplicant = useCallback(async (applicantUserID) => {
        if (window.confirm(`Are you sure you want to soft-delete applicant ID: ${applicantUserID}? This can be restored later.`)) {
            const token = getToken();
            if (!token) {
                toast.error("Authentication token not found. Please login.");
                return;
            }
            try {
                const response = await axios.delete(`${API_URL}${applicantUserID}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 204) {
                    toast.success('Applicant soft-deleted successfully');
                    fetchApplicantData();
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
    }, [getToken, fetchApplicantData]);

    const exportPDF = useCallback((dataToExport) => {
        const unit = "pt";
        const size = "A4";
        const orientation = "portrait";
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);
        const title = "Applicant Details";
        const headers = [["ID", "Name", "Phone", "Email", "Latest Loan ID", "Latest Loan Status"]];
        const pdfData = dataToExport.map((elt) => [
            elt.userID,
            `${elt.first_name} ${elt.last_name}`,
            elt.phone,
            elt.email,
            elt.is_approved ? "Approved" : "Pending",
            elt.latest_loan_id || "N/A",
            elt.latest_loan_status || "N/A"
        ]);

        doc.text(title, marginLeft, 40);
        doc.autoTable({
            startY: 50,
            head: headers,
            body: pdfData,
        });
        doc.save("Applicants.pdf");
    }, []);

    const columns = useMemo(
        () => [
            { Header: "Applicant ID", accessor: "userID" },
            {
                Header: "Photo",
                accessor: "profile_photo",
                Cell: ({ row }) => (
                    <img
                        src={row.original.profile_photo || "https://via.placeholder.com/50x40?text=No+Image"}
                        alt="Applicant"
                        style={{ width: "50px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50x40?text=Error"; }}
                    />
                ),
            },
            {
                Header: "Name",
                accessor: (row) => `${row.first_name} ${row.last_name}`,
                id: 'fullName',
                Cell: ({ row }) => (
                    <span>{row.original.first_name} {row.original.last_name}</span>
                )
            },
            { Header: "Phone", accessor: "phone" },
            { 
                Header: "Email", 
                accessor: "email",
                Cell: ({ value }) => (
                    <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }} title={value}>
                        {value}
                    </span>
                )
            },
            { 
                Header: "Reg. Date", 
                accessor: "loanreg_date", 
                Cell: ({value}) => value ? new Date(value).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'}) : 'N/A' 
            },
            {
                Header: "Profile Status",
                accessor: "is_approved",
                Cell: ({ row }) => (
                    <Badge color={row.original.is_approved ? 'success' : 'warning'} pill>
                        {row.original.is_approved ? "Approved" : "Pending"}
                    </Badge>
                )
            },
            {
                Header: "Latest Loan Status",
                accessor: "latest_loan_status",
                Cell: ({ value }) => {
                     const statusText = value || "No Loan";
                     const badgeColor = getLoanStatusBadgeColor(statusText);
                     return (
                         <Badge color={badgeColor} pill className={badgeColor === 'warning' || badgeColor === 'light' ? 'text-dark' : ''}>
                            {statusText}
                         </Badge>
                     );
                }
            },
            {
                Header: "Action",
                id: "action_column",
                disableFilters: true,
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className="d-flex gap-2">
                        <Button
                            color="primary"
                            size="sm"
                            outline
                            onClick={() => handleEditApplicant(row.original)}
                            title="Edit Applicant Profile"
                        >
                            <FeatherIcon icon="edit-2" size="16" />
                        </Button>
                        <Button
                            color="info"
                            size="sm"
                            outline
                            onClick={() => handleViewApplicant(row.original)}
                            title="View Applicant & Loan Status"
                        >
                            <FeatherIcon icon="eye" size="16" />
                        </Button>
                        {!row.original.is_deleted && (
                         <Button
                             color="danger"
                             size="sm"
                             outline
                             onClick={() => handleDeleteApplicant(row.original.userID)}
                             title="Soft-Delete Applicant"
                         >
                             <FeatherIcon icon="trash-2" size="16" />
                         </Button>
                        )}
                    </div>
                ),
            },
        ],
        [handleEditApplicant, handleViewApplicant, handleDeleteApplicant]
    );

    useEffect(() => {
        document.title = "Applicant Management | SPK Finance";
    }, []);

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col className="col-12">
                        <Card>
                            <CardHeader className="d-flex justify-content-between align-items-center bg-light py-3">
                                <h4 className="mb-0 card-title">Applicant Management</h4>
                                <Button color="success" onClick={() => navigate('/applicantform')}>
                                    <FeatherIcon icon="user-plus" className="me-1" />New Applicant
                                </Button>
                            </CardHeader>
                            <CardBody>
                                {isLoading ? (
                                    <div className="text-center p-5">
                                        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
                                        <p className="mt-2 mb-0">Loading Applicants...</p>
                                    </div>
                                ) : error ? (
                                    <Alert color="danger" className="text-center">
                                        <strong>Error:</strong> {error}
                                    </Alert>
                                ) : (
                                    <Table
                                        columns={columns}
                                        data={tableData}
                                        exportPDF={exportPDF}
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