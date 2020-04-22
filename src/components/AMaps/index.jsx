import React from 'react'
import AMap from 'AMap'
import axios from 'utils/Axios'
import { connect } from 'react-redux'
import { actions } from '@/store'
import YWIcon from 'static/images/icon/YWIcon.png'
import SPIcon from 'static/images/icon/SPIcon.png'
import YLIcon from 'static/images/icon/YLIcon.png'
import WJIcon from 'static/images/icon/WJIcon.png'
import GQIcon from 'static/images/icon/GQIcon.png'
import ZSIcon from 'static/images/icon/ZSIcon.png'
import ZDHIcon from 'static/images/icon/ZDHIcon.png'

const { GMaps, SatelliteMaps, RoadNetMaps } = actions.globalMap
const asyncCircleMarker = actions.monitoring.asyncCircleMarker

// 实例化点标记
function addMarker(map,icon,position) {
	let marker = new AMap.Marker({
		icon: new AMap.Icon({
			image: icon,
			size: new AMap.Size(22, 22),  //图标大小
			imageSize: new AMap.Size(22,22),
			offset: new AMap.Pixel(-11, -22)
		}),
		position: position,
		zooms: [9, 19]
	})
	return marker
}


// 用装饰器简写方式
@connect(
	// 你要state什么属性放到props里
	state => ({ globalMap: state.globalMap },{ monitoring: state.monitoring }),
	// 你要什么方法，放到props里，自动dispatch
	{ GMaps, SatelliteMaps, RoadNetMaps, asyncCircleMarker }
)
export default class AMaps extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			Map: null,
			PointData: [],
			Monitoring: [],
			prevPropMonitor: []
		}
	}
	componentDidMount() {
		this.initData()
	}
	initData(){
		let This = this
		this.initMap()
		axios.ajax({
			url: '/business/ststbprpb/tableData',
			data:{
				isShowLoading: false
			}
		}).then((data)=>{
			This.setState({
				PointData: data
			})
			// 添加监测点
			This.circleMarkerList(this.state.Map)
		})
	}

	// 初始化地图
	initMap = ()=> {
		// 标准矢量地图
		var layer = new AMap.TileLayer({
			visible: true,    //是否可见
			opacity: 1,       //透明度
			zIndex: 0         //叠加层级
		})
		// 卫星地图
		var satellite = new AMap.TileLayer.Satellite({
			visible: true
		})
		// 路网图
		var roadNet = new AMap.TileLayer.RoadNet({
			visible: true
		})

		// 判断页面返回中心点，层级
		let center = [114.1433656, 30.62866]
		let zoom = 15
		if (sessionStorage.getItem('mapCenter') != null) {
			center = sessionStorage.getItem('mapCenter').split(',')
		}
		if (sessionStorage.getItem('mapZoom') != null) {
			zoom = Number(sessionStorage.getItem('mapZoom'))
		}
		let Map = new AMap.Map('map', {
			layers:[layer, satellite, roadNet],
			resizeEnable: true,                 //是否监控地图容器尺寸变化
			zoom: zoom,                         //初始化地图层级
			center: center,                     //初始化地图中心点
			zooms: [9, 20],
			features: ['bg', 'road', 'building'],
			zoomToAccuracy: true,
			animateEnable: true,
			preloadMode: true,
			viewMode: '3D',
			pitchEnable: true,
			showBuildingBlock: true,
			buildingAnimation: true,
			pinch: 45
		})
		Map.setMapStyle('amap://styles/4ff39164ca4e64cb22832a7790a85e88')
		satellite.hide()
		roadNet.hide()
		// 把地图加入到全局的 Redux 里面
		this.props.GMaps(Map)
		this.props.SatelliteMaps(satellite)
		this.props.RoadNetMaps(roadNet)
		this.setState({Map})
		
		// 东西湖边界遮罩
		new AMap.DistrictSearch({
	    extensions: 'all',
	    subdistrict: 0
	  }).search('420112', function(status, result) {
	    // 外多边形坐标数组和内多边形坐标数组
	    var outer = [
	      new AMap.LngLat(-360, 90, true),
	      new AMap.LngLat(-360, -90, true),
	      new AMap.LngLat(360, -90, true),
	      new AMap.LngLat(360, 90, true)
	    ]
	    var holes = result.districtList[0].boundaries
	    var pathArray = [outer]
	    pathArray.push.apply(pathArray, holes)
	    var polygon = new AMap.Polygon({
	      pathL: pathArray,
	      strokeColor: '#00eeff',
	      strokeWeight: 1,
	      fillColor: '#71B3ff',
	      fillOpacity: 0.5
	    })
	    polygon.setPath(pathArray)
	    Map.add(polygon)
	  })

		// 地图移动结束后触发
		Map.on('moveend',function(){
			let mapCenter = `${Map.getCenter().lng},${Map.getCenter().lat}`
			sessionStorage.setItem('mapCenter', mapCenter)   //存入一个值判断
		})
		Map.on('zoomchange',function(){
			let mapZoom = Map.getZoom()
			sessionStorage.setItem('mapZoom', mapZoom)   //存入一个值判断
		})
		
		AMap.plugin(['AMap.ControlBar'], function(){
      // 添加 3D 罗盘控制
      Map.addControl(new AMap.ControlBar({
      	position: {
      		bottom: '22vw',
					left: '-10.5vw'
      	}
    	}))
    })
	}
	// 添加监测点
	circleMarkerList = (map)=> {
		let aMaps = map
		let markerList = []
		let marker = null
		let PointData = this.state.PointData
		for(let i = 0; i < PointData.length; i++){
			let position = []
			position.push(PointData[i].LGTD, PointData[i].LTTD)
			// 外江水位监测点
			if (PointData[i].COMMENTS == 'SW-WJ') {
				marker = addMarker(aMaps,WJIcon,position)
			}
			// 港渠水位监测点
			if (PointData[i].COMMENTS == 'SW-GQ') {
				marker = addMarker(aMaps,GQIcon,position)
			}
			//  渍水监测点
			if ((PointData[i].COMMENTS == 'ZS' || PointData[i].COMMENTS == 'ZS,LED')&&PointData[i].ZSVIDEO==undefined) {
				marker = addMarker(aMaps,ZSIcon,position)
			}
			// 闸站水位监测点
			if ((PointData[i].COMMENTS == 'SW,YL,ZZ' || PointData[i].COMMENTS == 'SW,ZDH,ZZ')&&PointData[i].ZHVIDEO==undefined) {
				// console.log("闸站图表表示");
				// console.log("PointData[i]",PointData[i]);
				marker = addMarker(aMaps,ZDHIcon,position)
			}
			// 管网液位监测点
			if (PointData[i].COMMENTS == 'YW') {
				marker = addMarker(aMaps,YWIcon,position)
			}
			// 气象监测点(雨量)
			if (PointData[i].COMMENTS == 'YL' || PointData[i].COMMENTS == 'YL,WD') {
				marker = addMarker(aMaps,YLIcon,position)
			}
			// 堤防视频监测点
			if (PointData[i].COMMENTS == 'SP'&&PointData[i].STCD.indexOf("D")!==-1) {
				marker = addMarker(aMaps,SPIcon,position)
			}
			// 港渠视频监测点
			if (PointData[i].COMMENTS == 'SP'&&PointData[i].STCD.indexOf("V")!==-1) {
				marker = addMarker(aMaps,SPIcon,position)
			}
			// 渍水视频监测点
			if (PointData[i].ZSVIDEO=='ZSVIDEO') {
				marker = addMarker(aMaps,SPIcon,position)
			}
			// 闸站视频检测点
			if (PointData[i].ZHVIDEO == 'ZHVIDEO') {
				marker = addMarker(aMaps,SPIcon,position)
			}
			// 实例化点标记
			marker.setMap(aMaps)
			// 给每个创建的坐标监测点添加id
			marker.setExtData({id: PointData[i].STCD,COMMENTS: PointData[i].COMMENTS,PointData:PointData[i]})
			markerList.push(marker)
		}
		// 添加到全局
		this.props.asyncCircleMarker(markerList)
		// 先隐藏点，然后通过LayerPopup控制显示
		for(let i = 0;i<markerList.length;i++){
			markerList[i].hide()
		}

	}

	render() {
		return (
			<div id="map"></div>
		)
	}
}
