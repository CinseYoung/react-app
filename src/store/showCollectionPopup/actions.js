/*
 * action 类型
*/
export const SHOWCOLLECTION = 'SHOWCOLLECTION'
export const HIDECOLLECTION = 'HIDECOLLECTION'
export const AFTERSHOWCOLLECTION = 'AFTERSHOWCOLLECTION'
export const AFTERHIDECOLLECTION = 'AFTERHIDECOLLECTION'


/*
 * action 创建函数
*/
export function showCollectionSidebar() {
	return {type: SHOWCOLLECTION }
}
export function hideCollectionSidebar() {
	return {type: HIDECOLLECTION }
}
function afterShowCollectionSidebar() {
	return {type: AFTERSHOWCOLLECTION }
}

// 添加延迟
export function afterShowCollectionSidebarAsync() {
	// thunk插件的作用，这里可以返回函数，
	return dispatch => {
		setTimeout(() => {
			// 异步结束后，手动执行dispatch
			dispatch(afterShowCollectionSidebar())
		}, 40)
	}
}
export function afterHideCollectionSidebarAsync() {
	return {
		type: AFTERHIDECOLLECTION
	}
}
