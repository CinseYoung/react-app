import React, { Component } from 'react'
import axios from 'axios'
import qs from 'qs'
import AMap from 'AMap'
import { connect } from 'react-redux'
import { createForm } from 'rc-form'
import { NavBar, List, InputItem, Picker, DatePicker, Button, TextareaItem, WingBlank, ImagePicker, Toast, ActivityIndicator } from 'antd-mobile'
import styles from './style.less'

const weather = ['晴', '阴', '多云', '少云', '小雨', '中雨', '大雨', '阵雨', '雷阵雨', '暴雨', '雾', '霾', '霜', '暴风', '台风', '暴风雪', '大雪', '中雪', '小雪', '雨夹雪', '冰雹', '浮尘', '扬沙']
let district = []
for (let i = 0; i < weather.length; i++) {
	district.push({label: weather[i], value: weather[i]})
}

const unit = ['东山分指挥部', '水口分指挥部', '吕家湾分指挥部', '李家墩分指挥部']
let dikeUnit = []
for (let i = 0; i < unit.length; i++) {
	dikeUnit.push({label: unit[i], value: unit[i]})
}

const eventTypeData = [
	{label: '路面', value: '1'},
	{label: '港渠', value: '2'},
	{label: '外江', value: '3'},
	{label: '涵洞', value: '4'}
]

const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)


