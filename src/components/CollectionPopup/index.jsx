import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import qs from 'qs'
import axios from 'axios'
import { actions } from '@/store'
import styles from './style.less'

const { hideCollectionSidebar, afterHideCollectionSidebarAsync } = actions.showCollectionPopup

@connect(
  // 你要state什么属性放到props里
  state => ({
  	globalMap: state.globalMap,
  	monitoring: state.monitoring,
		showCollectionPopup: state.showCollectionPopup,
		circleClickFn: state.circleClickFn
	}),
	// 你要什么方法，放到props里，自动dispatch
	{hideCollectionSidebar, afterHideCollectionSidebarAsync}
)
export default class CollectionPopup extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			collectionList: []
		}
	}

	componentDidMount() {
		this.props.onRef(this)
		this.getCollectionList()
	}

	showCollectionMonitor = ()=> {
		let monitoring = this.props.monitoring
		let collectionList = this.state.collectionList
		for (let i = 0; i < collectionList.length; i++) {
			for (let j = 0; j < monitoring.length; j++) {
				let id = monitoring[j].getExtData().id
				if (id === collectionList[i].stcd) {
					monitoring[j].show()
				}
			}
		}
	}

	getCollectionList = ()=> {
		let userID = sessionStorage.getItem('userID')
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'post',
			url: process.env.APP_URL+'/business/StWasR/findSysFocusStation',
			data: qs.stringify({
				userId: userID
		  })
		}).then((response)=> {
			this.setState({
				collectionList: response.data
			},()=>{
				this.showCollectionMonitor()
			})
		}).catch((error)=> {
			console.log(error,'error')
		})
	}

	// 点击隐藏图层弹窗
	handleCilckHidePopup = ()=> {
		this.props.afterHideCollectionSidebarAsync()
		setTimeout(()=>{
			this.props.hideCollectionSidebar()
		},300)
	}
	handleCilckList = (item)=> {
		this.props.afterHideCollectionSidebarAsync()
		setTimeout(()=>{
			this.props.hideCollectionSidebar()
		},300)
		// 弹出点内容，类似搜索
		let searchListID = item.stcd
		let globalMap = this.props.globalMap
		let detailsPopup = document.querySelector('#detailsPopup')
		let circleMarkers = this.props.monitoring
		for (let i = 0; i < circleMarkers.length; i++) {
			let ID = circleMarkers[i].getExtData().id
			if (ID === searchListID) {
				detailsPopup.style.cssText = `bottom: 0px !important;`
				globalMap.setZoom(14)
				globalMap.panTo([circleMarkers[i].getPosition().lng,circleMarkers[i].getPosition().lat])
				circleMarkers[i].setAnimation('AMAP_ANIMATION_DROP')
				// 调用 DetailsPopup 组件里面的 circleClickFn 方法
				this.props.circleClickFn(circleMarkers[i])
			}
		}
	}

	render() {
		return (
			<div className={classnames(styles.collectionPopup, {[`${styles.isLayerPopup}`]: this.props.showCollectionPopup.isShow})}>
				<div className={classnames(styles.layerPopup, {[`${styles.isLayerPopup}`]: this.props.showCollectionPopup.isShow})} onClick={this.handleCilckHidePopup}></div>
				<div className={classnames(styles.sidebar, {[`${styles.isShowSidebar}`]: this.props.showCollectionPopup.isAfterShow})}>
					<div className="am-list-header" style={{ backgroundColor: '#f4f4f4',padding: '2.4vw 4vw 2.4vw'}}>站点收藏</div>
					<ul className={styles.collectionList}>
						{this.state.collectionList.map((item, key) => {
							return <li onClick={()=>{this.handleCilckList(item)}} key={key}>{item.STNM}</li>
						})}
					</ul>
				</div>
			</div>
		)
	}
}
