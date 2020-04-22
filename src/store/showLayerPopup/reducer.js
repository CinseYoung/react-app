import {SHOW, HIDE, AFTERSHOW, AFTERHIDE} from './actions'

export function showLayerPopup(state = { isShow: false, isAfterShow: false }, action) {
  switch (action.type) {
    case SHOW:
      return { ...state, isShow: true }
    case HIDE:
      return { ...state, isShow: false }
    case AFTERSHOW:
      return { ...state, isAfterShow: true }
    case AFTERHIDE:
      return { ...state, isAfterShow: false }
    default:
      return state
  }
}