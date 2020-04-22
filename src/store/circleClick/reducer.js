import { DetailsPopup } from './actions'

export function circleClickFn(state = {}, action) {
  switch (action.type) {
    case DetailsPopup:
      return action.data
    default:
      return state
  }
}