import React from 'react'
import styles from './style.less'
import AMap from 'AMap'
import axios from 'axios'
import qs from 'qs'
// import classnames from 'classnames'
import { createForm } from 'rc-form'
//TextareaItem, ImagePicker
import { List, Picker, Toast, TextareaItem } from 'antd-mobile'
import { FormatDate } from 'utils/format'
import locationMarker from 'static/images/marker.png'

class SignInPageWrapper extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			dataSource: 0,
			registerTime: null,
			nowTime: null,
			Map: null,
			addRess: '',
			position: [],
			remark: '',
			remarkListImg: [],
			isShow: false,
			signInType: [{label: '路面', value: '1'},{label: '港渠', value: '2'},{label: '外江', value: '3'},{label: '涵洞', value: '4'},{label: '车辆', value: '5'}],
			licensePlate: [],
			isShowLicensePlate: false
		}
	}
	componentDidMount() {
		let This = this
		this.registerNumber()
		this.setState({ nowTime: this.formDate(new Date()) })
		this.initMap()

		//车辆信息下拉框
		axios.post(process.env.APP_URL + '/business/vehicledetail/carList').then(function (response) {
      console.log(response.data.result,'responseresponse')
      let result = response.data.result
      let licensePlate = []
      for (var i = 0; i < result.length; i++) {
      	licensePlate.push({label: result[i].plateno, value: result[i].id})
      }
     	This.setState({licensePlate})
    }).catch(function (error) {
      console.log(error)
    })
	}
	initMap = ()=> {
		// 标准矢量地图
		var layer = new AMap.TileLayer({
			visible: true, //是否可见
			opacity: 1, //透明度
			zIndex: 0 //叠加层级
		})
		// 判断页面返回中心点，层级
		let center = [114.1433656, 30.62866]
		let zoom = 12
		let Map = new AMap.Map('map', {
			layers: [layer],
			resizeEnable: true, //是否监控地图容器尺寸变化
			zoom: zoom, //初始化地图层级
			zooms: [8, 19],
			animateEnable: true,
			center: center //初始化地图中心点
		})
		this.setState({ Map }, () => {
			this.initLocation(this.state.Map)
		})
	}
	initLocation = (Map)=> {
		let That = this
		AMap.plugin('AMap.Geolocation', function() {
			let geolocation = new AMap.Geolocation({
				enableHighAccuracy: true, //是否使用高精度定位，默认:true
				timeout: 10000, //超过10秒后停止定位，默认：无穷大
				maximumAge: 0, //定位结果缓存0毫秒，默认：0
				convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
				showButton: false, //显示定位按钮，默认：true
				buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
				buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
				showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
				panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
				zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			})
			Map.addControl(geolocation)
			geolocation.getCurrentPosition(function(status, result) {
				if (status == 'complete') {
					That.onComplete(result, Map)
				} else {
					That.onError(result)
				}
			})
		})
	}
	onComplete = (data, Map)=> {
		var str = []
		str.push('定位结果：' + data.position)
		str.push('定位类别：' + data.location_type)
		if (data.accuracy) {
			str.push('精度：' + data.accuracy + ' 米')
		} //如为IP精确定位结果则没有精度信息
		let marker = this.addMarker(Map, locationMarker, data.position)
		// 实例化点标记
		marker.setMap(Map)
		let lnglatXY = [data.position.getLng(), data.position.getLat()] //已知点坐标
		this.setState({ position: lnglatXY })
		this.regeocoder(lnglatXY, Map)
	}
	// 实例化点标记
	addMarker = (map, icon, position)=> {
		let marker = new AMap.Marker({
			icon: new AMap.Icon({
				image: icon,
				size: new AMap.Size(25, 30), //图标大小
				imageSize: new AMap.Size(25, 30),
				offset: new AMap.Pixel(-12, -30)
			}),
			position: position,
			zooms: [11, 20]
		})
		return marker
	}
	onError = (data)=> {
		console.log('定位失败', data)
		this.setState({ nowTime: this.formDate(new Date()) })
		this.initMap()
	}
	onChangeRemarkImage = (files, type, index) => {
    console.log(files, type, index)
    this.setState({
      remarkListImg: files
    })
  }
	regeocoder = (loc)=> {
		let that = this
		//逆地理编码
		var geocoder = new AMap.Geocoder({
			radius: 1000,
			extensions: 'all'
		})
		geocoder.getAddress(loc, function(status, result) {
			if (status === 'complete' && result.info === 'OK') {
				console.dir(result)
				that.geocoderCallBack(result, loc)
			}
		})
	}
	geocoderCallBack = (data)=> {
		var address = data.regeocode.formattedAddress //返回地址描述
		this.setState({ addRess: address })
	}
	formDate = (date)=> {
		let Time = new Date(date)
		let year = Time.getFullYear()
		let month = Time.getMonth() + 1
		let day = Time.getDate()
		let newDay
		let newMonth
		if (day < 10) {
			newDay = '0' + day
		} else {
			newDay = day
		}
		if (month < 10) {
			newMonth = '0' + month
		} else {
			newMonth = month
		}
		return year + '年' + newMonth + '月' + newDay + '日'
	}
	formDateHour = (date) =>  {
		let Time = new Date(date)
		let hour = Time.getHours()
		let min = Time.getMinutes()
		let newhour
		let newmin
		if (hour < 10) {
			newhour = '0' + hour
		} else {
			newhour = hour
		}
		if (min < 10) {
			newmin = '0' + min
		} else {
			newmin = min
		}
		return newhour + ':' + newmin
	}
	handleChangePicker = (val)=> {
		if (val[0] == 5) {
			this.setState({ isShowLicensePlate: true })
		}else {
			this.setState({ isShowLicensePlate: false })
		}
	}
	// 人员签到次数
	registerNumber = ()=> {
    let userID = sessionStorage.getItem('userID')
    let dataSource = []
		axios.post(process.env.APP_URL + '/business/fhsignininfo/tableData').then((response)=> {
			let resultData = response.data
			console.log(resultData)
			let time = FormatDate("yyyy-MM-dd hh:mm:ss", new Date())
			for (let i = 0; i < resultData.length; i++) {
				if (resultData[i].userId == userID && resultData[i].tm.substr(0,10) == time.substr(0,10)) {
					dataSource.push(resultData[i])
				}
			}
			this.setState({dataSource: dataSource.length})
		}).catch(function(error) {
			console.log(error)
		})
	}
	// 提交签到
	handleClcikSign = ()=> {
		let This = this
		let signInType = this.props.form.getFieldValue('signInType')
		let licensePlate = this.props.form.getFieldValue('licensePlate')
		let position = this.state.position
		let time = FormatDate("yyyy-MM-dd hh:mm:ss",new Date())
		let remark  = this.state.remark
		let userID = sessionStorage.getItem('userID')
		let currentTime = new Date
		
		if (this.state.registerTime !== null) {
			let s1 = this.state.registerTime.getTime(), s2 = currentTime.getTime()
			let total = (s2 - s1) / 1000
			console.log(total,'total')
			if (total < 60) {
				Toast.info('签到太频繁了，过会再签到吧！', 2)
				return
			}
		}
		
		if(signInType === undefined){
			Toast.offline("请选择签到类型",2)
			return
		}
		if (signInType[0] == 5 && licensePlate === undefined) {
			Toast.offline("请选择车牌号",2)
			return
		}
		if (signInType[0] == 5) {
			// 车辆签到
			axios({
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				method: 'post',
				url: process.env.APP_URL+'/business/fhcarsignininfo/add',
				data: qs.stringify({
					carId: licensePlate[0],
					tm: time,
					lgtd: position[0],
					lttd: position[1],
					remark: remark
			  })
			}).then(function (response) {
				Toast.success('签到成功！', 1)
				let date = new Date()
				This.setState({registerTime: date})
				console.log(response,'response')
			}).catch(function (error) {
				console.log(error,'error')
			})
		}else {
			// 人员签到
			axios({
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				method: 'post',
				url: process.env.APP_URL+'/business/fhsignininfo/add',
				data: qs.stringify({
					userId: userID,
					tm: time,
					lgtd: position[0],
					lttd: position[1],
					type: signInType[0],
					remark: remark
			  })
			}).then(function (response) {
				Toast.success('签到成功！', 1)
				let date = new Date()
				This.setState({registerTime: date})
				console.log(response,'response')
			}).catch(function (error) {
				console.log(error,'error')
			})
		}
	}

	render() {
		const { getFieldProps } = this.props.form;
		return (
			<div className={styles.signInPage}>
				<div className={styles.timeAndCompany}>
					<div className={styles.signInTime}>
						<i className="iconfont icon-shijian"></i>
						签到时间：
						{this.state.nowTime}
					</div>
					<div className={styles.locationTitle}>
						<div className={styles.left}><i className="iconfont icon-qiandao"></i>定位位置：</div>
						<div className={styles.right}>{this.state.addRess}</div>
					</div>
				</div>
				<div className={styles.signDiv}>
					<div className={styles.location}>
						<div id="map" className={styles.map}></div>
					</div>
					<List>
            <Picker data={this.state.signInType} cols={1} {...getFieldProps('signInType')} extra="请选择签到类型" className="forss" onOk={this.handleChangePicker}>
              <List.Item id="baseValue2"  arrow="horizontal">签到类型</List.Item>
            </Picker>
          </List>
          {
          	this.state.isShowLicensePlate ? (
		          <List>
		            <Picker data={this.state.licensePlate} cols={1} {...getFieldProps('licensePlate')} extra="请选择车牌号" className="forss" onOk={this.handleChangeLicensePlate}>
		              <List.Item id="baseValue2"  arrow="horizontal">车牌号</List.Item>
		            </Picker>
		          </List>
	          ): null
	        }
	        <div className={styles.textareaItem}>
						<TextareaItem value={this.state.remark} clear rows={4}  placeholder='请输入备注' onChange={(value)=>this.setState({remark:value})}/>
					</div>
					<div className={styles.signActive}>
						{
							this.state.addRess && this.state.addRess.length > 0 ? (
								<div className={styles.signTitle} onClick={this.handleClcikSign}>
									<div className={styles.content}>
										<span>签到</span>
										<span className={styles.time}>{this.formDateHour(new Date)}</span>
									</div>
								</div>
							):(
								<div className={styles.signTitle} onClick={()=>{Toast.info("正在定位，请稍等")}}>
									<div className={styles.content}>
										<span>签到</span>
										<span className={styles.time}>{this.formDateHour(new Date)}</span>
									</div>
								</div>
							)
						}
					</div>
					{
						this.state.dataSource > 0 ? (
							<div className={styles.info}>
								你今日已签到{this.state.dataSource}次
							</div>
						):(
							<div className={styles.info}>你今日还没签到</div>
						)
					}
				</div>
				{/*弹窗*/}
				{/*<div className={classnames(styles.signInContentPopup, {[`${styles.isShow}`]: this.state.isShow})}>
					<div className={styles.signInTime}>
						<i className="iconfont icon-shijian"></i>
						签到时间：
						{this.state.nowTime}
					</div>
					<div className={styles.locationTitle}>
						<div className={styles.left}><i className="iconfont icon-qiandao"></i>定位位置：</div>
						<div className={styles.right}>{this.state.addRess}</div>
					</div>
					<div className={styles.remarkDiv}>
						<div className={styles.textareaItem}>
							<TextareaItem value={this.state.remark} clear rows={4}  placeholder='请输入备注' onChange={(value)=>this.setState({remark:value})}/>
						</div>
						<div className={styles.uploadImg}>
							<ImagePicker
								files={this.state.remarkListImg}
								onChange={this.onChangeRemarkImage}
								selectable={this.state.remarkListImg.length < 3}
								accept="image/gif,image/jpeg,image/jpg,image/png"
								capture="camera"
							/>
						</div>
					</div>
					<div className={styles.signInSubmitBtn}>
						<Button onClick={()=>this.setState({isShow:false})}>取消</Button>
						<Button type="primary">提交</Button>
					</div>
				</div>*/}
			</div>
		)
	}
}
const SignInPage = createForm()(SignInPageWrapper)
export default SignInPage