@connect(
    // 你要state什么属性放到props里
    state => ({ globalMap: state.globalMap })
)
class ReportWrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			startTime: now,
			endTime: now,
			files: [],
			multiple: false,
			hasError1: false,
			value1: '',
			hasError2: false,
			value2: '',
			hasError3: false,
			value3: '',
			hasError4: false,
			value4: '',
			animating: false,
			lgtd: '',
			lttd: ''

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
		let This = this
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
			geolocation.getCurrentPosition(function (status, result) {
				if (status == 'complete') {
					//onComplete(result)
					console.log(result.position)
					This.setState({
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
	// 提交
	handleClickBtn = ()=> {
		let value1 = this.state.value1
		let value2 = this.state.value2
		let value3 = this.state.value3
		let value4 = this.state.value4
		let files = this.state.files
		let startTime = this.state.startTime
		//let endTime = this.state.endTime
		let dikeUnit = this.props.form.getFieldValue('dikeUnit')
		let district = this.props.form.getFieldValue('district')
		let eventType  = this.props.form.getFieldValue('eventType')
		let count = this.props.form.getFieldValue('count')
		//let situation = this.props.form.getFieldValue('situation')
		console.log(eventType[0],'eventType')
		if (value1.length <= 0) {
			this.setState({
				hasError1: true
			})
			Toast.info('请输入正确的巡查堤段！')
			return
		}
		if (value2.length <= 0) {
			this.setState({
				hasError2: true
			})
			Toast.info('请输入正确的巡查单位！')
			return
		}
		if (value3.length <= 0) {
			this.setState({
				hasError3: true
			})
			Toast.info('请输入正确的带班领导！')
			return
		}
		if (value4.length <= 0) {
			this.setState({
				hasError4: true
			})
			Toast.info('请输入正确的寻堤人员！')
			return
		}
		if (dikeUnit == undefined) {
			Toast.info('请选择正确的堤段单位！')
			return
		}
		if (eventType == undefined) {
			Toast.info('请选择正确的事件类型！')
			return
		}
		if (district == undefined) {
			Toast.info('请选择天气！')
			return
		}
		// 对Date的扩展，将 Date 转化为指定格式的String
		// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
		// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
		// 例子：
		// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
		// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
		Date.prototype.Format = function(fmt) {
			var o = {
				"M+" : this.getMonth()+1,                 //月份
				"d+" : this.getDate(),                    //日
				"h+" : this.getHours(),                   //小时
				"m+" : this.getMinutes(),                 //分
				"s+" : this.getSeconds(),                 //秒
				"q+" : Math.floor((this.getMonth()+3)/3), //季度
				"S"  : this.getMilliseconds()             //毫秒
			}
			if(/(y+)/.test(fmt))
				fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length))
			for(var k in o)
				if(new RegExp("("+ k +")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)))
			return fmt
		}
		var time = new Date(startTime).Format('yyyy-MM-dd hh:mm:ss')
		//var time2 = new Date(endTime).Format('yyyy-MM-dd hh:mm:ss')
		var imageUrl = ''
		let This = this
		if (files.length != 0) {
			for (var i = 0; i < files.length; i++) {
				imageUrl += `GUIREN${files[i].url}`
			}
		}

		console.log(value1, value2, value3, value4, dikeUnit[0], district[0], time, count, imageUrl, This.state.lgtd, This.state.lttd)
		console.log(This.state.lgtd,This.state.lttd,'98552')
		this.setState({ animating: true })
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'post',
			url: process.env.APP_URL+'/business/dikesurveyrecords/add',
			data: qs.stringify({
				inspectDuke: value1,
				inspectUnit: value2,
				schLeader: value3,
				schStaffs: value4,
				dikeUnit: dikeUnit[0],
				eventType: eventType[0],
				weather: district[0],
				reportTime: time,
				record: count,
				image: imageUrl,
				lgtd: This.state.lgtd,
				lttd: This.state.lttd
		  })
		}).then(function (response) {
			console.log(response.data.code == 0)
			if (response.data.code == 0) {
				This.setState({ animating: false })
				Toast.success('上传成功 !!!', 1)
				This.setState({
					files:[],
					value1:'',
					value2:'',
					value3:'',
					value4:''
				})
			}else{
				This.setState({ animating: false })
				Toast.offline('上传失败，请重试！', 1.5)
			}
		}).catch(function (error) {
			console.log(error)
			This.setState({ animating: false })
			Toast.offline('上传错误，请重试！', 1.5)
		})
	}

	onChange = (files, type, index)=> {
		console.log(files, type, index)
		this.setState({
			files
		})
	}
	// 错误信息
	onChangeHasError1 = (value1)=> {
		if (value1.length <= 0) {
			this.setState({
				hasError1: true
			})
		} else {
			this.setState({
				hasError1: false
			})
		}
		this.setState({
			value1
		})
	}
	onErrorClick1 = ()=> {
		if (this.state.hasError1) {
			Toast.info('请输入正确的巡查堤段！')
		}
	}

	onChangeHasError2 = (value2)=> {
		if (value2.length <= 0) {
			this.setState({
				hasError2: true
			})
		} else {
			this.setState({
				hasError2: false
			})
		}
		this.setState({
			value2
		})
	}
	onErrorClick2 = ()=> {
		if (this.state.hasError2) {
			Toast.info('请输入正确的巡查单位！')
		}
	}

	onChangeHasError3 = (value3)=> {
		if (value3.length <= 0) {
			this.setState({
				hasError3: true
			})
		} else {
			this.setState({
				hasError3: false
			})
		}
		this.setState({
			value3
		})
	}
	onErrorClick3 = ()=> {
		if (this.state.hasError3) {
			Toast.info('请输入正确的带班领导！')
		}
	}

	onChangeHasError4 = (value4)=> {
		if (value4.length <= 0) {
			this.setState({
				hasError4: true
			})
		} else {
			this.setState({
				hasError4: false
			})
		}
		this.setState({
			value4
		})
	}
	onErrorClick4 = ()=> {
		if (this.state.hasError4) {
			Toast.info('请输入正确的寻堤人员！')
		}
	}

	render() {
		const { getFieldProps } = this.props.form
		const { files } = this.state
		return (
			<div className={styles.report}>
				<NavBar
					className={styles.navBar}
					mode='light'
					icon={<i className="iconfont icon-back" style={{color: '#666'}}></i>}
					onLeftClick={() => this.props.history.goBack()}
				>
					巡堤查险记录
				</NavBar>
				<div className={styles.main}>
					<div className={styles.content}>
						<List>
							<InputItem clear placeholder='请输入巡查堤段' error={this.state.hasError1} onErrorClick={this.onErrorClick1} onChange={this.onChangeHasError1} value={this.state.value1}>
								巡查堤段
							</InputItem>
							<InputItem clear placeholder='请输入巡查单位' error={this.state.hasError2} onErrorClick={this.onErrorClick2} onChange={this.onChangeHasError2} value={this.state.value2}>
								巡查单位
							</InputItem>
							<InputItem clear placeholder='请输入带班领导' error={this.state.hasError3} onErrorClick={this.onErrorClick3} onChange={this.onChangeHasError3} value={this.state.value3}>
								带班领导
							</InputItem>
							<InputItem clear placeholder='请输入寻堤人员' error={this.state.hasError4} onErrorClick={this.onErrorClick4} onChange={this.onChangeHasError4} value={this.state.value4}>
								寻堤人员
							</InputItem>
							<Picker data={dikeUnit} cols={1} {...getFieldProps('dikeUnit')} extra="请选择堤段单位" className="forss">
								<List.Item arrow="horizontal">堤段单位</List.Item>
							</Picker>
							<Picker data={eventTypeData} cols={1} {...getFieldProps('eventType')} extra="请选择事件类型" className="forss">
								<List.Item arrow="horizontal">事件类型</List.Item>
							</Picker>
							<Picker data={district} cols={1} {...getFieldProps('district')} extra="请选择天气" className="forss">
								<List.Item arrow="horizontal">天气</List.Item>
							</Picker>
							<DatePicker value={this.state.startTime} onChange={startTime => this.setState({ startTime })}>
								<List.Item arrow="horizontal">上报时间</List.Item>
							</DatePicker>
							{/*<DatePicker value={this.state.endTime} onChange={endTime => this.setState({ endTime })}>
								<List.Item arrow="horizontal">结束时间</List.Item>
							</DatePicker>*/}
						</List>
					</div>

					<List renderHeader={() => '巡堤记录'}>
						<TextareaItem {...getFieldProps('count')} clear rows={3} count={300} placeholder='巡堤记录，我的意见是...'/>
					</List>
					{/*<List renderHeader={() => '处理情况'}>
						<TextareaItem {...getFieldProps('situation')} clear rows={3} count={300} placeholder='处理情况，我的意见是...'/>
					</List>*/}

					<div>
						<div className='am-list-header'>上传照片</div>
						<WingBlank>
							<ImagePicker
								files={files}
								onChange={this.onChange}
								onImageClick={(index, fs) => console.log(index, fs)}
								selectable={files.length < 7}
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
