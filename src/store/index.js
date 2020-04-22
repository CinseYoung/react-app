import * as authorActions from './author/actions'
import * as globalMapActions from './globalMap/actions'
import * as showLayerPopupActions from './showLayerPopup/actions'
import * as monitoringActions from './monitoring/actions'
import * as showUpdatePopupActions from './showUpdatePopup/actions'
import * as circleClickActions from './circleClick/actions'
import * as showCollectionPopupActions from './showCollectionPopup/actions'
import * as showVideoActions from './showVideo/actions'
import * as addressListActions from './addressList/actions'
import * as taskListDataActions from './taskListData/actions'
import * as globalLocationActions from './globalLocation/actions'

export { default } from './store'

export const actions = {
	author: authorActions,
	globalMap: globalMapActions,
	showLayerPopup: showLayerPopupActions,
	monitoring: monitoringActions,
	showUpdatePopup: showUpdatePopupActions,
	circleClick: circleClickActions,
	showCollectionPopup: showCollectionPopupActions,
	showVideo: showVideoActions,
	addressList: addressListActions,
	taskListData: taskListDataActions,
	globalLocation: globalLocationActions
}