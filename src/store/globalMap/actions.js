/*
 * action 类型
*/
export const AMAP = 'AMAP'
export const SATELLITE = 'SATELLITE'
export const ROADNET = 'ROADNET'

/*
 * action 创建函数
*/
export function GMaps(data) {
	return {
		type: AMAP,
		data
	}
}
export function SatelliteMaps(data) {
	return {
		type: SATELLITE,
		data
	}
}
export function RoadNetMaps(data) {
	return {
		type: ROADNET,
		data
	}
}