import React from 'react'
import AMap from 'AMap'
import Axios from 'utils/Axios'
import axios from 'axios'
import qs from 'qs'
import { actions } from '@/store'
import { connect } from 'react-redux'
import { List, Switch } from 'antd-mobile'
import styles from './style.less'

const { GMaps, RoadNetMaps, SatelliteMaps } = actions.globalMap
const asyncCircleMarker = actions.monitoring.asyncCircleMarker

// 用装饰器简写方式
@connect(
	// 你要state什么属性放到props里
	state => ({ monitoring: state.monitoring }),
	// 你要什么方法，放到props里，自动dispatch
   { GMaps, SatelliteMaps, RoadNetMaps, asyncCircleMarker }
)
export default class MonitorList extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			Monitoring: [],
			prevPropMonitor: [],
			collectionList: [],
			checked0: true,
			checked1: false,
			checked2: false,
			checked3: false,
			checked4: false,
			checked5: false,
			checked6: false,
			checked7: false,
			checked8: false,
			checked9: false,
			checked10:false,
			checked11:false
		}
	}

	static getDerivedStateFromProps(nextProps,nextState){
		if (nextProps.monitoring.length !== nextState.prevPropMonitor.length) {
			return {
				Monitoring: nextProps.monitoring,
				prevPropMonitor: nextProps.monitoring
			}
		}
		// 否则，对于state不进行任何操作,
		// 一开始返回false,但是点击其他页面在返回后,长度是相等的，所以不会在渲染，
		// 所以返回后标记图标不显示
		return {
			Monitoring: nextProps.monitoring,
			prevPropMonitor: nextProps.monitoring
		}
	}

	componentDidMount() {
		this.getCollectionList()
		this.backInitData()
		Axios.ajax({
			url: '/business/ststbprpb/tableData',
			data:{
				isShowLoading: false
			}
		}).then(()=>{
			setTimeout(()=>{
				this.isShowMonitor()
			},300)
		})
	}
	backInitData(){
		// 判断返回页面 监测点开关状态
		let listMap0 = sessionStorage.getItem('listMap0')
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
		let listMap11 = sessionStorage.getItem('listMap11')
		
		if (listMap0 != null) {
			this.setState({checked0: listMap0==='true'?true:false})
		}
		if (listMap1 != null) {
			this.setState({checked1: listMap1==='true'?true:false})
		}
		if (listMap2 != null) {
			this.setState({checked2: listMap2==='true'?true:false})
		}
		if (listMap3 != null) {
			this.setState({checked3: listMap3==='true'?true:false})
		}
		if (listMap4 != null) {
			this.setState({checked4: listMap4==='true'?true:false})
		}
		if (listMap5 != null) {
			this.setState({checked5: listMap5==='true'?true:false})
		}
		if (listMap6 != null) {
			this.setState({checked6: listMap6==='true'?true:false})
		}
		if (listMap7 != null) {
			this.setState({checked7: listMap7==='true'?true:false})
		}
		if (listMap8 != null) {
			this.setState({checked8: listMap8==='true'?true:false})
		}
		if (listMap9 != null) {
			this.setState({checked9: listMap9==='true'?true:false})
		}
		if (listMap10 != null) {
			this.setState({checked10: listMap10==='true'?true:false})
		}
		if (listMap11 != null) {
			this.setState({checked11: listMap11==='true'?true:false})
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
			})
		}).catch((error)=> {
			console.log(error,'error')
		})
	}

	isShowMonitor = ()=> {
		let Monitoring = this.state.Monitoring
		for (let i = 0; i < Monitoring.length; i++) {
			let COMMENTS = Monitoring[i].getExtData().COMMENTS
			// let id: PointData[i].STCD
			let stcd = Monitoring[i].getExtData().id
			let PointData = Monitoring[i].getExtData().PointData
			if(this.state.checked11){
				Monitoring[i].setLabel({
					offset: new AMap.Pixel(0, 32),  //设置文本标注偏移量
					content:`<div style="font-size: 14px;color:#000;">${stcd}</div>`, //设置文本标注内容
					direction: 'bottom' //设置文本标注方位
				});
			}
			if(!this.state.checked11){
				Monitoring[i].setLabel(null)
			}

			// 外江水位监测点
			if (COMMENTS == 'SW-WJ') {
				if (this.state.checked1) {
					Monitoring[i].show()
				}else{
					Monitoring[i].hide()
				}
			}
			// 港渠水位监测点
			if (COMMENTS == 'SW-GQ') {
				if (this.state.checked2) {
					Monitoring[i].show()
				}else{
					Monitoring[i].hide()
				}
			}
			// 闸站水位监测点
			if ((COMMENTS == 'SW,YL,ZZ' || COMMENTS == 'SW,ZDH,ZZ')&&PointData.ZHVIDEO==undefined) {
				if (this.state.checked3) {
					Monitoring[i].show()
				}else{
					Monitoring[i].hide()
				}
			}
			//  渍水监测点
			if ((COMMENTS == 'ZS' ||COMMENTS == 'ZS,LED')&&PointData.ZSVIDEO==undefined){
				if (this.state.checked4) {
					Monitoring[i].show()
				}else{
					Monitoring[i].hide()
				}
			}
			// 管网液位监测点
			if (COMMENTS == 'YW') {
				if (this.state.checked5) {
					Monitoring[i].show()
				}else{
					Monitoring[i].hide()
				}
			}
			// 气象监测点(雨量)
			if (COMMENTS == 'YL' || COMMENTS == 'YL,WD') {
				if (this.state.checked6) {
					Monitoring[i].show()
				}else{
					Monitoring[i].hide()
				}
			}
			// 堤防视频监测点
			if (COMMENTS == 'SP'&&stcd.indexOf("D")!==-1) {
				if (this.state.checked7) {
					Monitoring[i].show()
				}else{
					Monitoring[i].hide()
				}
			}
			// 港渠视频监测点
			if (COMMENTS == 'SP'&&stcd.indexOf("V")!==-1) {
				if (this.state.checked8) {
					Monitoring[i].show()
				}else{
					Monitoring[i].hide()
				}
			}
			// 闸站视频检测点
			if (PointData.ZHVIDEO == 'ZHVIDEO'){
				if (this.state.checked9) {
					Monitoring[i].show()
				}else{
					Monitoring[i].hide()
				}
			}
			// 渍水视频监测点
			if (PointData.ZSVIDEO=="ZSVIDEO") {
				if (this.state.checked10) {
					Monitoring[i].show()
				}else{
					Monitoring[i].hide()
				}
			}
		}
		// 收藏监测点
		if (this.state.checked0) {
			let collectionList = this.state.collectionList
			for (let i = 0; i < collectionList.length; i++) {
				for (let j = 0; j < Monitoring.length; j++) {
					let id = Monitoring[j].getExtData().id
					if (id === collectionList[i].stcd) {
						Monitoring[j].show()
					}
				}
			}
		}else {
			let collectionList = this.state.collectionList
			for (let i = 0; i < collectionList.length; i++) {
				for (let j = 0; j < Monitoring.length; j++) {
					let id = Monitoring[j].getExtData().id
					if (id === collectionList[i].stcd) {
						Monitoring[j].hide()
					}
				}
			}
		}
	}
	newisShowMonitor = ()=> {
		// this.setState({checked: this.props.isChecked})
		let Monitoring = this.state.Monitoring
		let name = this.props.name
		let name2 = this.props.name2
		// let name3 = this.props.name3
		if (name2 === undefined) {
			name2 = name
		}
		for (let i = 0; i < Monitoring.length; i++) {
			let COMMENTS = Monitoring[i].getExtData().COMMENTS
			if (COMMENTS == name || COMMENTS == name2) {
				if (this.props.isChecked) {
					Monitoring[i].show()
				}else{
					Monitoring[i].hide()
				}
			}
		}
	}
	onChangeChecked = (TYPE,type,value)=> {
		let backValue = !value;
		  //存入一个值判断
		if(TYPE=='listMap3'){
			this.setState({
			[type]: backValue
			},()=>{
				if (this.state.checked3) {
					sessionStorage.setItem('listMap9', 'false');   //存入一个值判断
					sessionStorage.setItem('listMap3', 'true');   //存入一个值判断
					this.setState({checked9: false},()=>{
						this.isShowMonitor();
					})
				}else{
					sessionStorage.setItem('listMap3', 'false');
				}
				this.isShowMonitor();
			})

		}else if(TYPE=='listMap4'){
			this.setState({
				[type]: backValue
			},()=>{
				if (this.state.checked4) {
					sessionStorage.setItem('listMap10', 'false');   //存入一个值判断
					sessionStorage.setItem('listMap4', 'true');   //存入一个值判断
					this.setState({checked10: false},()=>{
						this.isShowMonitor();
					})
				}else{
					sessionStorage.setItem('listMap4', 'false');
				}
				this.isShowMonitor();
			})

		}else if(TYPE=='listMap9'){
			this.setState({
				[type]: backValue
			},()=>{
				if (this.state.checked9) {
					sessionStorage.setItem('listMap3', 'false');   //存入一个值判断
					sessionStorage.setItem('listMap9', 'true');   //存入一个值判断
					this.setState({checked3: false},()=>{
						this.isShowMonitor();
					})
				}else{
					sessionStorage.setItem('listMap9', 'false');
				}
				this.isShowMonitor();
			})

		}else if(TYPE=='listMap10'){
			this.setState({
				[type]: backValue
			},()=>{
				if (this.state.checked10) {
					sessionStorage.setItem('listMap4', 'false');   //存入一个值判断
					sessionStorage.setItem('listMap10', 'true');   //存入一个值判断
					this.setState({checked4: false},()=>{
						this.isShowMonitor();
					})
				}else{
					sessionStorage.setItem('listMap10', 'false');
				}
				this.isShowMonitor();
			})

		}else{
			this.setState({[type]: backValue},()=>{this.isShowMonitor()})
			sessionStorage.setItem(TYPE,backValue )
		}
	}
	newonChangeChecked = ()=> {
		let Monitoring = this.state.Monitoring
		let name = this.props.name
		let name2 = this.props.name2
		let name3 = this.props.name3
		if (name2 === undefined) {
			name2 = name
		}
		// name='SW,ZDH,ZZ' name3='checked3'
		//name='ZS' name2="ZS,LED" name3='checked4'
		let setValue3
		let setValue4
		let setValue9
		let setValue10
		let setValueOther
		for (let i = 0; i < Monitoring.length; i++) {
			let COMMENTS = Monitoring[i].getExtData().COMMENTS
			if (COMMENTS == name || COMMENTS == name2) {
				if(name3=='checked3'){
					if (this.state.checked) {
						setValue3 = this.state.checked
						Monitoring[i].hide()
					}else{
						setValue3 = !this.state.checked
						Monitoring[i].show()
					}
				}else if(name3=='checked4'){
					if (this.state.checked) {
						setValue4 = this.state.checked
						Monitoring[i].hide()
					}else{
						setValue4 = !this.state.checked
						Monitoring[i].show()
					}
				}else if(name3=='checked9'){
					if (this.state.checked) {
						setValue9 = this.state.checked
						Monitoring[i].hide()
					}else{
						setValue9 = !this.state.checked
						Monitoring[i].show()
					}
				}else if(name3=='checked10'){
					if (this.state.checked) {
						setValue10 = this.state.checked
						Monitoring[i].hide()
					}else{
						setValue10 = !this.state.checked
						Monitoring[i].show()
					}
				}else{
					if (this.state.checked) {
						setValueOther = this.state.checked
						Monitoring[i].hide()
					}else{
						setValueOther = !this.state.checked
						Monitoring[i].show()
					}
				}
			}
		}
		if(setValue3){
			sessionStorage.setItem('listMap9', 'false')   //存入一个值判断
		}else{
			sessionStorage.setItem('listMap9', 'true')   //存入一个值判断
		}
		if(setValue4){
			sessionStorage.setItem('listMap10', 'false')   //存入一个值判断
		}else{
			sessionStorage.setItem('listMap10', 'true')   //存入一个值判断
		}
		if(setValue9){
			sessionStorage.setItem('listMap3', 'false')   //存入一个值判断
		}else{
			sessionStorage.setItem('listMap3', 'true')   //存入一个值判断
		}
		if(setValue10){
			sessionStorage.setItem('listMap4', 'false')   //存入一个值判断
		}else{
			sessionStorage.setItem('listMap4', 'true')   //存入一个值判断
		}
		if(setValueOther){
			sessionStorage.setItem(this.props.title, !this.state.checked)   //存入一个值判断
		}else{
			sessionStorage.setItem(this.props.title, !this.state.checked)
		}

		// this.setState({checked: !this.state.checked});
	}

	render() {
		return (
			<List className={styles.monitorList}>
				<List.Item extra={<Switch checked={this.state.checked0} onChange={()=>this.onChangeChecked('listMap0','checked0',this.state.checked0)} color="#4287ff"/>}>
					收藏监测点
				</List.Item>
				<List.Item extra={<Switch checked={this.state.checked1} onChange={()=>this.onChangeChecked('listMap1','checked1',this.state.checked1)} color="#4287ff"/>}>
					外江水位监测点
				</List.Item>
				<List.Item extra={<Switch checked={this.state.checked2} onChange={()=>this.onChangeChecked('listMap2','checked2',this.state.checked2)} color="#4287ff"/>}>
					港渠水位监测点
				</List.Item>
				<List.Item extra={<Switch checked={this.state.checked3} onChange={()=>this.onChangeChecked('listMap3','checked3',this.state.checked3)} color="#4287ff"/>}>
					闸站水位监测点
				</List.Item>
				<List.Item extra={<Switch checked={this.state.checked4} onChange={()=>this.onChangeChecked('listMap4','checked4',this.state.checked4)} color="#4287ff"/>}>
					渍水监测点
				</List.Item>
				<List.Item extra={<Switch checked={this.state.checked5} onChange={()=>this.onChangeChecked('listMap5','checked5',this.state.checked5)} color="#4287ff"/>}>
					管网液位监测点
				</List.Item>
				<List.Item extra={<Switch checked={this.state.checked6} onChange={()=>this.onChangeChecked('listMap6','checked6',this.state.checked6)} color="#4287ff"/>}>
					气象监测点
				</List.Item>
				<List.Item extra={<Switch checked={this.state.checked7} onChange={()=>this.onChangeChecked('listMap7','checked7',this.state.checked7)} color="#4287ff"/>}>
					堤防视频监测点
				</List.Item>
				<List.Item extra={<Switch checked={this.state.checked8} onChange={()=>this.onChangeChecked('listMap8','checked8',this.state.checked8)} color="#4287ff"/>}>
					港渠视频监测点
				</List.Item>
				<List.Item extra={<Switch checked={this.state.checked9} onChange={()=>this.onChangeChecked('listMap9','checked9',this.state.checked9)} color="#4287ff"/>}>
					闸站视频监测点
				</List.Item>
				<List.Item extra={<Switch checked={this.state.checked10} onChange={()=>this.onChangeChecked('listMap10','checked10',this.state.checked10)} color="#4287ff"/>}>
					渍水视频监测点
				</List.Item>
				<List.Item extra={<Switch checked={this.state.checked11} onChange={()=>this.onChangeChecked('listMap11','checked11',this.state.checked11)} color="#4287ff"/>}>
					显示标记STCD
				</List.Item>

				{/*<List.Item extra={<Switch checked={this.state.checked} onChange={this.onChangeChecked} color="#4287ff"/>}>*/}
					{/*{this.props.children}*/}
				{/*</List.Item>*/}
			</List>
		)
	}
}
