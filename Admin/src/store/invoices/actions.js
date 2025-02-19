import {
  GET_INVOICES,
  GET_INVOICES_FAIL,
  GET_INVOICES_SUCCESS,
  GET_INVOICE_DETAIL,
  GET_INVOICE_DETAIL_FAIL,
  GET_INVOICE_DETAIL_SUCCESS,
  UPDATE_INVOICE_DETAIL_FAIL,
  UPDATE_INVOICE_DETAIL_SUCCESS,
  UPDATE_INVOICE_DETAIL,
  DELETE_INVOICE_DETAIL_FAIL,
  DELETE_INVOICE_DETAIL_SUCCESS,
  DELETE_INVOICE_DETAIL,
  ADD_INVOICE_DETAIL_SUCCESS,
  ADD_INVOICE_DETAIL,
  ADD_INVOICE_DETAIL_FAIL

} from "./actionTypes"

export const getInvoices = () => ({
  type: GET_INVOICES,
})

export const getInvoicesSuccess = invoices => ({
  type: GET_INVOICES_SUCCESS,
  payload: invoices,
})

export const getInvoicesFail = error => ({
  type: GET_INVOICES_FAIL,
  payload: error,
})

export const getInvoiceDetail = invoiceId => ({
  type: GET_INVOICE_DETAIL,
  invoiceId,
})

export const getInvoiceDetailSuccess = invoices => ({
  type: GET_INVOICE_DETAIL_SUCCESS,
  payload: invoices,
})

export const getInvoiceDetailFail = error => ({
  type: GET_INVOICE_DETAIL_FAIL,
  payload: error,
})

export const  addInvoiceDetail = (data) => ({
  type: ADD_INVOICE_DETAIL,
  payload: data
})

export const addInvoicedetailSuccess = (data) => ({
  type: ADD_INVOICE_DETAIL_SUCCESS,
  payload: data
})

export const addInvoicedetailFail = (error) => ({
  type: ADD_INVOICE_DETAIL_FAIL,
  payload: error
})

export const invoiceDelete = (data) => ({
  type: DELETE_INVOICE_DETAIL,
  payload: data
})

export const invoiceDeleteSuccess = (data) => ({
  type: DELETE_INVOICE_DETAIL_SUCCESS,
  payload: data
})

export const invoiceDeleteFail = (error) => ({
  type: DELETE_INVOICE_DETAIL_FAIL,
  payload: error
})

export const invoiceUpdate = (data) => ({
  type: UPDATE_INVOICE_DETAIL,
  payload: data
})

export const invoiceUpdateSuccess = (data) => ({
  type: UPDATE_INVOICE_DETAIL_SUCCESS,
  payload: data
})

export const invoiceUpdateFail = (error) => ({
  type: UPDATE_INVOICE_DETAIL_FAIL,
  payload: error
})
