/*
 * action 类型
*/
export const DetailsPopup = 'DetailsPopup'

/*
 * action 创建函数
*/
export function circleClickDetailsPopup(data) {
	return {
		type: DetailsPopup,
		data
	}
}