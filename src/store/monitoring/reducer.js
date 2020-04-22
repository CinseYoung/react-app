import { MARKER } from './actions'

export function monitoring(state = [], action) {
  switch (action.type) {
    // 全局地图
    case MARKER:
      return action.data
    default:
      return state
  }
}