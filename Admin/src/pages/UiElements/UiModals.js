import React, { useState } from "react";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Modal,
  Container,
  CardHeader,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiModal = () => {
  const [modal_standard, setmodal_standard] = useState(false);
  const [modal_large, setmodal_large] = useState(false);
  const [modal_xlarge, setmodal_xlarge] = useState(false);
  const [modal_small, setmodal_small] = useState(false);
  const [modal_center, setmodal_center] = useState(false);
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [modal_longscroll, setmodal_longscroll] = useState(false);

  const [modal_fullscreen, setmodal_fullscreen] = useState(false);
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [modal_between_modal, setmodal_between_modal] = useState(false)
  const [modal_between_secondmodal, setmodal_between_secondmodal] = useState(false)
  const [modal_varyingmodal, setmodal_varyingmodal] = useState(false)
  const [varyingtitle, setvaryingtitle] = useState("@mdo")

  function tog_standard() {
    setmodal_standard(!modal_standard);
    removeBodyCss();
  }

  function tog_fullscreen() {
    setmodal_fullscreen(!modal_fullscreen);
    removeBodyCss();
  }

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
    removeBodyCss();
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_large() {
    setmodal_large(!modal_large);
    removeBodyCss();
  }

  function tog_xlarge() {
    setmodal_xlarge(!modal_xlarge);
    removeBodyCss();
  }

  function tog_small() {
    setmodal_small(!modal_small);
    removeBodyCss();
  }

  function tog_center() {
    setmodal_center(!modal_center);
    removeBodyCss();
  }

  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  }

  function tog_longscroll() {
    setmodal_longscroll(!modal_longscroll);
    removeBodyCss();
  }

  function tog_between_modal() {
    setmodal_between_modal(!modal_between_modal)
    removeBodyCss()
  }

  function tog_between_secondmodal() {
    setmodal_between_secondmodal(!modal_between_secondmodal)
    removeBodyCss()
  }

  function tog_varyingmodal(title) {
    setvaryingtitle(title)
    setmodal_varyingmodal(!modal_varyingmodal)
    removeBodyCss()
  }

  //meta title
  document.title = "Modals | Minia - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Components" breadcrumbItem="Modals" />

          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  <CardTitle className="h4">Modals Examples</CardTitle>
                  <p className="card-title-desc">
                    Modals are streamlined, but flexible dialog prompts powered
                    by JavaScript. They support a number of use cases from user
                    notification to completely custom content and feature a
                    handful of helpful subcomponents, sizes, and more.
                  </p>
                </CardHeader>
                <CardBody>
                  <div
                    className="modal bs-example-modal"
                    tabIndex={-1}
                    role="dialog"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Modal title</h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <p>One fine body&hellip;</p>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-primary">
                            Save changes
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <CardTitle className="h4">Default Modal</CardTitle>
                  <p className="card-title-desc">
                    Toggle a working modal demo by clicking the button below. It
                    will slide down and fade in from the top of the page.
                  </p>
                </CardHeader>
                <CardBody>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        tog_standard();
                      }}
                      className="btn btn-primary "
                      data-toggle="modal"
                      data-target="#myModal"
                    >
                      Standard Modal
                    </button>

                    <Modal
                      isOpen={modal_standard}
                      toggle={() => {
                        tog_standard();
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myModalLabel">
                          Modal Heading
                        </h5>
                        <button
                          type="button"
                          onClick={() => {
                            setmodal_standard(false);
                          }}
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <h5>Overflowing text to show scroll behavior</h5>
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p>
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p>
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          onClick={() => {
                            tog_standard();
                          }}
                          className="btn btn-secondary "
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="button" className="btn btn-primary ">
                          Save changes
                        </button>
                      </div>
                    </Modal>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader>
                  <CardTitle className="h4">Fullscreen Modal</CardTitle>
                  <p className="card-title-desc">
                    Another override is the option to pop up a modal that covers
                    the user viewport, available via modifier classes that are
                    placed a <code>.modal-fullscreen</code>.
                  </p>
                </CardHeader>
                <CardBody>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        tog_fullscreen();
                      }}
                      className="btn btn-primary "
                      data-toggle="modal"
                    >
                      Fullscreen Modal
                    </button>
                    <Modal
                      size="xl"
                      isOpen={modal_fullscreen}
                      toggle={() => {
                        tog_fullscreen();
                      }}
                      className="modal-fullscreen"
                    >
                      <div className="modal-header">
                        <h5
                          className="modal-title mt-0"
                          id="exampleModalFullscreenLabel"
                        >
                          Fullscreen Modal
                        </h5>
                        <button
                          onClick={() => {
                            setmodal_fullscreen(false);
                          }}
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <h5>Overflowing text to show scroll behavior</h5>
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p>
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p>
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          onClick={() => {
                            tog_fullscreen();
                          }}
                          className="btn btn-secondary "
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="button" className="btn btn-primary ">
                          Save changes
                        </button>
                      </div>
                    </Modal>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <CardTitle className="h4">Optional Sizes</CardTitle>
                  <p className="card-title-desc">
                    Modals have three optional sizes, available via modifier
                    classes to be placed on a <code>.modal-dialog</code>.
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        tog_xlarge();
                      }}
                      className="btn btn-primary "
                      data-toggle="modal"
                      data-target=".bs-example-modal-xl"
                    >
                      Extra large modal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        tog_large();
                      }}
                      className="btn btn-light "
                      data-toggle="modal"
                      data-target=".bs-example-modal-lg"
                    >
                      Large modal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        tog_small();
                      }}
                      className="btn btn-success "
                      data-toggle="modal"
                      data-target=".bs-example-modal-sm"
                    >
                      Small modal
                    </button>
                  </div>

                  <div>
                    <Modal
                      size="xl"
                      isOpen={modal_xlarge}
                      toggle={() => {
                        tog_xlarge();
                      }}
                    >
                      <div className="modal-header">
                        <h5
                          className="modal-title mt-0"
                          id="myExtraLargeModalLabel"
                        >
                          Extra large modal
                        </h5>
                        <button
                          onClick={() => {
                            setmodal_xlarge(false);
                          }}
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p className="mb-0">
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                      </div>
                    </Modal>
                    <Modal
                      size="lg"
                      isOpen={modal_large}
                      toggle={() => {
                        tog_large();
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myLargeModalLabel">
                          Large Modal
                        </h5>
                        <button
                          onClick={() => {
                            setmodal_large(false);
                          }}
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p className="mb-0">
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                      </div>
                    </Modal>
                    <Modal
                      size="sm"
                      isOpen={modal_small}
                      toggle={() => {
                        tog_small();
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0" id="mySmallModalLabel">
                          Small Modal
                        </h5>
                        <button
                          onClick={() => {
                            setmodal_small(false);
                          }}
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p className="mb-0">
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                      </div>
                    </Modal>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader>
                  <CardTitle className="h5">Vertically Centered</CardTitle>
                  <p className="card-title-desc">
                    Add <code>.modal-dialog-centered</code> to{" "}
                    <code>.modal-dialog</code> to vertically center the modal.
                  </p>
                </CardHeader>
                <CardBody>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary "
                      onClick={() => {
                        tog_center();
                      }}
                      data-toggle="modal"
                      data-target=".bs-example-modal-center"
                    >
                      Center modal
                    </button>
                    <Modal
                      isOpen={modal_center}
                      toggle={() => {
                        tog_center();
                      }}
                      centered={true}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0">Center Modal</h5>
                        <button
                          type="button"
                          onClick={() => {
                            setmodal_center(false);
                          }}
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p className="mb-0">
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                      </div>
                    </Modal>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader>
                  <CardTitle className="h5">Scrollable modal</CardTitle>
                  <p className="card-title-desc">
                    Scrolling long content modal and You can also create a scrollable modal that allows scroll the modal body by adding
                    <code>.modal-dialog-scrollable</code> to
                    <code>.modal-dialog</code>.
                  </p>

                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-3">
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          tog_longscroll();
                        }}
                      >
                        Long Scrollable Modal
                      </button>
                      <Modal
                        id="exampleModalLongScrollable"
                        isOpen={modal_longscroll}
                        toggle={() => {
                          tog_longscroll();
                        }}
                      >
                        <div className="modal-header">
                          <h5 className="modal-title mt-0">Scrollable modal</h5>
                          <button
                            type="button"
                            onClick={() => setmodal_longscroll(false)}
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setmodal_longscroll(false)}
                            >
                              Close
                            </button>
                            <button type="button" className="btn btn-primary">
                              Save changes
                            </button>
                          </div>
                        </div>
                      </Modal>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          tog_scroll();
                        }}
                        data-toggle="modal"
                      >
                        Scrollable modal
                      </button>
                      <Modal
                        isOpen={modal_scroll}
                        toggle={() => {
                          tog_scroll();
                        }}
                        scrollable={true}
                      >
                        <div className="modal-header">
                          <h5 className="modal-title mt-0">Scrollable modal</h5>
                          <button
                            type="button"
                            onClick={() => setmodal_scroll(false)}
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras
                            justo odio, dapibus ac facilisis in, egestas eget
                            quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </p>
                          <p>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </p>
                          <p>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec ullamcorper
                            nulla non metus auctor fringilla.
                          </p>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setmodal_scroll(false)}
                            >
                              Close
                            </button>
                            <button type="button" className="btn btn-primary">
                              Save changes
                            </button>
                          </div>
                        </div>
                      </Modal>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h5 className="card-title">Static Backdrop</h5>
                  <p className="card-title-desc">
                    When backdrop is set to static, the modal will not close
                    when clicking outside it. Click the button below to try it.
                  </p>
                </CardHeader>
                <CardBody>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary "
                      onClick={() => {
                        tog_backdrop();
                      }}
                      data-toggle="modal"
                    >
                      Static backdrop modal
                    </button>
                    <Modal
                      isOpen={modal_backdrop}
                      toggle={() => {
                        tog_backdrop();
                      }}
                      backdrop={"static"}
                      id="staticBackdrop"
                    >
                      <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                          Modal title
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => {
                            setmodal_backdrop(false);
                          }}
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <p>
                          I will not close if you click outside me. Don't even
                          try to press escape key.
                        </p>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => {
                            setmodal_backdrop(false);
                          }}
                        >
                          Close
                        </button>
                        <button type="button" className="btn btn-primary">
                          Understood
                        </button>
                      </div>
                    </Modal>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Varying Modal Content</h4>
                  <p className="card-title-desc">Use <code>event.relatedTarget</code> and HTML <code>data-bs-target</code> attributes to vary the contents of the modal depending on which button was clicked.</p>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="d-flex flex-wrap gap-3">
                      <button type="button" className="btn btn-primary" onClick={() => {
                        tog_varyingmodal('@mdo')
                      }}>Open modal for @mdo</button>
                      <button type="button" className="btn btn-primary" onClick={() => {
                        tog_varyingmodal('@fat')
                      }}>Open modal for @fat</button>
                      <button type="button" className="btn btn-primary" onClick={() => {
                        tog_varyingmodal('@getbootstrap')
                      }}>Open modal for @getbootstrap</button>
                    </div>

                    <Modal
                      isOpen={modal_varyingmodal}
                      toggle={() => {
                        tog_varyingmodal('@mdo')
                      }}
                      scrollable={true}
                      id="staticBackdrop"
                    >
                      <div className="modal-header">
                        <h5 className="modal-title">New message to {varyingtitle}</h5>
                        <button type="button" className="btn-close"
                          onClick={() => {
                            setmodal_varyingmodal(false)
                          }} aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="mb-3">
                            <label htmlFor="recipient-name" className="col-form-label">Recipient:</label>
                            <input type="text" className="form-control" id="recipient-name" defaultValue={varyingtitle} />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">Message:</label>
                            <textarea className="form-control" id="message-text"></textarea>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={() => {
                          setmodal_varyingmodal(false)
                        }}>Close</button>
                      </div>
                    </Modal>

                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Toggle Between Modals</h4>
                  <p className="card-title-desc">Toggle between multiple modals with some clever placement of the <code>data-bs-target</code> and <code>data-bs-toggle</code> attributes.</p>
                </CardHeader>
                <CardBody>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        tog_between_modal()
                      }}
                      data-toggle="modal"
                    >
                      Open First Modal
                    </button>
                    <Modal
                      isOpen={modal_between_modal}
                      toggle={() => {
                        tog_between_modal()
                      }}
                      scrollable={true}
                      id="staticBackdrop"
                    >
                      <div className="modal-header">
                        <h5 className="modal-title">Modal 1</h5>
                        <button type="button" className="btn-close"
                          onClick={() => {
                            setmodal_between_modal(false)
                          }} aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <p>Show a second modal and hide this one with the button below.</p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={() => {
                          setmodal_between_modal(false)
                          setmodal_between_secondmodal(true)
                        }}>Open Second Modal</button>
                      </div>
                    </Modal>
                    <Modal
                      isOpen={modal_between_secondmodal}
                      toggle={() => {
                        tog_between_secondmodal()
                      }}
                      scrollable={true}
                      id="staticBackdrop"
                    >
                      <div className="modal-header">
                        <h5 className="modal-title">Modal 2</h5>
                        <button type="button" className="btn-close"
                          onClick={() => {
                            setmodal_between_secondmodal(false)
                          }} aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <p>Hide this modal and show the first with the button below.</p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={() => {
                          setmodal_between_modal(true)
                          setmodal_between_secondmodal(false)
                        }}>Back to First</button>
                      </div>
                    </Modal>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  )
}

export default UiModal;
