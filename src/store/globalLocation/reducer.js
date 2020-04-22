import { GLOBALLOCATION } from './actions'

export function getGlobalLocation(state = [], action) {
  switch (action.type) {
    case GLOBALLOCATION:
      return action.data
    default:
      return state
  }
}