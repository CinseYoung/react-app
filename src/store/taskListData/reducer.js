import { TASKLISTDATA } from './actions'

export function getTaskListData(state = [], action) {
  switch (action.type) {
    case TASKLISTDATA:
      return action.data
    default:
      return state
  }
}