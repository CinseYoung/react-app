/*
 * action 类型
*/
export const SHOWVIDEO = 'SHOWVIDEO'
export const HIDEVIDEO = 'HIDEVIDEO'


/*
 * action 创建函数
*/
export function showVideo() {
	return { type: SHOWVIDEO }
}

export function hideVideo() {
	return { type: HIDEVIDEO }
}