import {
    GET_MARKET_OVERVIEW,
    GET_MARKET_OVERVIEW_SUCCESS,
    GET_MARKET_OVERVIEW_FAIL,
    GET_WALLENT_BALANCE_SUCCESS,
    GET_WALLENT_BALANCE_FAIL,
    GET_WALLENT_BALANCE,
    GET_Invested_Overview,
    GET_Invested_Overview_SUCCESS,
    GET_Invested_Overview_FAIL,
} from "./actiontype";

export const getMarketoverview = (data) => ({
    type: GET_MARKET_OVERVIEW,
    payload: data,
});

export const getMarketoverviewSuccess = (actionType, invoices) => ({
    type: GET_MARKET_OVERVIEW_SUCCESS,
    payload: { actionType, invoices },
})

export const getMarketoverviewFail = (actionType, error) => ({
    type: GET_MARKET_OVERVIEW_FAIL,
    payload: { actionType, error },
})

export const getWalletBalance = (data) => ({
    type: GET_WALLENT_BALANCE,
    payload: data,
})

export const getWalletBalanceSuccess = (actionType, data) => ({
    type: GET_WALLENT_BALANCE_SUCCESS,
    payload: { actionType, data },
})

export const getWalletBalanceFail = (actionType, error) => ({
    type: GET_WALLENT_BALANCE_FAIL,
    payload: { actionType, error },
})

export const getInvestedOverview = (data) => ({
    type: GET_Invested_Overview,
    payload: data,
})

export const getInvestedOverviewSuccess = (actionType, data) => ({
    type: GET_Invested_Overview_SUCCESS,
    payload: { actionType, data }
})

export const getInvestedOverviewFail = (actionType, error) => ({
    type: GET_Invested_Overview_FAIL,
    payload: { actionType, error },
})