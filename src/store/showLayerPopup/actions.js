/*
 * action 类型
*/
export const SHOW = 'SHOW'
export const HIDE = 'HIDE'
export const AFTERSHOW = 'AFTERSHOW'
export const AFTERHIDE = 'AFTERHIDE'


/*
 * action 创建函数
*/
export function showSidebar() {
	return { type: SHOW }
}
export function hideSidebar() {
	return { type: HIDE }
}
function afterShowSidebar() {
	return { type: AFTERSHOW }
}

// 添加延迟
export function afterShowSidebarAsync() {
	// thunk插件的作用，这里可以返回函数，
	return dispatch => {
		setTimeout(() => {
			// 异步结束后，手动执行dispatch
			dispatch(afterShowSidebar())
		}, 40)
	}
}
export function afterHideSidebarAsync() {
	return {
		type: AFTERHIDE
	}
}