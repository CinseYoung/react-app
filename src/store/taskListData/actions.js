/*
 * action 类型
*/
export const TASKLISTDATA = 'TASKLISTDATA'

/*
 * action 创建函数
*/
export function setTaskListData(data) {
	return {
		type: TASKLISTDATA,
		data
	}
}