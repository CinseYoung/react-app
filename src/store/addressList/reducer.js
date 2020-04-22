import { ADDRESSLIST } from './actions'

export function addressList(state = [], action) {
  switch (action.type) {
    case ADDRESSLIST:
      return action.data
    default:
      return state
  }
}