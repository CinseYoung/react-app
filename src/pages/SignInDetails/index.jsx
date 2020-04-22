import React from 'react'
import AMap from 'AMap'
import { NavBar } from 'antd-mobile'
import styles from './style.less'

export default class SignInDetails extends React.Component {

	constructor(props) {
		super(props)
		// 修改安卓 StatusBar 颜色
		if (process.env.NODE_ENV === 'production') {
			if (typeof cordova !== 'undefined' && cordova.platformId == 'android') {
				StatusBar.overlaysWebView(false)
				StatusBar.styleDefault()
				StatusBar.backgroundColorByHexString('#ffffff')
			}
		}
	}
	componentDidMount() {
		this.initMap()
	}

	// 初始化地图
	initMap = ()=> {
		let lnglat = this.props.location.query.lnglat
		console.log(lnglat)
		let aMap = new AMap.Map("map", {
    	resizeEnable: true,
    	center: lnglat,
    	zoom: 15
    })
		let marker
    if(!marker){
      marker = new AMap.Marker()
      aMap.add(marker)
    }
    marker.setPosition(lnglat)
	}

	render() {
		return (
			<div className={styles.signInDetails}>
				<NavBar
					className={styles.navBar}
					mode="light"
					icon={<i className="iconfont icon-back"
					style={{ color: '#666' }}></i>}
					onLeftClick={() => this.props.history.goBack()}>
					签到详情
				</NavBar>
				<div id='map' className={styles.container}></div>
				<div className={styles.sidebar}>
					<h3>{this.props.location.query.name}</h3>
					<h4><i className="iconfont icon-shijian"></i>{this.props.location.query.time}</h4>
					<p><i className="iconfont icon-qiandao"></i>{this.props.location.query.address}</p>
				</div>
			</div>
		)
	}
}