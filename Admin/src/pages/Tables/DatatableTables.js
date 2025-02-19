import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from "jspdf";
import "jspdf-autotable";

// Define a default UI for filtering
function GlobalFilter({
    //this line  [eslint] 'preGlobalFilteredRows' is missing in props validation [react/prop-types]
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        <span>
            Search:{' '}
            <input
                className="form-control"
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`${count} records...`}
            />
        </span>
    );
};

function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length;

    return (
        <input
            className="mt-2 form-control"
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined);
            }}
            placeholder={`Search ${count} records...`}
        />
    );
};

function Table({ columns, data }) {

    const defaultColumn = React.useMemo(
        () => ({
            // Default Filter UI
            Filter: DefaultColumnFilter,
        }),
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
        getToggleHideAllColumnsProps,
    } = useTable(
        {
            columns,
            data,
            defaultColumn
        },
        useFilters,
        useGlobalFilter,
    );

    // const IndeterminateCheckbox2 = React.forwardRef(
    //     ({ indeterminate, ...rest }, ref) => {
    //         const defaultRef = React.useRef();
    //         const resolvedRef = ref || defaultRef;

    //         React.useEffect(() => {
    //             resolvedRef.current.indeterminate = indeterminate;
    //         }, [resolvedRef, indeterminate]);

    //         return (
    //             <>
    //                 <input type="checkbox" ref={resolvedRef} {...rest} />
    //             </>
    //         );
    //     }
    // );

    return (
        <React.Fragment>
            <div className="d-flex gap-2">
                {/* <div>
                    <IndeterminateCheckbox2 {...getToggleHideAllColumnsProps()} /> Toggle
                    All
                </div> */}
                {allColumns.map((column) => (
                    <div key={column.id}>
                        <label>
                            <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
                            {column.id}
                        </label>
                    </div>
                ))}
                <br/>
            </div>
            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
            <table className="table" {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th key={column.id}>
                                    {column.render('Header')}
                                    {/* Render the columns filter UI */}
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr key={row.id} {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return <td key={cell.id} {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </React.Fragment>
    );
}

function DatatableTables() {
    const [copyData, setCopyData] = useState([])
    // const [copied, setCopied] = useState(false)

    const [tableData, setTableData] = useState([])

    useEffect(() => {
        setTableData(data)
    }, [])

    const exportPDF = () => {
        // setTableData(data)
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "DataTables | Minia - Minimal Admin & Dashboard Template";
        const headers = [["FirstName", "LastName", "Age", "Visits", "Progress", "Status"]];

        const Dataa = tableData.map(elt => [elt.firstName, elt.lastName, elt.age, elt.visits, elt.progress, elt.status]);

        let content = {
            startY: 50,
            head: headers,
            body: Dataa
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("DataTables Minia - Minimal Admin Dashboard Template.pdf.pdf")
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                columns: [
                    {
                        Header: 'First Name',
                        accessor: 'firstName',
                    },
                    {
                        Header: 'Last Name',
                        accessor: 'lastName'
                    },
                ],
            },
            {
                Header: 'Info',
                columns: [
                    {
                        Header: 'Age',
                        accessor: 'age'
                    },
                    {
                        Header: 'Visits',
                        accessor: 'visits'
                    },
                    {
                        Header: 'Status',
                        accessor: 'status'
                    },
                    {
                        Header: 'Profile Progress',
                        accessor: 'progress'
                    },
                ],
            },
        ],
        []
    );

    const data = [
        {
            "firstName": "horn-od926",
            "lastName": "selection-gsykp",
            "age": 22,
            "visits": 20,
            "progress": 39,
            "status": "single"
        },
        {
            "firstName": "heart-nff6w",
            "lastName": "information-nyp92",
            "age": 16,
            "visits": 98,
            "progress": 40,
            "status": "complicated"
        },
        {
            "firstName": "minute-yri12",
            "lastName": "fairies-iutct",
            "age": 7,
            "visits": 77,
            "progress": 39,
            "status": "single"
        },
        {
            "firstName": "degree-jx4h0",
            "lastName": "man-u2y40",
            "age": 27,
            "visits": 54,
            "progress": 92,
            "status": "relationship"
        },
        {
            "firstName": "horn-od926",
            "lastName": "selection-gsykp",
            "age": 22,
            "visits": 20,
            "progress": 39,
            "status": "single"
        },
        {
            "firstName": "heart-nff6w",
            "lastName": "information-nyp92",
            "age": 16,
            "visits": 98,
            "progress": 40,
            "status": "complicated"
        },
        {
            "firstName": "minute-yri12",
            "lastName": "fairies-iutct",
            "age": 7,
            "visits": 77,
            "progress": 39,
            "status": "single"
        },
        {
            "firstName": "degree-jx4h0",
            "lastName": "man-u2y40",
            "age": 27,
            "visits": 54,
            "progress": 92,
            "status": "relationship"
        },
        {
            "firstName": "horn-od926",
            "lastName": "selection-gsykp",
            "age": 22,
            "visits": 20,
            "progress": 39,
            "status": "single"
        },
        {
            "firstName": "heart-nff6w",
            "lastName": "information-nyp92",
            "age": 16,
            "visits": 98,
            "progress": 40,
            "status": "complicated"
        },
        {
            "firstName": "minute-yri12",
            "lastName": "fairies-iutct",
            "age": 7,
            "visits": 77,
            "progress": 39,
            "status": "single"
        },
        {
            "firstName": "degree-jx4h0",
            "lastName": "man-u2y40",
            "age": 27,
            "visits": 54,
            "progress": 92,
            "status": "relationship"
        }
    ];

    //meta title
    document.title = "Data Tables | Minia - React Admin & Dashboard Template";

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Tables" breadcrumbItem="Data Tables" />
                <Row>
                    <Col className="col-12">
                        <Card>
                            <CardHeader>
                                <h4 className="card-title">Default Datatable</h4>
                                <p className="card-title-desc">DataTables has most features enabled by
                                    default, so all you need to do to use it with your own tables is to call
                                    the construction function: <code>$().DataTable();</code>.
                                </p>
                            </CardHeader>
                            <CardBody>
                                <Table columns={columns} data={data} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col className="col-12">
                        <Card>
                            <CardHeader>
                                <h4 className="card-title">Buttons example</h4>
                                <p className="card-title-desc">The Buttons extension for DataTables
                                    provides a common set of options, API methods and styling to display
                                    buttons on a page that will interact with a DataTable. The core library
                                    provides the based framework upon which plug-ins can built.
                                </p>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col sl={12} md={6}>
                                        <div className="dt-buttons btn-group flex-wrap mb-2">
                                            <CopyToClipboard text={JSON.stringify(copyData)}
                                            >
                                                <button onClick={() => setCopyData(data)} type="button" className="btn btn-secondary buttons-copy buttons-html5">
                                                    <span>Copy</span>
                                                </button>
                                            </CopyToClipboard>

                                            <div className="dt-buttons btn-group flex-wrap">
                                                <CSVLink
                                                    data={data}
                                                    type="button"
                                                    // onClick={onCloseClick}
                                                    className="btn btn-secondary "
                                                    filename="DataTables Minia - Minimal Admin Dashboard Template.pdf.csv"
                                                // id="delete-record"
                                                >
                                                    <span>Excel</span>
                                                </CSVLink>
                                                <button onClick={() => exportPDF()} type="button" className="btn btn-secondary buttons-copy buttons-html5">
                                                    <span>Pdf</span>
                                                </button>
                                                {/* <button type="button" className="btn btn-secondary buttons-copy buttons-html5">
                                                    <span>Column visibility</span>
                                                </button> */}
                                            </div>
                                        </div>
                                        {/* <div className="section">
                                            {copyData.length ? <span style={{ color: 'red' }}>Copied.</span> : null}
                                        </div> */}
                                    </Col>
                                </Row>
                                <Table columns={columns} data={data} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
DatatableTables.propTypes = {
    preGlobalFilteredRows: PropTypes.any,

};

export default DatatableTables;