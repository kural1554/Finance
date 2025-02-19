import React from "react";
import { Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const PagesStarter = () => {
    //meta title
    document.title = "Stater Page | Minia - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Pages" breadcrumbItem="Starter Page" />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default PagesStarter;
