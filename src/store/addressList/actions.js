/*
 * action 类型
*/
export const ADDRESSLIST = 'ADDRESSLIST'


/*
 * action 创建函数
*/
export function setAddressList(data) {
	return {
		type: ADDRESSLIST,
		data
	}
}