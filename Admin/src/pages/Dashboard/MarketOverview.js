import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { getMarketoverview } from '../../store/actions';
import OverviewCharts from './OverviewCharts';
import { createSelector } from 'reselect';

const MarketOverview = () => {

    const dispatch = useDispatch();

    const [state, setState] = useState("ALL");

    const marketData = createSelector(

        (state) => state.dashboard,
        (state) => ({
            Marketoverview: state.Marketoverview,
        })
    );
    // Inside your component
    const { Marketoverview } = useSelector(marketData);

    const onChangeHandle = (data) => {
        setState(data);
        dispatch(getMarketoverview(data));
    };

    useEffect(() => {
        dispatch(getMarketoverview(state));
    }, [state]);

    useEffect(() => {
        dispatch(getMarketoverview("All"));
    }, [dispatch]);

    return (
        <React.Fragment>
            <Col xl={8}>
                <Card>
                    <CardBody>
                        <div className="d-flex flex-wrap align-items-center mb-4">
                            <h5 className="card-title me-2">Market Overview</h5>
                            <div className="ms-auto">
                                <div>
                                    <button type="button" className="btn btn-soft-primary btn-sm" onClick={() => onChangeHandle("ALL")}>
                                        ALL
                                    </button>{" "}
                                    <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => onChangeHandle("1M")}>
                                        1M
                                    </button>{" "}
                                    <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => onChangeHandle("6M")}>
                                        6M
                                    </button>{" "}
                                    <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => onChangeHandle("1Y")}>
                                        1Y
                                    </button>{" "}
                                </div>
                            </div>
                        </div>

                        <Row className="align-items-center">
                            <Col xl={8}>
                                <div>
                                    <div id="market-overview" className="apex-charts">
                                        <OverviewCharts
                                            Marketoverview={Marketoverview.invoices} />
                                    </div>
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className="p-4">
                                    <div className="mt-0">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-sm m-auto">
                                                <span className="avatar-title rounded-circle bg-light-subtle text-dark font-size-16">
                                                    1
                                                </span>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <span className="font-size-16">Coinmarketcap</span>
                                            </div>

                                            <div className="flex-shrink-0">
                                                <span className="badge rounded-pill bg-success-subtle text-success font-size-12 fw-medium">+2.5%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-sm m-auto">
                                                <span className="avatar-title rounded-circle bg-light-subtle text-dark font-size-16">
                                                    2
                                                </span>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <span className="font-size-16">Binance</span>
                                            </div>

                                            <div className="flex-shrink-0">
                                                <span className="badge rounded-pill bg-success-subtle text-success font-size-12 fw-medium">+8.3%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-sm m-auto">
                                                <span className="avatar-title rounded-circle bg-light-subtle text-dark font-size-16">
                                                    3
                                                </span>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <span className="font-size-16">Coinbase</span>
                                            </div>

                                            <div className="flex-shrink-0">
                                                <span className="badge rounded-pill bg-danger-subtle text-danger font-size-12 fw-medium">-3.6%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-sm m-auto">
                                                <span className="avatar-title rounded-circle bg-light-subtle text-dark font-size-16">
                                                    4
                                                </span>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <span className="font-size-16">Yobit</span>
                                            </div>

                                            <div className="flex-shrink-0">
                                                <span className="badge rounded-pill bg-success-subtle text-success font-size-12 fw-medium">+7.1%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-sm m-auto">
                                                <span className="avatar-title rounded-circle bg-light-subtle text-dark font-size-16">
                                                    5
                                                </span>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <span className="font-size-16">Bitfinex</span>
                                            </div>

                                            <div className="flex-shrink-0">
                                                <span className="badge rounded-pill bg-danger-subtle text-danger font-size-12 fw-medium">-0.9%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-2">
                                        <Link to="/invoices-list" className="btn btn-primary w-100">See All Balances <i
                                            className="mdi mdi-arrow-right ms-1"></i></Link>
                                    </div>

                                </div>
                            </Col>
                        </Row>
                    </CardBody>

                </Card>

            </Col>
        </React.Fragment>
    );
}

export default MarketOverview;