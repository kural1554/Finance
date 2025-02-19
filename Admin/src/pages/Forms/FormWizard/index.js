import React from 'react';
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import BasicPills from './BasicPills';
import ProgressbarWizard from './ProgressbarWizard';

const FormWizard = () => {
    //meta title
    document.title = "Form Wizard | Minia - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Forms" breadcrumbItem="Form Wizard" />

                    <div className="row">
                        <div className="col-lg-12">
                            <BasicPills />
                            <ProgressbarWizard />
                        </div>
                    </div>

                </Container>
            </div>
        </React.Fragment>
    );
}

export default FormWizard;