import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import AMap from 'AMap'
import { Checkbox } from 'antd-mobile'
import { actions } from '@/store'
import MonitorList from 'components/MonitorList'
import styles from './style.less'

let satelliteLayer = new AMap.TileLayer.Satellite({zIndex: 10})
const AgreeItem = Checkbox.AgreeItem

const { hideSidebar, afterHideSidebarAsync } = actions.showLayerPopup

@connect(
  // 你要state什么属性放到props里
  state => ({
		globalMap: state.globalMap,
		satelliteMap: state.satelliteMap,
		roadNetMap: state.roadNetMap,
		showLayerPopup: state.showLayerPopup,
    monitoring: state.monitoring
	}),
	// 你要什么方法，放到props里，自动dispatch
	{ hideSidebar, afterHideSidebarAsync }
)
export default class LayerPopup extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			satelliteLayer: satelliteLayer,
			isNormal: true,
			isSatellite: false,
			defaultCheckedRoad: false,
			defaultCheckedPoint: false
		}
		// 跳转返回判断是不是卫星地图
		setTimeout(()=>{
			let isSatelliteLayer = sessionStorage.getItem('isSatelliteLayer')
			let isCheckedRoad = sessionStorage.getItem('isCheckedRoad')
			let isCheckedPoint = sessionStorage.getItem('isCheckedPoint')
			let globalMap = this.props.globalMap
			let satelliteMap = this.props.satelliteMap
			let roadNetMap = this.props.roadNetMap;
			if (isSatelliteLayer === 'true') {
	    	satelliteMap.show()
	    	this.setState({
		    	isNormal: false,
					isSatellite: true
		    })
			}

			// 判断路网
			if (isCheckedRoad === 'true') {
				roadNetMap.show()
				this.setState({defaultCheckedRoad: true})
			}else{
				roadNetMap.hide()
				this.setState({defaultCheckedRoad: false})
			}
			// 判断地图自带标注
			if (isCheckedPoint === 'true'){
				let features = ['bg', 'road', 'building', 'point']
				globalMap.setFeatures(features)
				this.setState({defaultCheckedPoint: true})
			}else{
				let features = ['bg', 'road', 'building']
				globalMap.setFeatures(features)
				this.setState({defaultCheckedPoint: false})
			}
		},10)
	}

	componentDidMount() {
		// let that = this;
		setTimeout(()=>{
			// that.initData();
		},300);
	}

	initData(){
		// 判断返回页面 监测点开关状态
		let listMap1 = sessionStorage.getItem('listMap1')
		let listMap2 = sessionStorage.getItem('listMap2')
		let listMap3 = sessionStorage.getItem('listMap3')
		let listMap4 = sessionStorage.getItem('listMap4')
		let listMap5 = sessionStorage.getItem('listMap5')
		let listMap6 = sessionStorage.getItem('listMap6')
		let listMap7 = sessionStorage.getItem('listMap7')
		let listMap8 = sessionStorage.getItem('listMap8')
		let listMap9 = sessionStorage.getItem('listMap9')
		let listMap10 = sessionStorage.getItem('listMap10')

		if (listMap1 != null) {
			this.setState({isChecked1: listMap1==='true'?true:false})
		}
		if (listMap2 != null) {
			this.setState({isChecked2: listMap2==='true'?true:false})
		}
		if (listMap3 != null) {
			this.setState({isChecked3: listMap3==='true'?true:false},()=>{console.log("isChecked3",this.state.isChecked3)})
		}
		if (listMap4 != null) {
			this.setState({isChecked4: listMap4==='true'?true:false})
		}
		if (listMap5 != null) {
			this.setState({isChecked5: listMap5==='true'?true:false})
		}
		if (listMap6 != null) {
			this.setState({isChecked6: listMap6==='true'?true:false})
		}
		if (listMap7 != null) {
			this.setState({isChecked7: listMap7==='true'?true:false})
		}
		if (listMap8 != null) {
			this.setState({isChecked8: listMap8==='true'?true:false})
		}
		if (listMap9 != null) {
			this.setState({isChecked9: listMap9==='true'?true:false})
		}
		if (listMap10 != null) {
			this.setState({isChecked10: listMap10==='true'?true:false})
		}

	}
	// 点击隐藏图层弹窗
	handleCilckHidePopup = ()=> {
		this.props.afterHideSidebarAsync()
		setTimeout(()=>{
			this.props.hideSidebar()
		},300)
	}

	// 切换标准矢量地图图层
	changeNormalLayer = ()=> {
		let satelliteMap = this.props.satelliteMap
		satelliteMap.hide()
		this.setState({
	    isNormal: true,
			isSatellite: false
	  })
		sessionStorage.setItem('isSatelliteLayer', false)   //存入一个值判断
	}
	// 切换卫星地图
	changeSatelliteLayer = ()=> {
		let satelliteMap = this.props.satelliteMap
		satelliteMap.show()
	    this.setState({
	    	isNormal: false,
			isSatellite: true
	    })
	    sessionStorage.setItem('isSatelliteLayer', true)    //存入一个值判断
	}
	// 路网
	onChangeLyrRoad = (event)=> {
		let isChecked = event.target.checked
		let roadNetMap = this.props.roadNetMap
		sessionStorage.setItem('isCheckedRoad', isChecked)  //存入一个值判断
		if (isChecked) {
			roadNetMap.show()
			this.setState({defaultCheckedRoad: true})
		}else{
			roadNetMap.hide()
			this.setState({defaultCheckedRoad: false})
		}
	}
	// 地图自带标注
	onChangePoint = (event)=> {
		let isChecked = event.target.checked
		let globalMap = this.props.globalMap
		sessionStorage.setItem('isCheckedPoint', isChecked)  //存入一个值判断
		if (isChecked){
			let features = ['bg', 'road', 'building', 'point']
			globalMap.setFeatures(features)
			this.setState({defaultCheckedPoint: true})
		}else{
			let features = ['bg', 'road', 'building']
			globalMap.setFeatures(features)
			this.setState({defaultCheckedPoint: false})
		}
	}
	render() {
		return (
			<div className={classnames(styles.layerPopupMain, {[`${styles.isLayerPopup}`]: this.props.showLayerPopup.isShow})}>
				<div className={classnames(styles.layerPopup, {[`${styles.isLayerPopup}`]: this.props.showLayerPopup.isShow})} onClick={this.handleCilckHidePopup}></div>
				<div className={classnames(styles.sidebar, {[`${styles.isShowSidebar}`]: this.props.showLayerPopup.isAfterShow})}>
					<div className="am-list-header" style={{ backgroundColor: '#f4f4f4',padding: '2.4vw 4vw 2.4vw'}}>地图切换</div>
					<ul className={styles.switchMap}>
						<li className={styles.item}>
							<span className={styles.title}>标准地图</span>
							<div className={classnames(styles.normal, {[`${styles.active}`]: this.state.isNormal})} onClick={this.changeNormalLayer}></div>
							<div className={styles.mapControl}>
								<AgreeItem data-seed="logId" onChange={this.onChangePoint} checked={this.state.defaultCheckedPoint}>
			            显示标注
			          </AgreeItem>
							</div>
						</li>
						<li className={styles.item}>
							<span className={styles.title}>卫星地图</span>
							<div className={classnames(styles.satellite, {[`${styles.active}`]: this.state.isSatellite})} onClick={this.changeSatelliteLayer}></div>
							<div className={styles.mapControl}>
								<AgreeItem data-seed="logId" onChange={this.onChangeLyrRoad} checked={this.state.defaultCheckedRoad}>
			            显示路网
			          </AgreeItem>
							</div>
						</li>
					</ul>

					<div className="am-list-header" style={{ backgroundColor: '#f4f4f4',padding: '2.4vw 4vw 2.4vw'}}>监测点</div>

					<MonitorList>外江水位监测点</MonitorList>
				</div>
			</div>
		)
	}
}
