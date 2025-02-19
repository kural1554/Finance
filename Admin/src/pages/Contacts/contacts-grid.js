import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
  Nav,
  NavItem,
  NavLink,
  UncontrolledTooltip,
} from "reactstrap";
import { map } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Card
import CardContact from "./card-contact";

//redux
import { useSelector, useDispatch } from "react-redux";

import { getUsers as onGetUsers } from "../../store/contacts/actions";
import { createSelector } from "reselect";
import Pagination from "../../components/Common/Pagination";

const ContactsGrid = () => {

  //meta title
  document.title = "User Grid | Minia - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const contactgridData = createSelector(

    (state) => state.contacts,
    (state) => ({
      users: state.users,
    })
  );
  // Inside your component
  const { users } = useSelector(contactgridData);

  const [contact, setContact] = useState([])

    // pagination
    const [currentPage, setCurrentPage] = useState(1);

    const perPageData = 8;
    const indexOfLast = currentPage * perPageData;
    const indexOfFirst = indexOfLast - perPageData;
  
    const currentdata = useMemo(() => users?.slice(indexOfFirst, indexOfLast), [users, indexOfFirst, indexOfLast])
  
    // get data
    useEffect(() => {
      dispatch(onGetUsers())
    }, [dispatch]);
  
    useEffect(() => {
      setContact(currentdata)
    }, [currentdata])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="User Grid" />
          <Row className="align-items-center">
            <Col md={6}>
              <div className="mb-3">
                <h5 className="card-title">
                  Contact List{" "}
                  <span className="text-muted fw-normal ms-2">(834)</span>
                </h5>
              </div>
            </Col>

            <Col md={6}>
              <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                <div>
                  <Nav pills>
                    <NavItem>
                      <NavLink
                        href="/contacts-list"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        id="list"
                      >
                        <i className="bx bx-list-ul"></i>
                        <UncontrolledTooltip placement="top" target="list">
                          List
                        </UncontrolledTooltip>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="/contacts-grid"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        className="active"
                        id="Grid"
                      >
                        <i className="bx bx-grid-alt"></i>
                        <UncontrolledTooltip placement="top" target="Grid">
                          Grid
                        </UncontrolledTooltip>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
                <div>
                  <Link to="#" className="btn btn-light">
                    <i className="bx bx-plus me-1"></i> Add New
                  </Link>
                </div>

                <UncontrolledDropdown>
                  <DropdownToggle
                    className="btn btn-link text-muted py-1 font-size-16 shadow-none"
                    tag="a"
                  >
                    <i className="bx bx-dots-horizontal-rounded"></i>
                  </DropdownToggle>

                  <DropdownMenu className="dropdown-menu-end">
                    <li>
                      <DropdownItem to="#">Action</DropdownItem>
                    </li>
                    <li>
                      <DropdownItem to="#">Another action</DropdownItem>
                    </li>
                    <li>
                      <DropdownItem to="#">Something else here</DropdownItem>
                    </li>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </Col>
          </Row>
          <Row>
            {map(contact, (user, key) => (
              <CardContact user={user} key={"_user_" + key} />
            ))}
          </Row>
          <Pagination
            perPageData={perPageData}
            data={users}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            currentData={contact}
            className="align-items-center justify-content-between text-center text-sm-start mb-3" />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ContactsGrid;