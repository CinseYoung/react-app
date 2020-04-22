/*
 * action 类型
*/
export const MARKER = 'MARKER'

/*
 * action 创建函数
*/
export function circleMarker(data) {
	return {
		type: MARKER,
		data
	}
}
function circleMarkerFn(data) {
	return {
		type: MARKER,
		data
	}
}
// 异步 axios数据
export function asyncCircleMarker(data) {
	// thunk插件的作用，这里可以返回函数，
	return dispatch => {
		dispatch(circleMarkerFn(data))
	}
}