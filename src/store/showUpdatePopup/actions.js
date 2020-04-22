/*
 * action 类型
*/
export const SHOWUUPPOPUP = 'SHOWUUPPOPUP'
export const HIDEUUPPOPUP = 'HIDEUUPPOPUP'


/*
 * action 创建函数
*/
export function showUpPopup() {
	return { type: SHOWUUPPOPUP }
}

export function hideUpPopup() {
	return { type: HIDEUUPPOPUP }
}
