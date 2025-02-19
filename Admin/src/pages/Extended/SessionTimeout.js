import React, { useEffect, useState } from "react";

import { Card, Row, Col, CardBody, CardHeader, Container, ModalBody, ModalFooter, Modal, ModalHeader } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";


const SessionTimeout = () => {

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(30); // Countdown in seconds
  const logoutUrl = '/page-login'; // Change this to your logout URL

  useEffect(() => {
    const warnTimeout = setTimeout(() => {
      setShowWarning(!showWarning);
    }, 1000); // Logout before 1 seconds


    const redirTimeout = setTimeout(() => {
      window.location.href = logoutUrl;
    }, 30000); // Redirect after 30 seconds

    return () => {
      clearTimeout(warnTimeout);
      clearTimeout(redirTimeout);
    };
  }, []);

  useEffect(() => {
    if (showWarning) {
      const countdownInterval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000); // Decrease countdown every second

      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [showWarning]);

  const closeModal = () => {
    setShowWarning(false);
  };
  //meta title
  document.title = "Session Timeout| Minia - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>

          <Breadcrumbs title="Extended" breadcrumbItem="Session Timeout" />

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h5 className="card-title" >Bootstrap-session-timeout</h5>
                  <p className="card-title-desc">
                    Session timeout and keep-alive control with a nice
                    Bootstrap warning dialog.
                  </p>
                </CardHeader>
                <CardBody>
                  <div>
                    <p>
                      After a set amount of idle time, a Bootstrap warning
                      dialog is shown to the user with the option to either
                      log out, or stay connected. If &quot;Logout&quot; button
                      is selected, the page is redirected to a logout URL. If
                      &quot;Stay Connected&quot; is selected the dialog closes
                      and the session is kept alive. If no option is selected
                      after another set amount of idle time, the page is
                      automatically redirected to a set timeout URL.
                    </p>
                    <p>
                      Idle time is defined as no mouse, keyboard or touch
                      event activity registered by the browser.
                    </p>

                    <p className="mb-0">
                      As long as the user is active, the (optional) keep-alive
                      URL keeps getting pinged and the session stays alive. If
                      you have no need to keep the server-side session alive
                      via the keep-alive URL, you can also use this plugin as
                      a simple lock mechanism that redirects to your
                      lock-session or log-out URL after a set amount of idle
                      time.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>

      <div>
        {showWarning && (
          <Modal tabIndex={1} role="dialog" isOpen={true}>
            <div className="modal-content">
              <ModalHeader>
                <h5 className="modal-title">Session Timeout Warning</h5>
              </ModalHeader>
              <ModalBody >
                <p>Redirecting in <span className="text-danger"> {countdown} </span> seconds.</p>
              </ModalBody>
              <ModalFooter >
                <button type="button" className="btn btn-danger" onClick={closeModal}>
                  Close
                </button>
              </ModalFooter>
            </div>
          </Modal>
        )}
      </div>
    </React.Fragment>
  );
}


export default SessionTimeout;
