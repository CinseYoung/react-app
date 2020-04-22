import { SHOWVIDEO, HIDEVIDEO } from './actions'

export function isShowVideo(state = { isShowVideo: false }, action) {
  switch (action.type) {
    case SHOWVIDEO:
      return { ...state, isShowVideo: true }
    case HIDEVIDEO:
      return { ...state, isShowVideo: false }
    default:
      return state
  }
}