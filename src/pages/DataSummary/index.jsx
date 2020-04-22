import React from 'react'
import { ActionSheet, NavBar } from 'antd-mobile'
import DataSummaryList from 'components/DataSummaryList'
import axios from 'utils/Axios'
import styles from './style.less'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
let wrapProps
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault()
  }
}

export default class DataSummary extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			title: '雨量',
      clicked: 'none',
      nitialPage: 0,
			waterLevel:[],
			waterLogging:[],
			level:[],
			rainFall:[],
			zhData:[],
			startValue: 0
    }
	}
	componentDidMount(){
		let grossTab = sessionStorage.getItem('dataSummaryTab')? sessionStorage.getItem('dataSummaryTab'):'雨量'
		console.log(grossTab)
	  if(grossTab == '外江水位') {
			this.initData('/business/waterpotential/getOuterUnusualWaterLevel',"waijiang")
		} else if(grossTab == '港渠水位') {
			this.initData('/business/waterpotential/getInnerUnusualWaterLevel')
		} else if(grossTab == '闸站水位') {
			this.zhDataMethod()
		} else if (grossTab == '渍水') {
		 this.waterLoggingMethod()
		} else if (grossTab == '液位') {
			this.levelMethod()
		} else if (grossTab == '雨量') {
		  this.rainFallMethod()
		} else {
			this.initData('/business/waterpotential/getOuterUnusualWaterLevel',"waijiang")
		}
		this.setState({title: grossTab})
	}
	
	showActionSheet = () => {
    const BUTTONS = ['雨量', '渍水', '外江水位', '港渠水位', '闸站水位', '液位', '取消'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      message: '请选择相关的数据查询',
      maskClosable: true,
      'data-seed': 'logId',
      wrapProps
    },
    (buttonIndex) => {
    	if (buttonIndex != BUTTONS.length-1) {
    		this.handleChangeTab(BUTTONS[buttonIndex])
    		this.setState({title: BUTTONS[buttonIndex]})
    	}
      this.setState({ clicked: BUTTONS[buttonIndex] })
    })
  }
	// 港渠水位
  initData = (url,type)=> {
		let that = this;
		that.setState({waterLevel:[]});
		axios.ajax({
			url: url,
			data:{
				isShowLoading: false
			}
		}).then((data)=>{
			console.log(data,'datadata')
			let waterLogging = []
			if(type&&type=="waijiang") {
				waterLogging = data.result.filter((item) => {
					return item.STTP !== 'DD'
				})
			}else{
				waterLogging = data.result
			}
			waterLogging&&waterLogging.map((item)=>{
				if(item.WPTN&&item.WPTN.indexOf("4")!==-1){
					item.waterPower = `iconfont icon-icondown`
				}
				if(item.WPTN&&item.WPTN.indexOf("5")!==-1){
					item.waterPower = `iconfont icon-iconup`
				}
				if(item.WPTN&&item.WPTN.indexOf("6")!==-1){
					item.waterPower = `iconfont icon-shuiping`
				}
				waterLogging.push(item);
			})
			that.setState({
				waterLevel: waterLogging.reverse()
			})
		})
	}
	// 雨量
	rainFallMethod = ()=> {
		let that = this;
		that.setState({rainFall:[]});
		axios.newAjax({
			url: "/business/common/action",
			data:{
				isShowLoading: false
			},
			TYPE:"LOAD_NEWEST_RAINFALL"
		}).then((data)=>{
			let rainFall = data
			that.setState({
				rainFall: rainFall.reverse()
			})
		})
	}
	// 渍水
	waterLoggingMethod = ()=> {
		let that = this;
		that.setState({waterLogging:[]})
		axios.ajax({
			url: '/business/waterpotential/getLogUnusualWaterLevel',
			data:{
				isShowLoading: true
			}
		}).then((data)=>{
			let waterLogging = data.result
			that.setState({
				waterLogging: waterLogging.reverse()
			})
		})
	}
	// 液位
	levelMethod = ()=> {
		let that = this
		that.setState({level:[]})
		axios.ajax({
			url: '/business/stliquidr/getLiquidUnusualData',
			data:{
				isShowLoading: true
			}
		}).then((data)=>{
			let level = data.result
			let levelData = []
			console.log(level.reverse(),'level')

			level.map((item)=>{
				console.log(isNaN(item.DEPTHRATIO))
				if (!isNaN(item.DEPTHRATIO)) {
					item.DEPTHRATIO = (parseFloat(item.DEPTHRATIO) * 100).toFixed(2)
				}
				levelData.push(item)
			})
			that.setState({
				level: level.reverse()
			})
		})
	}
	// 闸站水位
	zhDataMethod = ()=> {
		this.setState({zhData:[]})
		axios.newAjax({
			url: "/business/common/action",
			TYPE:'LOAD_RWDB_WAS_NEWEST',
			data:{
				isShowLoading: true
			}
		}).then((data)=>{
			let zhData = []
			data&&data.map((item)=>{
				if(item.SDWWPTN&&item.SDWWPTN.indexOf("4")!==-1){
					item.waterPowerDW = `iconfont icon-icondown`
				}
				if(item.SDWWPTN&&item.SDWWPTN.indexOf("5")!==-1){
					item.waterPowerDW = `iconfont icon-iconup`
				}
				if(item.SDWWPTN&&item.SDWWPTN.indexOf("6")!==-1){
					item.waterPowerDW = `iconfont icon-shuiping`
				}
				if(item.SUPWPTN&&item.SUPWPTN.indexOf("4")!==-1){
					item.waterPowerUP = `iconfont icon-icondown`
				}
				if(item.SUPWPTN&&item.SUPWPTN.indexOf("5")!==-1){
					item.waterPowerUP = `iconfont icon-iconup`
				}
				if(item.SUPWPTN&&item.SUPWPTN.indexOf("6")!==-1){
					item.waterPowerUP = `iconfont icon-shuiping`
				}
				zhData.push(item)
			})
			this.setState({zhData:zhData.reverse()})
		})
	}
	handleChangeTab = (title)=> {
		sessionStorage.setItem('dataSummaryTab', title)
		if (title == '雨量') {
		  this.rainFallMethod()
		  this.setState({initialPage: 0})
		}
		if (title == '渍水') {
		 this.waterLoggingMethod()
		 this.setState({initialPage: 1})
		}
		if(title == '外江水位') {
			this.initData('/business/waterpotential/getOuterUnusualWaterLevel',"waijiang")
			this.setState({initialPage: 2})
		}
		if(title == '港渠水位') {
			this.initData('/business/waterpotential/getInnerUnusualWaterLevel')
			this.setState({initialPage: 3})
		}
		if(title == '闸站水位') {
			this.zhDataMethod()
			this.setState({initialPage: 4})
		}
		if (title == '液位') {
			this.levelMethod()
			this.setState({initialPage: 5})
		}
		
	}
	touchStartFn = event => {
		let startValue = event.changedTouches[0].clientX
		this.setState({startValue})
	}
	touchMoveFn = event => {
		let moveValue = event.changedTouches[0].clientX
		console.log(this.state.startValue - moveValue)
	}
	// 数据详情列表
	showDetail = (item)=> {
		this.props.history.push({ pathname : '/grossDataDetail/'+item.STCD ,query : { item: item}});
	}
	// 数据列表
	renderContent = () => {
		let title = this.state.title

		if (title == '雨量') {
			let listData = this.state.rainFall&&this.state.rainFall
			let titleList = [
				{title:'站名', name:'STNM', width:'30%'},
				{title:'时间', name:'TM', width:'42%'},
				{title:'降雨量(mm)', name:'DRP', width:'28%'}
			]
			return (<DataSummaryList listData={listData} titleList={titleList} history={this.props.history}/>)
		}

		if (title == '渍水') {
			let listData = this.state.waterLogging && this.state.waterLogging
			let titleList = [
				{title:'站名', name:'STNM', width:'100px'},
				{title:'时间', name:'TM', width:'180px'},
				{title:'水位(cm)', name:'Z1', width:'120px'},
				{title:'当前状态', name:'MESSAGE', width:'100px'}
			]
			return (<DataSummaryList listData={listData} titleList={titleList} history={this.props.history}/>)
		}

		if (title == '外江水位'||title == '港渠水位') {
			let listData = this.state.waterLevel && this.state.waterLevel
			let titleList = [
				{title:'站名', name:'STNM', width:'100px'},
				{title:'时间', name:'TM', width:'180px'},
				{title:'水位(m)', name:'Z1', width:'120px'},
				{title:'水势', name:'waterPower', width:'60px'},
				{title:'当前状态', name:'MESSAGE', width:'120px'}
			]
			return (<DataSummaryList listData={listData} titleList={titleList} history={this.props.history}/>)
		}

		if (title == '闸站水位') {
			let listData = this.state.zhData && this.state.zhData
			let titleList = [
				{title:'站名', name:'STNM', width:'150px'},
				{title:'时间', name:'TM', width:'180px'},
				{title:'闸前水位(m)', name:'UPZ', width:'100px'},
				{title:'闸前水势', name:'waterPowerUP', width:'100px'},
				{title:'闸后水位(m)', name:'DWZ', width:'100px'},
				{title:'闸后水势', name:'waterPowerDW', width:'100px'}
			]
			return (<DataSummaryList listData={listData} titleList={titleList} history={this.props.history}/>)
		}

		if (title == '液位') {
			let listData = this.state.level && this.state.level
			let titleList = [
				{title:'站名', name:'STNM', width:'100px'},
				{title:'时间', name:'TM', width:'180px'},
				{title:'水深(m)', name:'Z1', width:'100px'},
				{title:'充满度(%)', name:'DEPTHRATIO', width:'100px'}
			]
			return (<DataSummaryList listData={listData} titleList={titleList} history={this.props.history}/>)
		}
	}

	render() {
		return (
			<div className={styles.dataSummary}>
				<NavBar className={styles.navBar} mode='light' onClick={this.showActionSheet}>{this.state.title} <i className='iconfont icon-jiantou'></i></NavBar>
				{/*数据列表*/}
				<div className={styles.main}>
					{this.renderContent()}
				</div>
			</div>
		)
	}
}