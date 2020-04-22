import {SHOWUUPPOPUP, HIDEUUPPOPUP} from './actions'

export function showUpdatePopup(state = { isShowUpPopup: false }, action) {
  switch (action.type) {
    case SHOWUUPPOPUP:
      return { ...state, isShowUpPopup: true }
    case HIDEUUPPOPUP:
      return { ...state, isShowUpPopup: false }
    default:
      return state
  }
}