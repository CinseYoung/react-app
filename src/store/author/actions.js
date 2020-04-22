/*
 * action 类型
*/
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'


/*
 * action 创建函数
*/
export function userLogin() {
	return { type: LOGIN }
}

export function userLogout() {
	return { type: LOGOUT }
}
