import {AMAP, SATELLITE, ROADNET} from './actions'

const initialState = {}
// 全局地图
export function globalMap(state = initialState, action) {
  switch (action.type) {
    case AMAP:
      return action.data
    default:
      return state
  }
}

// 卫星地图
export function satelliteMap(state = initialState, action) {
  switch (action.type) {
    case SATELLITE:
      return action.data
    default:
      return state
  }
}

// 路网地图
export function roadNetMap(state = initialState, action) {
  switch (action.type) {
    case ROADNET:
      return action.data
    default:
      return state
  }
}