import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import TableContainer from "../../../components/Common/TableContainer";

import {
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Input,
  FormFeedback,
  UncontrolledTooltip,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavLink,
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

import { Email, Tags, Projects, Img } from "./contactlistCol";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DeleteModal from "../../../components/Common/DeleteModal";

import {
  getUsers as onGetUsers,
  addNewUser as onAddNewUser,
  updateUser as onUpdateUser,
  deleteUser as onDeleteUser,
} from "../../../store/actions";

import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

const ContactsList = () => {
  document.title = "User List | Minia - React Admin & Dashboard Template";

  const dispatch = useDispatch();
  const [contact, setContact] = useState();
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (contact && contact.name) || "",
      designation: (contact && contact.designation) || "",
      tags: (contact && contact.tags) || "",
      email: (contact && contact.email) || "",
      projects: (contact && contact.projects) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Your Name"),
      designation: Yup.string().required("Please Enter Your Designation"),
      tags: Yup.array().required("Please Enter Tag"),
      email: Yup.string().required("Please Enter Your Email"),
      projects: Yup.number().required("Please Enter Your Project"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateUser = {
          id: contact.id,
          name: values.name,
          designation: values.designation,
          tags: values.tags,
          email: values.email,
          projects: values.projects,
        };

        // update user
        dispatch(onUpdateUser(updateUser));
        validation.resetForm();
        setIsEdit(false);
      } else {
        const newUser = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          name: values["name"],
          designation: values["designation"],
          email: values["email"],
          tags: values["tags"],
          projects: values["projects"],
        };
        // save new user
        dispatch(onAddNewUser(newUser));
        validation.resetForm();
      }
      toggle();
    },
  });

  const contactlistData = createSelector(

    (state) => state.contacts,
    (state) => ({
      users: state.users,
    })
  );
  // Inside your component
  const { users } = useSelector(contactlistData);

  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: () => {
          return <input type="checkbox" className="form-check-input" />;
        },
      },
      {
        Header: "Img",
        accessor: "img",
        width: "20%",
        filterable: false,
        disableFilters: true,
        disableFilters: true,
        Cell: (cellProps) => {
          return <Img {...cellProps} />;
        },
      },
      {
        Header: "Name",
        filterable: false,
        disableFilters: true,
        accessor: "name",
        Cell: (user) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {user.row.original.name}
              </Link>
            </h5>
            <p className="text-muted mb-0">{user.row.original.designation}</p>
          </>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: false,
        disableFilters: true,
        Cell: (cellProps) => {
          return <Email {...cellProps} />;
        },
      },
      {
        Header: "Tags",
        accessor: "tags",
        filterable: false,
        disableFilters: true,
        Cell: (cellProps) => {
          return <Tags {...cellProps} />;
        },
      },
      {
        Header: "Projects",
        accessor: "projects",
        filterable: false,
        disableFilters: true,
        width: "20%",
        Cell: (cellProps) => {
          return (
            <>
              <Projects {...cellProps} />{" "}
            </>
          );
        },
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => {
                    const userData = cellProps.row.original;
                    handleUserClick(userData);
                  }}
                ></i>
              </Link>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => {
                    const userData = cellProps.row.original;
                    onClickDelete(userData);
                  }}
                ></i>
              </Link>
            </div>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (users && !users.length) {
      dispatch(onGetUsers());
      setIsEdit(false);
    }
  }, [dispatch, users]);

  useEffect(() => {
    setContact(users);
    setIsEdit(false);
  }, [users]);

  useEffect(() => {
    if (!isEmpty(users) && !!isEdit) {
      setContact(users);
      setIsEdit(false);
    }
  }, [users]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleUserClick = (arg) => {
    const user = arg;

    setContact({
      id: user.id,
      name: user.name,
      designation: user.designation,
      email: user.email,
      tags: user.tags,
      projects: user.projects,
    });
    setIsEdit(true);

    toggle();
  };

  var node = useRef();
  const onPaginationPageChange = (page) => {
    if (
      node &&
      node.current &&
      node.current.props &&
      node.current.props.pagination &&
      node.current.props.pagination.options
    ) {
      node.current.props.pagination.options.onPageChange(page);
    }
  };

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (users) => {
    setContact(users);
    setDeleteModal(true);
  };

  const handleDeleteUser = () => {
    dispatch(onDeleteUser(contact.id));
    onPaginationPageChange(1);
    setDeleteModal(false);
  };

  const handleUserClicks = () => {
    setIsEdit(false);
    toggle();
  };

  const keyField = "id";

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUser}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="User List" />
          <Row>
            <Col lg="12">
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
                      <ul className="nav nav-pills">
                        <li className="nav-item">
                          <NavLink href="/contacts-list" data-bs-toggle="tooltip"  data-bs-placement="top" id="list">
                            <i className="bx bx-list-ul"></i>
                            <UncontrolledTooltip placement="top" target="list"> List</UncontrolledTooltip>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink className="active" href="/contacts-grid"  data-bs-toggle="tooltip" data-bs-placement="top" id="grid"  >
                            <i className="bx bx-grid-alt"></i>
                            <UncontrolledTooltip placement="top" target="grid">
                              Grid
                            </UncontrolledTooltip>
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <Link to="#" className="btn btn-light" onClick={handleUserClicks}>
                        <i className="bx bx-plus me-1"></i> Add New
                      </Link>
                    </div>

                    <UncontrolledDropdown>
                      <DropdownToggle className="btn btn-link text-muted py-1 font-size-16 shadow-none" tag="a" >
                        <i className="bx bx-dots-horizontal-rounded"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <li><DropdownItem to="#">Action</DropdownItem></li>
                        <li><DropdownItem to="#">Another action</DropdownItem></li>
                        <li><DropdownItem to="#">Something else here</DropdownItem></li>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col xl="12">
                  <TableContainer
                    columns={columns}
                    data={users}
                    isGlobalFilter={true}
                    isAddUserList={true}
                    customPageSize={10}
                    className="table align-middle datatable dt-responsive table-check nowrap"
                  />

                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!isEdit ? "Edit User" : "Add User"}
                    </ModalHeader>
                    <ModalBody>
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <Row>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label className="form-label">Name</Label>
                              <Input
                                name="name"
                                type="text"
                                placeholder="Insert Name"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.name || ""}
                                invalid={
                                  validation.touched.name &&
                                    validation.errors.name
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.name &&
                                validation.errors.name ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.name}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">
                                Designation
                              </Label>
                              <Input
                                name="designation"
                                label="Designation"
                                type="text"
                                placeholder="Insert Designation"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.designation || ""}
                                invalid={
                                  validation.touched.designation &&
                                    validation.errors.designation
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.designation &&
                                validation.errors.designation ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.designation}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Email</Label>
                              <Input
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="Insert Email"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                invalid={
                                  validation.touched.email &&
                                    validation.errors.email
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.email &&
                                validation.errors.email ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.email}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Option</Label>
                              <Input
                                type="select"
                                name="tags"
                                className="form-select"
                                placeholder="Insert Option"
                                multiple={true}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.tags || []}
                                invalid={
                                  validation.touched.tags &&
                                    validation.errors.tags
                                    ? true
                                    : false
                                }
                              >
                                <option>Photoshop</option>
                                <option>illustrator</option>
                                <option>Html</option>
                                <option>Php</option>
                                <option>Java</option>
                                <option>Python</option>
                                <option>UI/UX Designer</option>
                                <option>Ruby</option>
                                <option>Css</option>
                              </Input>
                              {validation.touched.tags &&
                                validation.errors.tags ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.tags}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Projects</Label>
                              <Input
                                name="projects"
                                label="Projects"
                                type="text"
                                placeholder="Insert Project"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.projects || ""}
                                invalid={
                                  validation.touched.projects &&
                                    validation.errors.projects
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.projects &&
                                validation.errors.projects ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.projects}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="text-end">
                              <button
                                type="submit"
                                className="btn btn-success save-user"
                              >
                                Save
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </ModalBody>
                  </Modal>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ContactsList;
