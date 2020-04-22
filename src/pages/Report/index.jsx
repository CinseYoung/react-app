import React, { Component } from 'react'
import AMap from 'AMap'
import qs from 'qs'
import axios from 'axios'
import { createForm } from 'rc-form'
import { NavBar, List, InputItem, Toast, Picker, DatePicker, WingBlank, ImagePicker, Button, ActivityIndicator } from 'antd-mobile'
import { FormatDate } from 'utils/format'
import styles from './style.less'

const eventTypeData = [
	{label: '路面积水', value: '0'},
	{label: '涵洞积水', value: '1'},
	{label: '堤段巡查', value: '2'}
]
const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)

class ReportWrapper extends Component {

	constructor(props) {
		super(props)
		this.state = {
			describe: '',
			hasError1: false,
			address: '',
			lgtd: '',
			lttd: '',
			reporter: '',
			hasError2: false,
			time: now,
			files: [],
			multiple: false,
			animating: false
		}

		if(process.env.NODE_ENV==='production'){
			if (typeof(cordova)!=='undefined' && cordova.platformId == 'android') {
		    StatusBar.overlaysWebView(false)
		    StatusBar.styleDefault()
	    	StatusBar.backgroundColorByHexString('#ffffff')
			}
		}
	}

	componentDidMount() {
		AMap.plugin('AMap.Geolocation', ()=> {
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
			geolocation.getCurrentPosition((status, result)=> {
				if (status == 'complete') {
					//onComplete(result)
					console.log(result)
					this.setState({
						address: result.formattedAddress,
						lgtd: result.position.lng,
						lttd: result.position.lat
					})
				} else {
					console.log(result)
					//onError(result)
				}
			})
		})
	}
	
	// 错误信息
	onChangeInputItem1 = (describe)=> {
		if (describe == '') {
			this.setState({ hasError1: true })
		} else {
			this.setState({ hasError1: false })
		}
		this.setState({ describe })
	}
	onErrorClick1 = ()=> {
		if (this.state.hasError1) {
			Toast.info('请输入正确的事件描述！')
		}
	}
	onChangeInputItem2 = (reporter)=> {
		if (reporter == '') {
			this.setState({ hasError2: true })
		} else {
			this.setState({ hasError2: false })
		}
		this.setState({ reporter })
	}
	onErrorClick2 = ()=> {
		if (this.state.hasError2) {
			Toast.info('请输入正确的上报人！')
		}
	}

	onChange = (files, type, index)=> {
		console.log(files, type, index)
		this.setState({
			files
		})
	}
	// fomatDate("yyyy-MM-dd hh:mm:ss",new Date())
	handleClickBtn = ()=> {
		let eventType = this.props.form.getFieldValue('eventType')
		let describe = this.state.describe
		let address = this.state.address
		let lgtd = this.state.lgtd
		let lttd = this.state.lttd
		let reporter = this.state.reporter
		let files = this.state.files
		let time = FormatDate("yyyy-MM-dd hh:mm:ss",new Date(this.state.time))

		let imageUrl = ''
		if (files.length != 0) {
			for (var i = 0; i < files.length; i++) {
				imageUrl += `GUIREN${files[i].url}`
			}
		}
		console.log(eventType, describe, address, lgtd, lttd, reporter, imageUrl, time)

		if (eventType == undefined) {
			Toast.info('请选择正确的事件类型！')
			return
		}
		if (describe == '') {
			this.setState({
				hasError1: true
			})
			Toast.info('请输入正确的事件描述！')
			return
		}
		if (reporter == '') {
			this.setState({
				hasError2: true
			})
			Toast.info('请输入正确的上报人！')
			return
		}
		if (address == '') {
			Toast.info('当前位置获取失败，请重试！')
			return
		}
		

		this.setState({ animating: true })
		axios({
			method: 'post',
			url: process.env.APP_URL + '/business/eventreport/add',
			data: qs.stringify({
				eventType: parseInt(eventType[0]),
				eventDes: describe,
				location: address,
				lgtd: parseFloat(lgtd),
				lttd: parseFloat(lttd),
				reporter: reporter,
				reportTime: time,
				image: imageUrl
		  })
		}).then((response)=> {
			console.log(response.data.code == 0)
			if (response.data.code == 0) {
				this.setState({ animating: false })
				Toast.success('上传成功 !!!', 1)
				this.setState({
					describe: '',
					files:[],
					eventDes:'',
					reporter:''
				})
			}else{
				console.log(response)
				this.setState({ animating: false })
				Toast.offline('上传失败，请重试！', 1.5)
			}
		}).catch((error)=> {
			console.log(error)
			this.setState({ animating: false })
			Toast.offline('上传错误，请重试！', 1.5)
		})
	}

	render() {
		const { getFieldProps } = this.props.form
		return (
			<div className={styles.report}>
				<NavBar
					className={styles.navBar}
					mode='light'
					icon={<i className="iconfont icon-back" style={{color: '#666'}}></i>}
					onLeftClick={() => this.props.history.goBack()}
				>
					事件上报
				</NavBar>
				<div className={styles.main}>
					<div className={styles.content}>
						<List>
							<Picker data={eventTypeData} cols={1} {...getFieldProps('eventType')} extra="请选择事件类型" className="forss">
								<List.Item arrow="horizontal">事件类型</List.Item>
							</Picker>
							<InputItem clear placeholder='请输入事件描述' error={this.state.hasError1} onErrorClick={this.onErrorClick1} onChange={this.onChangeInputItem1} value={this.state.describe}>
								事件描述
							</InputItem>
							<InputItem placeholder='正在获取当前定位地址' editable={false} value={this.state.address}>
								事件地址
							</InputItem>
							{/*<InputItem placeholder='正在获取当前定位经度' editable={false} value={this.state.lgtd}>
								经度
							</InputItem>
							<InputItem placeholder='正在获取当前定位纬度' editable={false} value={this.state.lttd}>
								纬度
							</InputItem>*/}
							<InputItem clear placeholder='请输入上报人' error={this.state.hasError2} onErrorClick={this.onErrorClick2} onChange={this.onChangeInputItem2} value={this.state.reporter}>
								上报人
							</InputItem>
							<DatePicker value={this.state.time} onChange={time => this.setState({ time })} minDate={new Date(2019, 7, 1, 0, 0, 0)} maxDate={new Date()}>
								<List.Item arrow="horizontal">上报时间</List.Item>
							</DatePicker>
						</List>
					</div>
					<div>
						<div className='am-list-header'>上传照片</div>
						<WingBlank>
							<ImagePicker
								files={this.state.files}
								onChange={this.onChange}
								onImageClick={(index, fs) => console.log(index, fs)}
								selectable={this.state.files.length < 4}
								multiple={this.state.multiple}
							/>
						</WingBlank>
					</div>
					<div className={styles.WingBlank}>
						<Button type="primary" style={{ backgroundColor: '#4287ff' }} onClick={this.handleClickBtn}>提 交</Button>
					</div>
				</div>
				<div className="toast-example">
					<ActivityIndicator toast text="上传中..." animating={this.state.animating}/>
				</div>
			</div>
		)
	}
}
const Report = createForm()(ReportWrapper)
export default Report