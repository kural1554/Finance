import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { getWalletBalance } from '../../store/actions';

import WalletPieChart from "./WalletPieChart";
import { createSelector } from 'reselect';

const WalletBalance = () => {
    
    const [state, setState] = useState("ALL");
    const dispatch = useDispatch()

    const onChangehandle = (data) => {
        setState(data);
        dispatch(getWalletBalance(data));
    };
    const walletData = createSelector(

        (state) => state.dashboard,
        (state) => ({
          WallentBalanceData: state.WallentBalanceData,
        })
      );
      // Inside your component
      const { WallentBalanceData } = useSelector(walletData);

    useEffect(() => {
        dispatch(getWalletBalance(state));
    }, [state]);

    useEffect(() => {
        dispatch(getWalletBalance(state));
    }, [dispatch]);

    
    return (
        <React.Fragment>
            <Col xl={5}>
                <Card className="card-h-100">
                    <CardBody>
                        <div className="d-flex flex-wrap align-items-center mb-4">
                            <h5 className="card-title me-2">Wallet Balance</h5>
                            <div className="ms-auto">
                                <div>
                                    <button type="button" className="btn btn-soft-primary btn-sm" onClick={() => onChangehandle("ALL")} >
                                        ALL
                                    </button>{" "}
                                    <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => onChangehandle("1M")}>
                                        1M
                                    </button>{" "}
                                    <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => onChangehandle("6M")}>
                                        6M
                                    </button>{" "}
                                    <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => onChangehandle("1Y")}>
                                        1Y
                                    </button>{" "}
                                </div>
                            </div>
                        </div>

                        <Row className="align-items-center">
                            <div className="col-sm">
                                <div id="wallet-balance" className="apex-charts">
                                    <WalletPieChart WallentBalanceData={WallentBalanceData.data} />
                                </div>
                            </div>
                            <div className="col-sm align-self-center">
                                <div className="mt-4 mt-sm-0">
                                    <div>
                                        <p className="mb-2"><i className="mdi mdi-circle align-middle font-size-10 me-2 text-success"></i> Today investment</p>
                                        <h6> ₹ 400000</h6>
                                    </div>

                                    <div className="mt-4 pt-2">
                                        <p className="mb-2"><i className="mdi mdi-circle align-middle font-size-10 me-2 text-primary"></i> Today Expenses</p>
                                        <h6> ₹ 80000</h6>
                                    </div>

                                    <div className="mt-4 pt-2">
                                        <p className="mb-2"><i className="mdi mdi-circle align-middle font-size-10 me-2 text-info"></i> Today Collection</p>
                                        <h6> ₹ 402532</h6>
                                    </div>
                                </div>
                            </div>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default WalletBalance;