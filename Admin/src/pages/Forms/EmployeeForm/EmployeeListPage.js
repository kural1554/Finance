import React, { useEffect, useState, useMemo } from "react";
import axios from "axios"; // Import axios
import PropTypes from "prop-types";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from "react-table";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row, Dropdown, DropdownToggle, DropdownMenu, Button } from "reactstrap";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FeatherIcon from "feather-icons-react";

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
    const [hiddenColumns, setHiddenColumns] = useState(["empfather_name", "gender", "address", "date_of_birth",]);

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
            initialState: { hiddenColumns },
        },
        useFilters,
        useGlobalFilter
    );

    useEffect(() => {
        setTableHiddenColumns(hiddenColumns);
    }, [hiddenColumns, setTableHiddenColumns]);

    const toggleColumnVisibility = (columnId) => {
        setHiddenColumns((prevHiddenColumns) =>
            prevHiddenColumns.includes(columnId)
                ? prevHiddenColumns.filter((id) => id !== columnId)
                : [...prevHiddenColumns, columnId]
        );
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
                    <CSVLink data={data} filename="Employees.csv" className="btn btn-secondary">
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
                                <div key={column.id} className="px-3 py-1" style={{ marginRight: "100px" }}>
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
function EmployeeListPage() {
    const API_URL = `${process.env.REACT_APP_API_BASE_URL}api/employees/`;
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchEmployeeData = async () => {
          try {
            const response = await axios.get(API_URL);
            console.log("Employee Data:", response.data);
            setTableData(response.data);
          } catch (error) {
            console.error("Error fetching employee data:", error);
          }
        };
    
        fetchEmployeeData();
      }, [API_URL]);
    const genderChoices = {
        1: "Male",
        2: "Female",
    };

    const employeeTypes = {
        1: "ADMIN",
        2: "MANAGER",
        3: "APPLICANT",
    };

    ;

    const exportPDF = async (data) => {
        const doc = new jsPDF();
        doc.setFontSize(15);
        const title = "Employee Details";
        const headers = [["ID", "Employee Photo", "Employee ID", "Employee Name", "Employee Position", "Phone No", "Email"]];

        // Convert Image URL to Base64
        const getBase64Image = async (url) => {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                console.error("Error loading image:", error);
                return null;
            }
        };

        // Process employee data and fetch images
        const tableData = await Promise.all(
            data.map(async (emp) => {
                const imgData = emp.employee_photo ? await getBase64Image(emp.employee_photo) : null;
                return {
                    rowData: [emp.id, "", emp.employeeID, emp.empfirst_name, employeeTypes[emp.emp_type] || "Unknown", emp.phone, emp.email],
                    imageData: imgData, // Store Base64 image separately
                    rowHeight: imgData ? 20 : 10, // Adjust row height dynamically
                };
            })
        );

        doc.text(title, 80, 20);

        doc.autoTable({
            startY: 30,
            head: headers,
            body: tableData.map((item) => item.rowData), // Use row data without images
            theme: "grid",
            styles: { fontSize: 10 },
            columnStyles: {
                1: { cellWidth: 25 }, // Adjust width for images
            },
            didDrawCell: (data) => {
                if (data.column.index === 1 && tableData[data.row.index].imageData) { // Employee Photo Column
                    const img = tableData[data.row.index].imageData;
                    const imgWidth = 15; // Image width
                    const imgHeight = 15; // Image height
                    const xPos = data.cell.x + 5; // Adjust X position
                    const yPos = data.cell.y + 2; // Adjust Y position

                    doc.addImage(img, "JPEG", xPos, yPos, imgWidth, imgHeight);
                }
            },
            didParseCell: (data) => {
                if (data.section === "body" && tableData[data.row.index].imageData) {
                    data.cell.styles.minCellHeight = 20; // Increase row height for image cells
                }
            },
        });

        doc.save("Employees.pdf");
    };
    const handleDelete = async (employeeID) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_BASE_URL}api/employees/${employeeID}/`);
                setTableData((prevData) => prevData.filter((emp) => emp.employeeID !== employeeID));
                alert("✅ Employee deleted successfully!");
            } catch (error) {
                console.error("❌ Error deleting employee:", error);
                alert("Failed to delete employee.");
            }
        }
    };
    const columns = useMemo(
        () => [
            { Header: "ID", accessor: "id" },
            { Header: "Employee ID", accessor: "employeeID" },
            {
                Header: "Employee Photo",
                accessor: "employee_photo",
                Cell: ({ row }) => (
                    <img src={row.original.employee_photo} alt="Employee" style={{ width: "50px", height: "40px" }} />
                ),
            },
            { Header: "Employee Name", accessor: "empfirst_name" },
            { Header: "Employee Position", accessor: "emp_type", Cell: ({ value }) => employeeTypes[value] || "Unknown", },

            { Header: "Phone No", accessor: "phone" },
            { Header: "Email", accessor: "email" },
            { Header: "Address", accessor: "address" },
            { Header: "Father's Name", accessor: "empfather_name" },
            { Header: "Gender", accessor: "gender", Cell: ({ value }) => employeeTypes[value] || "Unknown", },
            { Header: "Date of Birth", accessor: "date_of_birth" },

            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <div>
                        <button
                            className="border-0 text-success me-2 bg-transparent"
                            onClick={() => {
                                console.log("Navigating to:", `${row.original.employeeID}`);
                                navigate(`/employeeedit/${row.original.employeeID}`);
                            }}
                        >
                            <FeatherIcon icon="edit" />
                        </button>
                        <button className="border-0 text-danger bg-transparent"
                            onClick={() => handleDelete(row.original.employeeID)}>
                            <FeatherIcon icon="trash-2" />
                        </button>
                    </div>
                ),
            },
        ],
        [navigate]
    );

    document.title = "Loan Management | SPK Finance";
    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Employee Management</h4>
                                <Button color="primary" onClick={() => navigate('/employeeregform')}>
                                    <FeatherIcon icon="plus-circle" className="me-2" />Add New Employee
                                </Button>
                            </CardHeader>
                            <CardBody>
                                <Table columns={columns} data={tableData} exportPDF={exportPDF} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default EmployeeListPage;
