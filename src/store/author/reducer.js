import { LOGIN, LOGOUT } from './actions'

export function auth(state = { isAuth: false }, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, isAuth: true }
    case LOGOUT:
      return { ...state, isAuth: false }
    default:
      return state
  }
}