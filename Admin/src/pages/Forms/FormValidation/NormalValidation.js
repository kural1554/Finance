import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    FormGroup,
    Label,
    Input,
    Button,
    FormFeedback,
    Form
} from 'reactstrap';

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

const NormalValidation = () => {
    // Form validation 
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            firstname: "Mark" || '',
            lastname: "Otto" || '',
            city: '',
            state: '',
            zip: '',
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required("Please Enter Your First Name"),
            lastname: Yup.string().required("Please Enter Your Last Name"),
            city: Yup.string().required("Please Enter Your City"),
            state: Yup.string().required("Please Enter Your State"),
            zip: Yup.string().required("Please Enter Your Zip"),
        }),
        onSubmit: (values) => {
            console.log("values", values);
        }
    });

    return (
        <React.Fragment>
            <Col xl={6}>
                <Card>
                    <CardHeader>
                        <h4 className="card-title">React Validation - Normal</h4>
                        <p className="card-title-desc">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                    </CardHeader>
                    <CardBody>
                        <Form className="needs-validation"
                            onSubmit={(e) => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                            }}
                        >
                            <Row>
                                <Col md="6">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom01">First name</Label>
                                        <Input
                                            name="firstname"
                                            placeholder="First name"
                                            type="text"
                                            className="form-control"
                                            id="validationCustom01"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.firstname || ""}
                                            invalid={
                                                validation.touched.firstname && validation.errors.firstname ? true : false
                                            }
                                        />
                                        {validation.touched.firstname && validation.errors.firstname ? (
                                            <FormFeedback type="invalid">{validation.errors.firstname}</FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom02">Last name</Label>
                                        <Input
                                            name="lastname"
                                            placeholder="Last name"
                                            type="text"
                                            className="form-control"
                                            id="validationCustom02"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.lastname || ""}
                                            invalid={
                                                validation.touched.lastname && validation.errors.lastname ? true : false
                                            }
                                        />
                                        {validation.touched.lastname && validation.errors.lastname ? (
                                            <FormFeedback type="invalid">{validation.errors.lastname}</FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="4">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom03">City</Label>
                                        <Input
                                            name="city"
                                            placeholder="City"
                                            type="text"
                                            className="form-control"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.city || ""}
                                            invalid={
                                                validation.touched.city && validation.errors.city ? true : false
                                            }
                                        />
                                        {validation.touched.city && validation.errors.city ? (
                                            <FormFeedback type="invalid">{validation.errors.city}</FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom04">State</Label>
                                        <Input
                                            name="state"
                                            placeholder="State"
                                            type="text"
                                            className="form-control"
                                            id="validationCustom04"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.state || ""}
                                            invalid={
                                                validation.touched.state && validation.errors.state ? true : false
                                            }
                                        />
                                        {validation.touched.state && validation.errors.state ? (
                                            <FormFeedback type="invalid">{validation.errors.state}</FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom05">Zip</Label>
                                        <Input
                                            name="zip"
                                            placeholder="Zip"
                                            type="text"
                                            className="form-control"
                                            id="validationCustom05"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.zip || ""}
                                            invalid={
                                                validation.touched.zip && validation.errors.zip ? true : false
                                            }
                                        />
                                        {validation.touched.zip && validation.errors.zip ? (
                                            <FormFeedback type="invalid">{validation.errors.zip}</FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="12">
                                    <FormGroup className="mb-3">
                                        <div className="form-check">
                                            <Input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="invalidCheck"
                                            />
                                            <Label
                                                className="form-check-label"
                                                htmlFor="invalidCheck"
                                            >
                                                {" "}
                                                Agree to terms and conditions
                                            </Label>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Button color="primary" type="submit">
                                Submit form
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default NormalValidation;