import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  get as apiGet,
  del as apiDel,
  post as apiPost,
} from "../../helpers/api_helper";
import PropTypes from "prop-types";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Spinner,
  Button,
} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import { toast } from "react-toastify";

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
GlobalFilter.propTypes = {
    preGlobalFilteredRows: PropTypes.array.isRequired,
    globalFilter: PropTypes.string,
    setGlobalFilter: PropTypes.func.isRequired,
};


// Table Component
function TableComponent({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    { columns, data, defaultColumn: useMemo(() => ({}), []) },
    useFilters,
    useGlobalFilter
  );

  return (
    <React.Fragment>
      <Row className="mb-3">
        <Col md={3} className="ms-md-auto">
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </Col>
      </Row>
      <div className="table-responsive">
        <table
          className="table table-hover table-striped table-bordered align-middle"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.getHeaderProps().key} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              const rowKey = row.original.id !== undefined ? row.original.id : row.getRowProps().key;
              return (
                <tr key={rowKey} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td key={cell.getCellProps().key} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}
TableComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};


// Main Component - EmployeeListPage
function EmployeeListPage() {
  const API_LIST_PROFILES_URL = `api/employees/manage-profiles/`;
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchEmployeeProfiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = showDeleted
        ? `${API_LIST_PROFILES_URL}?include_deleted=true`
        : API_LIST_PROFILES_URL;
      const responseData = await apiGet(url);
      setTableData(responseData || []);
    } catch (err) {
      console.error("Error fetching employee profiles:", err);
      setError("Failed to load employee profiles.");
      toast.error(
        err.response?.data?.detail || err.message || "Failed to load data."
      );
    } finally {
      setIsLoading(false);
    }
  }, [showDeleted, API_LIST_PROFILES_URL]);

  useEffect(() => {
    fetchEmployeeProfiles();
  }, [fetchEmployeeProfiles]);

  const handleSoftDeleteEmployee = useCallback(async (profileId, employeeName) => {
    if (window.confirm(`Are you sure you want to deactivate employee: ${employeeName} (Profile ID: ${profileId})? This will set a leaving date.`)) {
      try {
        setIsLoading(true);
        await apiDel(`${API_LIST_PROFILES_URL}${profileId}/`);
        toast.success(`Employee ${employeeName} deactivated successfully!`);
        fetchEmployeeProfiles();
      } catch (err) {
        toast.error(err.response?.data?.detail || `Failed to deactivate ${employeeName}.`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [fetchEmployeeProfiles, API_LIST_PROFILES_URL]);

    const handleRestoreEmployee = useCallback(async (profileId, employeeName) => {
    if (window.confirm(`Are you sure you want to restore employee: ${employeeName} (Profile ID: ${profileId})? This will clear their leaving date.`)) {
      try {
        setIsLoading(true);
        await apiPost(`${API_LIST_PROFILES_URL}${profileId}/restore-profile/`, {}); // Correctly POSTs
        toast.success(`Employee ${employeeName} restored successfully!`);
        fetchEmployeeProfiles(); // Refreshes the list
      } catch (err) {
        toast.error(err.response?.data?.detail || `Failed to restore ${employeeName}.`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [fetchEmployeeProfiles, API_LIST_PROFILES_URL]);

  const handleEdit = useCallback((employeeData) => {
    if (!employeeData || employeeData.id === undefined || employeeData.id === null) {
      console.error('EDIT_DEBUG: Invalid employee data or missing EmployeeDetails PK (id)', employeeData);
      toast.error('Invalid employee data for editing.');
      return;
    }
    const employeeDetailsPk = employeeData.id;
    const editPath = `/employee/edit/${employeeDetailsPk}`;
    try {
      navigate(editPath, { state: { isEdit: true, employeeData: employeeData } });
    } catch (err) {
      console.error('EDIT_DEBUG: Error occurred during navigation dispatch:', err);
      toast.error('Failed to initiate navigation to edit page.');
    }
  }, [navigate]);

  const handleViewDetails = useCallback((employeeData) => {
    if (!employeeData || employeeData.id === undefined || employeeData.id === null) {
      console.error('VIEW_DEBUG: Invalid employee data or missing EmployeeDetails PK (id)', employeeData);
      toast.error('Cannot view details for invalid employee data.');
      return;
    }
    const employeeDetailsPk = employeeData.id;
    const viewPath = `/employee/details/${employeeDetailsPk}`;
    navigate(viewPath, { state: { employeeData: employeeData } });
  }, [navigate]);


  const columns = useMemo(
    () => [
      { Header: "S.No", id: "sno", Cell: ({ row }) => row.index + 1, disableFilters: true, },
      { Header: "Emp. ID", accessor: "employee_id" },
      {
        Header: "Photo",
        accessor: "employee_photo",
        Cell: ({ value }) =>
          value ? (
            <img
              src={value}
              alt="Profile"
              style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#e9ecef", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FeatherIcon icon="user" size="18" />
            </div>
          ),
      },
      {
        Header: "Name",
        Cell: ({ row }) => `${row.original.first_name || ""} ${row.original.last_name || ""}`.trim() || row.original.username || 'N/A',
      },
      { Header: "Role", accessor: "role" },
      { Header: "Email", accessor: "email" },
      {
        Header: "Joined",
        accessor: "joining_date",
        Cell: ({ value }) => value ? new Date(value).toLocaleDateString('en-IN') : 'N/A', // Specify locale for date
      },
      {
        Header: "Status",
        accessor: "is_active",
        Cell: ({ row }) => {
            const employeeData = row.original; // Use consistent variable name
            const isActive = employeeData.is_active;
            const isDeleted = employeeData.is_deleted;
            const hasLeavingDate = !!employeeData.leaving_date;
            let statusText = "Unknown";
            let badgeClass = "bg-light text-dark border";

            if (isActive && !isDeleted && !hasLeavingDate) {
                statusText = "Active";
                badgeClass = "bg-success-subtle text-success";
            } else if (hasLeavingDate || isDeleted) {
                statusText = "Inactive";
                badgeClass = "bg-danger-subtle text-danger";
            } else if (!isActive && !isDeleted && !hasLeavingDate) {
                statusText = "Disabled";
                badgeClass = "bg-warning-subtle text-warning";
            }
            return ( <span className={`badge ${badgeClass}`}> {statusText} </span> );
        }
      },
      {
        Header: "Actions",
        id: 'actions',
        Cell: ({ row }) => {
          const currentEmployeeData = row.original; // Use this variable for the current row's data

          const fullName = `${currentEmployeeData.first_name || ""} ${currentEmployeeData.last_name || ""}`.trim() || currentEmployeeData.username;
          const isEffectivelyInactive = currentEmployeeData.is_deleted || !!currentEmployeeData.leaving_date;
          
          return (
            <div className="d-flex gap-1 btn-group-sm">
              <Button
                color="light"
                size="sm"
                onClick={() => {
                  console.log("View Details Button Clicked. Data:", currentEmployeeData);
                  handleViewDetails(currentEmployeeData); // CORRECTED: Use currentEmployeeData
                }}
                title={`View details for ${fullName}`}
                className="btn-icon"
              >
                <FeatherIcon icon="eye" size="14" />
              </Button>

              <Button
                color="info"
                outline
                size="sm"
                onClick={() => {
                  console.log("Edit Button Clicked. Data:", currentEmployeeData);
                  handleEdit(currentEmployeeData); // CORRECTED: Use currentEmployeeData
                }}
                title={`Edit ${fullName}`}
                className="btn-icon"
              >
                <FeatherIcon icon="edit-2" size="14" />
              </Button>

              {isEffectivelyInactive ? (
                <Button
                  color="success"
                  outline
                  size="sm"
                  onClick={() => {
                    console.log("Restore Button Clicked. ID:", currentEmployeeData.id, "Name:", fullName);
                    handleRestoreEmployee(currentEmployeeData.id, fullName); // Correct
                  }}
                  title={`Restore ${fullName}`}
                  className="btn-icon"
                >
                  <FeatherIcon icon="rotate-ccw" size="14" />
                </Button>
              ) : (
                <Button
                  color="danger"
                  outline
                  size="sm"
                  onClick={() => {
                    console.log("Deactivate Button Clicked. ID:", currentEmployeeData.id, "Name:", fullName);
                    handleSoftDeleteEmployee(currentEmployeeData.id, fullName); // Correct
                  }}
                  title={`Deactivate ${fullName}`}
                  className="btn-icon"
                >
                  <FeatherIcon icon="user-x" size="14" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [handleEdit, handleSoftDeleteEmployee, handleRestoreEmployee, handleViewDetails] // Ensured handleViewDetails is here
  );

  document.title = "Employee List | SPK Finance";

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0 card-title">Employee List</h4>
                <div className="d-flex gap-2">
                  {/* <Button
                    color="soft-info"
                    outline
                    size="sm"
                    onClick={() => setShowDeleted(!showDeleted)}
                  >
                    <FeatherIcon icon={showDeleted ? "eye-off" : "eye"} size="14" className="me-1" />
                    {showDeleted ? "Hide Inactive" : "Show All"}
                  </Button> */}
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => navigate("/employeeregform")}
                  >
                    <FeatherIcon icon="user-plus" className="me-1" />
                    Add Employee
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <div className="text-center p-5">
                    <Spinner color="primary" style={{width: '3rem', height: '3rem'}} />
                    <p className="mt-2">Loading Employees...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger text-center" role="alert">
                    <h5>Error Loading Data</h5>
                    <p>{error}</p>
                    <Button color="primary" onClick={fetchEmployeeProfiles}>Try Again</Button>
                  </div>
                ) : (
                  <TableComponent
                    columns={columns}
                    data={tableData}
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

// EmployeeListPage.propTypes = {}; // Can be removed if not using props directly

export default EmployeeListPage;