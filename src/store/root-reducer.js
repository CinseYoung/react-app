import { combineReducers } from 'redux'

import { auth } from './author/reducer'
import { globalMap, satelliteMap, roadNetMap } from './globalMap/reducer'
import { showLayerPopup } from './showLayerPopup/reducer'
import { monitoring } from './monitoring/reducer'
import { showUpdatePopup } from './showUpdatePopup/reducer'
import { circleClickFn } from './circleClick/reducer'
import { showCollectionPopup } from './showCollectionPopup/reducer'
import { isShowVideo } from './showVideo/reducer'
import { addressList } from './addressList/reducer'
import { getTaskListData } from './taskListData/reducer'
import { getGlobalLocation } from './globalLocation/reducer'

// 合并所有 reducer 并且返回
const rootReducer = combineReducers({
	auth,
	globalMap,
	satelliteMap,
	roadNetMap,
	showLayerPopup,
	monitoring,
	showUpdatePopup,
	circleClickFn,
	showCollectionPopup,
	isShowVideo,
	addressList,
	getTaskListData,
	getGlobalLocation
})

export default rootReducer