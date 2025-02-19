import {
  GET_INVOICES_FAIL,
  GET_INVOICES_SUCCESS,
  GET_INVOICE_DETAIL_SUCCESS,
  GET_INVOICE_DETAIL_FAIL,
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

const INIT_STATE = {
  invoices: [],
  invoiceDetail: {},
  error: {},
}

const Invoices = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_INVOICES_SUCCESS:
      return {
        ...state,
        invoices: action.payload,
      }

    case GET_INVOICES_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_INVOICE_DETAIL_SUCCESS:
      return {
        ...state,
        invoiceDetail: action.payload,
      }

    case GET_INVOICE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ADD_INVOICE_DETAIL_SUCCESS:
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
      }

    case ADD_INVOICE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case DELETE_INVOICE_DETAIL_SUCCESS:
      return {
        ...state,
        invoices: state.invoices.filter((item) => item.id !== action.payload),
      };

    case DELETE_INVOICE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_INVOICE_DETAIL_SUCCESS:
      return {
        ...state,
        invoices: state.invoices.map((order) =>
          order.id.toString() === action.payload.id.toString()
            ? { order, ...action.payload }
            : order
        ),
      };

    case UPDATE_INVOICE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state
  }
}

export default Invoices
