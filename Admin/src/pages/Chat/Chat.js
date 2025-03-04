import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from "react-table";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, CardHeader, Col, Container, Row, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FeatherIcon from "feather-icons-react";
import customer1 from "../../assets/images/customer/cr1.jpg";
import customer2 from "../../assets/images/customer/cr2.jpg";
import { Button } from "reactstrap";

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
function Table({ columns, data, exportPDF }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hiddenColumns, setHiddenColumns] = useState(["loanamount"]); // Track hidden columns

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const defaultColumn = useMemo(
        () => ({}), // Remove the Filter property
        []
    );

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
        setHiddenColumns: setTableHiddenColumns, // Destructure setHiddenColumns from useTable
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            initialState: {
                hiddenColumns, // Use the hiddenColumns state
            },
        },
        useFilters,
        useGlobalFilter
    );

    // Sync hiddenColumns state with the table's hidden columns
    useEffect(() => {
        setTableHiddenColumns(hiddenColumns);
    }, [hiddenColumns, setTableHiddenColumns]);

    // Function to toggle column visibility
    const toggleColumnVisibility = (columnId) => {
        setHiddenColumns((prevHiddenColumns) => {
            if (prevHiddenColumns.includes(columnId)) {
                // If the column is hidden, show it
                return prevHiddenColumns.filter((id) => id !== columnId);
            } else {
                // If the column is visible, hide it
                return [...prevHiddenColumns, columnId];
            }
        });
    };

    return (
        <React.Fragment>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
                {/* Left Side: Export Buttons */}
                <div className="d-flex gap-2 mb-2 mb-md-0">
                    <CopyToClipboard text={JSON.stringify(data)}>
                        <button type="button" className="btn btn-secondary">
                            <span>Copy</span>
                        </button>
                    </CopyToClipboard>
                    <CSVLink data={data} filename="DataTables.csv" className="btn btn-secondary">
                        <span>Excel</span>
                    </CSVLink>
                    <button onClick={() => exportPDF(data)} type="button" className="btn btn-secondary">
                        <span>PDF</span>
                    </button>
                </div>

                {/* Right Side: Search and Column Visibility */}
                <div className="d-flex gap-2 align-items-center">
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} >
                        <DropdownToggle caret color="primary">
                            <FeatherIcon icon="filter" />
                        </DropdownToggle>
                        <DropdownMenu >
                            {allColumns.map((column) => (
                                <div key={column.id} className="px-3 py-1">
                                    <label
                                        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent event propagation
                                            toggleColumnVisibility(column.id); // Toggle column visibility
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={!hiddenColumns.includes(column.id)} // Manually control the checked state
                                            onChange={(e) => {
                                                e.stopPropagation(); // Prevent event propagation
                                                toggleColumnVisibility(column.id); // Toggle column visibility
                                            }}
                                            role="checkbox"
                                            aria-checked={!hiddenColumns.includes(column.id)} // Indicates checked state
                                            tabIndex="0" // Make it keyboard accessible
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault(); // Prevent default action (e.g., scrolling)
                                                    toggleColumnVisibility(column.id); // Toggle column visibility
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

            {/* Table */}
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
                            prepareRow(row); // Ensure this is called
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
function DatatableTables() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setTableData(data);
    }, []);

    // Function to export data as PDF
    const exportPDF = (data) => {
        const unit = "pt";
        const size = "A4";
        const orientation = "portrait";
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);
        const title = "SPK | All Loan Detials";
        const headers = [["ID", "Loan ID", "Customer Name", "Phone No", "Balance Amount", "Action"]];
        const Dataa = data.map((elt) => [
            elt.id,
            elt.loanid,
            elt.customername,
            elt.phoneno,
            elt.balanceamount,
            
        ]);

        doc.text(title, marginLeft, 40);
        doc.autoTable({
            startY: 50,
            head: headers,
            body: Dataa,
        });

        doc.save("DataTables.pdf");
    };

    const columns = React.useMemo(
        () => [
            { Header: "ID", accessor: "id" },
            { Header: "Loan ID", accessor: "loanid" },
            {
                Header: "Customer Photo",
                accessor: "customerphoto",
                Cell: ({ row }) => (
                    <img src={row.original.customerphoto} alt="Customer" style={{ width: "50px", height: "40px" }} />
                ),
            },
            { Header: "Customer Name", accessor: "customername" },
            { Header: "Phone No", accessor: "phoneno" },
            { Header: "Loan Amount", accessor: "loanamount" },
            { Header: "Balance Amount", accessor: "balanceamount" },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <div>
                        <button className="border-0 text-blue-300 me-2 bg-transparent">
                            <FeatherIcon icon="edit" />
                        </button>
                        <button
                            className="border-0 text-success me-2 bg-transparent"
                            onClick={() => navigate('/status', { state: { rowData: row.original } })}
                        >
                            <FeatherIcon icon="eye" />
                        </button>
                        <button className="border-0 text-danger bg-transparent">
                            <FeatherIcon icon="trash-2" />
                        </button>
                    </div>
                ),
            },
        ],
        [navigate]
    );

    const data = [
        { id: 1, loanid: 10, customerphoto: customer1, customername: "ramar", phoneno: 987654321, loanamount: 40000, balanceamount: 15000 },
        { id: 2, loanid: 22, customerphoto: customer2, customername: "kumar", phoneno: 984654351, loanamount: 50000, balanceamount: 10000 },
    ];

    // Meta title
    document.title = "Loan Management | SPK Finance";
    return (
        <div className="page-content">
            <Container fluid>
               
                <Row>
                    <Col className="col-12">
                        <Card>
                        <CardHeader className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Loan Management</h4>
                                <Button color="primary" onClick={() => navigate('/new-loan')}>
                                <FeatherIcon icon="plus-circle" className="me-2" />New Loan</Button>
                            </CardHeader>
                            <CardBody>
                                <Table columns={columns} data={data} exportPDF={exportPDF} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

DatatableTables.propTypes = {
    preGlobalFilteredRows: PropTypes.array,
};

export default DatatableTables;