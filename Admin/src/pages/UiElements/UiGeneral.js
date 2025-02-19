import React, { useState } from "react";
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  Tooltip,
  Col,
  Row,
  Card,
  CardBody,
  Container,
  Spinner,
  Badge,
  UncontrolledPopover,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardHeader,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiGeneral = () => {

  //meta title
  document.title = "General | Minia - React Admin & Dashboard Template";

  const [popovertop, setpopovertop] = useState(false);
  const [popoverleft, setpopoverleft] = useState(false);
  const [popoverright, setpopoverright] = useState(false);
  const [popoverbottom, setpopoverbottom] = useState(false);
  const [popoverdismiss, setpopoverdismiss] = useState(false);

  const [ttop, setttop] = useState(false);
  const [tbottom, settbottom] = useState(false);
  const [tleft, settleft] = useState(false);
  const [tright, settright] = useState(false);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Components" breadcrumbItem="General" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Badges</h4>
                  <p className="card-title-desc">
                    Add any of the below mentioned modifier classes to change
                    the appearance of a badge.
                  </p>
                </CardHeader>
                <CardBody>
                  <div>
                    <h5 className="font-size-14">Default</h5>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      <Badge className="bg-primary">Primary</Badge>
                      <Badge className="bg-success">Success</Badge>
                      <Badge className="bg-info">Info</Badge>
                      <Badge className="bg-warning">Warning</Badge>
                      <Badge className="bg-danger">Danger</Badge>
                      <Badge className="bg-dark">Dark</Badge>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-size-14">Soft Badge</h5>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      <Badge color="" className="bg-primary-subtle text-primary">
                        Primary
                      </Badge>
                      <Badge color="" className="bg-success-subtle text-success">
                        Success
                      </Badge>
                      <Badge color="" className="bg-info-subtle text-info">
                        Info
                      </Badge>
                      <Badge color="" className="bg-warning-subtle text-warning">
                        Warning
                      </Badge>
                      <Badge color="" className="bg-danger-subtle text-danger">
                        Danger
                      </Badge>
                      <Badge color="" className="bg-dark-subtle text-dark">
                        Dark
                      </Badge>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Pill badges</h4>
                  <p className="card-title-desc">
                    Use the <code>.rounded-pill</code> modifier class to make
                    badges more rounded.
                  </p>
                </CardHeader>
                <CardBody>
                  <div>
                    <h5 className="font-size-14">Default</h5>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      <Badge className="rounded-pill bg-primary">
                        Primary
                      </Badge>
                      <Badge className="rounded-pill bg-success">
                        Success
                      </Badge>
                      <Badge className="rounded-pill bg-info">Info</Badge>
                      <Badge className="rounded-pill bg-warning">
                        Warning
                      </Badge>
                      <Badge className="rounded-pill bg-danger">
                        Danger
                      </Badge>
                      <Badge className="rounded-pill bg-dark">Dark</Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-size-14">Soft Badge</h5>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      <Badge color=""
                        className="rounded-pill bg-primary-subtle text-primary"
                      >
                        Primary
                      </Badge>
                      <Badge color=""
                        className="rounded-pill bg-success-subtle text-success"
                      >
                        Success
                      </Badge>
                      <Badge color="" className="rounded-pill bg-info-subtle text-info">
                        Info
                      </Badge>
                      <Badge color=""
                        className="rounded-pill bg-warning-subtle text-warning"
                      >
                        Warning
                      </Badge>
                      <Badge color=""
                        className="rounded-pill bg-danger-subtle text-danger"
                      >
                        Danger
                      </Badge>
                      <Badge color="" className="rounded-pill bg-dark-subtle text-dark">
                        Dark
                      </Badge>
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
                  <h4 className="card-title">Badges in Buttons</h4>
                  <p className="card-title-desc">
                    Badges can be used as part of links or buttons to provide
                    a counter.
                  </p>
                </CardHeader>

                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-primary">
                      Notifications{" "}
                      <span className="badge bg-success ms-1">4</span>
                    </button>
                    <button type="button" className="btn btn-success">
                      Messages <span className="badge bg-danger ms-1">2</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                    >
                      Draft <span className="badge bg-success ms-1">2</span>
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Badges Position Examples</h4>
                  <p className="card-title-desc">
                    Example of Badges Position
                  </p>
                </CardHeader>

                <CardBody>
                  <div className="d-flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="btn btn-primary position-relative"
                    >
                      Mails{" "}
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                        +99{" "}
                        <span className="visually-hidden">
                          unread messages
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-light position-relative"
                    >
                      Alerts{" "}
                      <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1">
                        <span className="visually-hidden">
                          unread messages
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary position-relative p-0 avatar-sm rounded"
                    >
                      <span className="avatar-title bg-transparent">
                        <i className="bx bxs-envelope"></i>
                      </span>
                      <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1">
                        <span className="visually-hidden">
                          unread messages
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-light position-relative p-0 avatar-sm rounded-circle"
                    >
                      <span className="avatar-title bg-transparent text-reset">
                        <i className="bx bxs-bell"></i>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-light position-relative p-0 avatar-sm rounded-circle"
                    >
                      <span className="avatar-title bg-transparent text-reset">
                        <i className="bx bx-menu"></i>
                      </span>
                      <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-success p-1">
                        <span className="visually-hidden">
                          unread messages
                        </span>
                      </span>
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Popovers</h4>
                  <p className="card-title-desc">
                    Four options are available: top, right, bottom, and left aligned. Directions are mirrored when using Bootstrap in RTL.
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      id="Popovertop"
                      color="secondary"
                      onClick={() => {
                        setpopovertop(!popovertop);
                      }}
                    >
                      Popover on top
                    </Button>
                    <Popover
                      placement="top"
                      isOpen={popovertop}
                      target="Popovertop"
                      toggle={() => {
                        setpopovertop(!popovertop);
                      }}
                    >
                      <PopoverHeader>Popover Title</PopoverHeader>
                      <PopoverBody>
                        Sed posuere consectetur est at lobortis. Aenean eu leo
                        quam. Pellentesque ornare sem lacinia quam venenatis
                        vestibulum.
                      </PopoverBody>
                    </Popover>{" "}
                    <Button
                      id="Popoverright"
                      onClick={() => {
                        setpopoverright(!popoverright);
                      }}
                      color="secondary"
                    >
                      Popover on right
                    </Button>
                    <Popover
                      placement="right"
                      isOpen={popoverright}
                      target="Popoverright"
                      toggle={() => {
                        setpopoverright(!popoverright);
                      }}
                    >
                      <PopoverHeader>Popover Title</PopoverHeader>
                      <PopoverBody>
                        Sed posuere consectetur est at lobortis. Aenean eu leo
                        quam. Pellentesque ornare sem lacinia quam venenatis
                        vestibulum.
                      </PopoverBody>
                    </Popover>{" "}
                    <Button
                      id="Popoverbottom"
                      onClick={() => {
                        setpopoverbottom(!popoverbottom);
                      }}
                      color="secondary"
                    >
                      Popover on bottom
                    </Button>
                    <Popover
                      placement="bottom"
                      isOpen={popoverbottom}
                      target="Popoverbottom"
                      toggle={() => {
                        setpopoverbottom(!popoverbottom);
                      }}
                    >
                      <PopoverHeader>Popover Title</PopoverHeader>
                      <PopoverBody>
                        Sed posuere consectetur est at lobortis. Aenean eu leo
                        quam. Pellentesque ornare sem lacinia quam venenatis
                        vestibulum.
                      </PopoverBody>
                    </Popover>{" "}
                    <Button
                      id="Popoverleft"
                      onClick={() => {
                        setpopoverleft(!popoverleft);
                      }}
                      color="secondary"
                    >
                      Popover on left
                    </Button>
                    <Popover
                      placement="left"
                      isOpen={popoverleft}
                      target="Popoverleft"
                      toggle={() => {
                        setpopoverleft(!popoverleft);
                      }}
                    >
                      <PopoverHeader>Popover Title</PopoverHeader>
                      <PopoverBody>
                        Sed posuere consectetur est at lobortis. Aenean eu leo
                        quam. Pellentesque ornare sem lacinia quam venenatis
                        vestibulum.
                      </PopoverBody>
                    </Popover>{" "}
                    <Button
                      id="Popoverdismiss"
                      className="btn btn-success"
                      onClick={() => {
                        setpopoverdismiss(!popoverdismiss);
                      }}
                    >
                      Dismissible popover
                    </Button>
                    <UncontrolledPopover
                      trigger="focus"
                      target="Popoverdismiss"
                      placement="right"
                    >
                      <PopoverHeader>Dismissible popover</PopoverHeader>
                      <PopoverBody>
                        Vivamus sagittis lacus vel augue laoreet rutrum faucibus
                      </PopoverBody>
                    </UncontrolledPopover>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Tooltips</h4>
                  <p className="card-title-desc">
                    Hover over the links below to see tooltips:
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Tooltip
                      placement="top"
                      isOpen={ttop}
                      target="TooltipTop"
                      toggle={() => {
                        setttop(!ttop);
                      }}
                    >
                      Hello world!
                    </Tooltip>
                    <Tooltip
                      placement="right"
                      isOpen={tright}
                      target="TooltipRight"
                      toggle={() => {
                        settright(!tright);
                      }}
                    >
                      Hello world!
                    </Tooltip>
                    <Tooltip
                      placement="bottom"
                      isOpen={tbottom}
                      target="TooltipBottom"
                      toggle={() => {
                        settbottom(!tbottom);
                      }}
                    >
                      Hello world!
                    </Tooltip>
                    <Tooltip
                      placement="left"
                      isOpen={tleft}
                      target="TooltipLeft"
                      toggle={() => {
                        settleft(!tleft);
                      }}
                    >
                      Hello world!
                    </Tooltip>

                    <button
                      type="button"
                      className="btn btn-primary"
                      id="TooltipTop"
                    >
                      {" "}
                      Tooltip on top
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      id="TooltipRight"
                    >
                      {" "}
                      Tooltip on right
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      id="TooltipBottom"
                    >
                      {" "}
                      Tooltip on bottom
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      id="TooltipLeft"
                    >
                      {" "}
                      Tooltip on left
                    </button>

                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">
                    Pagination Default Example
                  </h4>
                  <p className="card-title-desc">
                    Pagination links indicate a series of related content exists across multiple pages.
                  </p>
                </CardHeader>
                <CardBody>
                  <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                      <PaginationLink href="#">Previous</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">Next</PaginationLink>
                    </PaginationItem>
                  </Pagination>

                    <Pagination aria-label="Page navigation example" className="mb-0">
                      <PaginationItem>
                        <PaginationLink href="#" previous>
                          <i className="mdi mdi-chevron-left" />
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink next>
                          <i className="mdi mdi-chevron-right" />
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>

                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h5 className="font-size-14">Pagination Disabled and Active</h5>
                  <p className="card-title-desc">
                    Pagination links are customizable for different
                    circumstances. Use <code>.disabled</code> for links that
                    appear un-clickable and <code>.active</code> to indicate the
                    current page.
                  </p>
                </CardHeader>

                <CardBody>
                  <Pagination aria-label="Page navigation example">
                    <PaginationItem disabled>
                      <PaginationLink href="#" tabIndex={-1}>
                        Previous
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem active>
                      <PaginationLink href="#">
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">Next</PaginationLink>
                    </PaginationItem>
                  </Pagination>

                  <Pagination aria-label="Page navigation example">
                    <PaginationItem disabled>
                      <PaginationLink>
                        <i className="mdi mdi-chevron-left" />
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem active>
                      <PaginationLink>
                        2<span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">
                        <i className="mdi mdi-chevron-right" />
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Pagination Sizing</h4>
                  <p className="card-title-desc">
                    Fancy larger or smaller pagination? Add{" "}
                    <code>.pagination-lg</code> or <code>.pagination-sm</code>{" "}
                    for additional sizes.
                  </p>
                </CardHeader>

                <CardBody>
                  <Pagination size="lg" aria-label="Page navigation example">
                    <PaginationItem disabled>
                      <PaginationLink href="#" tabIndex={-1}>
                        Previous
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">Next</PaginationLink>
                    </PaginationItem>
                  </Pagination>

                  <Pagination size="sm" aria-label="Page navigation example" className="mb-0">
                    <PaginationItem disabled>
                      <PaginationLink href="#" tabIndex={-1}>
                        Previous
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">Next</PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Pagination Alignment</h4>
                  <p className="card-title-desc">
                    Change the alignment of pagination components with flexbox
                    utilities.
                  </p>
                </CardHeader>
                <CardBody>
                  <Pagination
                    aria-label="Page navigation example"
                    listClassName="justify-content-center"
                  >
                    <PaginationItem disabled>
                      <PaginationLink href="#" tabIndex={-1}>
                        Previous
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">Next</PaginationLink>
                    </PaginationItem>
                  </Pagination>

                  <Pagination
                    aria-label="Page navigation example"
                    listClassName="justify-content-end"
                  >
                    <PaginationItem disabled>
                      <PaginationLink href="#" tabIndex={-1}>
                        Previous
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">Next</PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Border spinner</h4>
                  <p className="card-title-desc">
                    Use the border spinners for a lightweight loading indicator.
                  </p>
                </CardHeader>
                <CardBody>
                  <div>
                    <Spinner className="ms-2" color="primary" />
                    <Spinner className="ms-2" color="secondary" />
                    <Spinner className="ms-2" color="success" />
                    <Spinner className="ms-2" color="danger" />
                    <Spinner className="ms-2" color="warning" />
                    <Spinner className="ms-2" color="info" />
                    <Spinner className="ms-2" color="light" />
                    <Spinner className="ms-2" color="dark" />
                  </div>
                </CardBody>{" "}
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Growing spinner</h4>
                  <p className="card-title-desc">
                    If you don’t fancy a border spinner, switch to the grow
                    spinner. While it doesn’t technically spin, it does
                    repeatedly grow!
                  </p>
                </CardHeader>
                <CardBody>
                  <div>
                    <Spinner type="grow" className="ms-2" color="primary" />
                    <Spinner type="grow" className="ms-2" color="secondary" />
                    <Spinner type="grow" className="ms-2" color="success" />
                    <Spinner type="grow" className="ms-2" color="danger" />
                    <Spinner type="grow" className="ms-2" color="warning" />
                    <Spinner type="grow" className="ms-2" color="info" />
                    <Spinner type="grow" className="ms-2" color="light" />
                    <Spinner type="grow" className="ms-2" color="dark" />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Close Button</h4>
                  <p className="card-title-desc">Provide an option to dismiss or close a component with <code>.btn-close</code>. Default styling is limited, but highly customizable. Modify the Sass variables to replace the default <code>background-image</code>. <strong>Be sure to include text for screen readers</strong>, as we’ve done with <code>aria-label</code>.</p>

                </CardHeader>
                <CardBody>
                  <div>
                    <button type="button" className="btn-close" aria-label="Close"></button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Disable Close Button</h4>
                  <p className="card-title-desc">Disabled close buttons change their <code>opacity</code>. We’ve also applied <code>pointer-events: none</code> and <code>user-select: none</code> to preventing hover and active states from triggering.</p>

                </CardHeader>
                <CardBody>
                  <div>
                    <button type="button" className="btn-close" disabled aria-label="Close"></button>
                  </div>

                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Close Button White Variant</h4>
                  <p className="card-title-desc">Change the default <code>.btn-close</code> to be white with the <code>.btn-close-white</code> class. This class uses the <code>filter</code> property to invert the <code>background-image</code>.</p>

                </CardHeader>
                <CardBody className="bg-dark">
                    <button type="button" className="btn-close btn-close-white" aria-label="Close"></button>{" "}
                    <button type="button" className="btn-close btn-close-white" disabled aria-label="Close"></button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiGeneral;