import { SHOWCOLLECTION, HIDECOLLECTION, AFTERSHOWCOLLECTION, AFTERHIDECOLLECTION } from './actions'

export function showCollectionPopup(state = { isShow: false, isAfterShow: false }, action) {
  switch (action.type) {
    case SHOWCOLLECTION:
      return { ...state, isShow: true }
    case HIDECOLLECTION:
      return { ...state, isShow: false }
    case AFTERSHOWCOLLECTION:
      return { ...state, isAfterShow: true }
    case AFTERHIDECOLLECTION:
      return { ...state, isAfterShow: false }
    default:
      return state
  }
}