/*
 * action 类型
*/
export const GLOBALLOCATION = 'GLOBALLOCATION'

/*
 * action 创建函数
*/
export function setGlobalLocation(data) {
	return {
		type: GLOBALLOCATION,
		data
	}
}