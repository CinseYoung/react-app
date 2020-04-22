import React from 'react'
import AMap from 'AMap'
import { actions } from '@/store'
import { connect } from 'react-redux'
import styles from './style.less'

const setGlobalLocation = actions.globalLocation.setGlobalLocation
var globalLocationRoutePath  =[]

@connect(
	state => ({ globalMap: state.globalMap }),
	{setGlobalLocation}
)
export default class Location extends React.Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.props.setGlobalLocation(this.globalLocation)
	}

	// 全局坐标
  globalLocation = ()=> {
  	if (process.env.NODE_ENV === 'production') {
			window.GaoDe.getCurrentPosition((res) => {
		  	globalLocationRoutePath.push([res.longitude, res.latitude])
		  })
			return globalLocationRoutePath
		}else {
			AMap.plugin('AMap.Geolocation', ()=> {
				let geolocation = new AMap.Geolocation({
					enableHighAccuracy: true,//是否使用高精度定位，默认:true
					timeout: 10000,          //超过10秒后停止定位，默认：5s
					buttonPosition:'RB',    //定位按钮的停靠位置
					buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
					zoomToAccuracy: true   //定位成功后是否自动调整地图视野到定位点
				})
				geolocation.getCurrentPosition((status,result)=>{
					if(status=='complete'){
						globalLocationRoutePath.push([result.position.lng, result.position.lat])
					}else{
						window.console.log(result)
					}
				})
			})
			return globalLocationRoutePath
		}
  }

	handleClick = ()=> {
		let Map = this.props.globalMap
		AMap.plugin('AMap.Geolocation', function () {
			var geolocation = new AMap.Geolocation({
				enableHighAccuracy: true, //是否使用高精度定位，默认:true
				timeout: 10000,           //超过10秒后停止定位，默认：无穷大
				maximumAge: 0,            //定位结果缓存0毫秒，默认：0
				convert: true,            //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
				showButton: false,        //显示定位按钮，默认：true
				buttonPosition: 'LB',     //定位按钮停靠位置，默认：'LB'，左下角
				buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				showMarker: true,         //定位成功后在定位到的位置显示点标记，默认：true
				showCircle: true,         //定位成功后用圆圈表示定位精度范围，默认：true
				panToLocation: true,      //定位成功后将定位到的位置作为地图中心点，默认：true
				zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			})
			Map.addControl(geolocation)
			geolocation.getCurrentPosition(function (status, result) {
				console.log(status, result)
				if (status == 'complete') {
					//onComplete(result)
					console.log(result)
				} else {
					//onError(result)
				}
			})
		})
	}

	render() {
		return (
			<div className={styles.location} onClick={this.handleClick}>
				<i className="iconfont icon-dingwei"></i>
			</div>
		)
	}
}