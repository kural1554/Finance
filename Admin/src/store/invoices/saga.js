import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { GET_INVOICES, GET_INVOICE_DETAIL, ADD_INVOICE_DETAIL, DELETE_INVOICE_DETAIL, UPDATE_INVOICE_DETAIL } from "./actionTypes"
import {
  getInvoicesSuccess,
  getInvoicesFail,
  getInvoiceDetailSuccess,
  getInvoiceDetailFail,
  addInvoicedetailSuccess,
  addInvoicedetailFail,
  invoiceDeleteSuccess,
  invoiceDeleteFail,
  invoiceUpdateSuccess,
  invoiceUpdateFail,
} from "./actions"

//Include Both Helper File with needed methods
import { getInvoices, getInvoiceDetail, addInvoice, deleteInvoice, updateInvoice } from "../../helpers/fakebackend_helper"

function* fetchInvoices() {
  try {
    const response = yield call(getInvoices)
    yield put(getInvoicesSuccess(response))
  } catch (error) {
    yield put(getInvoicesFail(error))
  }
}

function* fetchInvoiceDetail({ invoiceId }) {
  try {
    const response = yield call(getInvoiceDetail, invoiceId)
    yield put(getInvoiceDetailSuccess(response))
  } catch (error) {
    yield put(getInvoiceDetailFail(error))
  }
}

function* addInvoiceDetail({ payload: user }) {
  try {
    const response = yield call(addInvoice, user)

    yield put(addInvoicedetailSuccess(response))
  } catch (error) {

    yield put(addInvoicedetailFail(error))
  }
}

function* onDeleteInvoice({ payload: data }) {
  try {
    const response = yield call(deleteInvoice, data);
    yield put(invoiceDeleteSuccess(response));
  } catch (error) {
    yield put(invoiceDeleteFail(error));
  }
}

function* onUpdateinvoice({ payload: data }) {
  try {
    const response = yield call(updateInvoice, data);
    yield put(invoiceUpdateSuccess(response));
  } catch (error) {
    yield put(invoiceUpdateFail(error));
  }
}

function* invoiceSaga() {
  yield takeEvery(GET_INVOICES, fetchInvoices)
  yield takeEvery(GET_INVOICE_DETAIL, fetchInvoiceDetail)
  yield takeEvery(ADD_INVOICE_DETAIL, addInvoiceDetail)
  yield takeEvery(DELETE_INVOICE_DETAIL, onDeleteInvoice)
  yield takeEvery(UPDATE_INVOICE_DETAIL, onUpdateinvoice)
}

export default invoiceSaga
