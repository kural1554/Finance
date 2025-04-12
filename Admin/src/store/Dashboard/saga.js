import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import {
    GET_MARKET_OVERVIEW,
    GET_WALLENT_BALANCE,
    GET_Invested_Overview,
} from "./actiontype";
import { getMarketoverviewSuccess, getMarketoverviewFail, getWalletBalanceFail, getWalletBalanceSuccess, getInvestedOverviewSuccess, getInvestedOverviewFail } from "./actions";

//Include Both Helper File with needed methods
import {
    getMarketoverViewData, getWallentData, getInvestedData
} from "../../helpers/fakebackend_helper";


function* getChartsData({ payload: periodType }) {
    var res
    try {
        if (periodType == "ALL") {
            res = yield call(getMarketoverViewData, periodType);
        }
        if (periodType == "1M") {
            res = yield call(getMarketoverViewData, periodType);
        }
        if (periodType == "6M") {
            res = yield call(getMarketoverViewData, periodType);
        }
        if (periodType == "1Y") {
            res = yield call(getMarketoverViewData, periodType);
        }
        yield put(getMarketoverviewSuccess(GET_MARKET_OVERVIEW, res));
    } catch (error) {
        yield put(getMarketoverviewFail(GET_MARKET_OVERVIEW, error));
    }
}


function* getWalletBalance({ payload: data }) {
    var response
    try {
        if (data == "ALL") {
            response = yield call(getWallentData, data);
        }
        if (data == "6M") {
            response = yield call(getWallentData, data);
        }
        if (data == "1M") {
            response = yield call(getWallentData, data);
        }
        if (data == "1Y") {
            response = yield call(getWallentData, data);
        }
        yield put(getWalletBalanceSuccess(GET_WALLENT_BALANCE, response));
    }
    catch (error) {
        yield put(getWalletBalanceFail(GET_WALLENT_BALANCE, error));
    }
}

function* getInvestedOverviewData({ payload: data }) {
    var investedData
    try {
        if (data == "AP") {
            investedData = yield call(getInvestedData, data);
        }
        if (data == "MA") {
            investedData = yield call(getInvestedData, data);
        }
        if (data == "FE") {
            investedData = yield call(getInvestedData, data);
        }
        if (data == "JA") {
            investedData = yield call(getInvestedData, data);
        }
        if (data == "DE") {
            investedData = yield call(getInvestedData, data);
        }
        yield put(getInvestedOverviewSuccess(GET_Invested_Overview, investedData));
    }
    catch (error) {
        yield put(getInvestedOverviewFail(GET_Invested_Overview, error));
    }
}

export function* watchGetChartsData() {
    yield takeEvery(GET_MARKET_OVERVIEW, getChartsData);
    yield takeEvery(GET_WALLENT_BALANCE, getWalletBalance);
    yield takeEvery(GET_Invested_Overview, getInvestedOverviewData);
}

function* dashboardSaga() {
    yield all([fork(watchGetChartsData)]);
}

export default dashboardSaga;
