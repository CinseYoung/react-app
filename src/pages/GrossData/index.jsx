import React from 'react'
import { NavBar, Tabs } from 'antd-mobile'
import styles from './style.less'
import axios from 'utils/Axios'

const tabs = [
	{ title: '外江水位', sub: '1' },
	{ title: '港渠水位', sub: '2' },
	{ title: '闸站水位', sub: '3' },
	{ title: '渍水', sub: '4' },
	{ title: '液位', sub: '5' },
	{ title: '降雨', sub: '6' }
]
export default class GrossData extends React.Component {
	constructor(props) {
		super(props)
		this.state={
			initialPage: 0,
			waterLevel:[],
			waterLogging:[],
			level:[],
			rainFall:[],
			zhData:[]
		}
	}
	
	componentDidMount(){
		let grossTab = sessionStorage.getItem('grossDataTab')
	  if(grossTab == '外江水位') {
			this.initData('/business/waterpotential/getOuterUnusualWaterLevel',"waijiang")
			this.setState({initialPage: 0})
		} else if(grossTab == '港渠水位') {
			this.initData('/business/waterpotential/getInnerUnusualWaterLevel')
			this.setState({initialPage: 1})
		} else if(grossTab == '闸站水位') {
			this.zhDataMethod()
			this.setState({initialPage: 2})
		} else if (grossTab == '渍水') {
		 this.waterLoggingMethod()
		 this.setState({initialPage: 3})
		} else if (grossTab == '液位') {
			this.levelMethod()
			this.setState({initialPage: 4})
		} else if (grossTab == '降雨') {
		  this.rainFallMethod()
		  this.setState({initialPage: 5})
		} else {
			this.initData('/business/waterpotential/getOuterUnusualWaterLevel',"waijiang")
			this.setState({initialPage: 0})
		}
	}
	initData = (url,type)=> {
		let that = this;
		that.setState({waterLevel:[]});
		axios.ajax({
			url: url,
			data:{
				isShowLoading: false
			}
		}).then((data)=>{
			let waterLogging = [];
			let newWaterLogging = [];
			if(type&&type=="waijiang") {
				waterLogging = data.result.filter((item) => {
					return item.STTP !== 'DD'
				})
			}else{
				waterLogging = data.result;
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
				newWaterLogging.push(item);
			})
			that.setState({
				waterLevel: waterLogging.reverse()
			})
		})
	}
	waterLoggingMethod = ()=> {
		let that = this;
		that.setState({waterLogging:[]});
		axios.ajax({
			url: '/business/waterpotential/getLogUnusualWaterLevel',
			data:{
				isShowLoading: true
			}
		}).then((data)=>{
			let waterLogging = data.result;
			that.setState({
				waterLogging: waterLogging.reverse()
			})
		})
	}
	levelMethod = ()=> {
		let that = this;
		that.setState({level:[]});
		axios.ajax({
			url: '/business/stliquidr/getLiquidUnusualData',
			data:{
				isShowLoading: true
			}
		}).then((data)=>{
			let level = data.result;
			that.setState({
				level: level.reverse()
			})
		})
	}
	rainFallMethod = ()=> {
		let that = this;
		that.setState({rainFall:[]});
		axios.newAjax({
			url: "/business/common/action",
			data:{
				isShowLoading: true
			},
			TYPE:"LOAD_NEWEST_RAINFALL"
		}).then((data)=>{
			let rainFall = data;
			that.setState({
				rainFall: rainFall.reverse()
			})
		})
	}
	// 闸站水位
	zhDataMethod = ()=> {
		this.setState({zhData:[]});
		axios.newAjax({
			url: "/business/common/action",
			TYPE:'LOAD_RWDB_WAS_NEWEST',
			data:{
				isShowLoading: true
			}
		}).then((data)=>{
			let zhData = [];
			data&&data.map((item)=>{
				if(item.SDWWPTN&&item.SDWWPTN.indexOf("4")!==-1){
					item.waterPower = `iconfont icon-icondown`
				}
				if(item.SDWWPTN&&item.SDWWPTN.indexOf("5")!==-1){
					item.waterPower = `iconfont icon-iconup`
				}
				if(item.SDWWPTN&&item.SDWWPTN.indexOf("6")!==-1){
					item.waterPower = `iconfont icon-shuiping`
				}
				zhData.push(item);
			})
			this.setState({zhData:zhData.reverse()})
		})
	}
	handleChangeTab = (tab)=> {
		sessionStorage.setItem('grossDataTab', tab.title)
		let title = tab.title;
		if(title == '外江水位') {
			this.initData('/business/waterpotential/getOuterUnusualWaterLevel',"waijiang")
			this.setState({initialPage: 0})
		}
		if(title == '港渠水位') {
			this.initData('/business/waterpotential/getInnerUnusualWaterLevel')
			this.setState({initialPage: 1})
		}
		if(title == '闸站水位') {
			this.zhDataMethod()
			this.setState({initialPage: 2})
		}
		if (title == '渍水') {
		 this.waterLoggingMethod()
		 this.setState({initialPage: 3})
		}
		if (title == '液位') {
			this.levelMethod()
			this.setState({initialPage: 4})
		}
		if (title == '降雨') {
		  this.rainFallMethod()
		  this.setState({initialPage: 5})
		}
	}
	// 数据详情列表
	showDetail = (item)=> {
		this.props.history.push({ pathname : '/grossDataDetail/'+item.STCD ,query : { item: item}});
	}
	// 数据列表
	renderContent = (tab) => {
		let title = tab.title
		if (title == '外江水位'||title == '港渠水位') {
			const listItems = this.state.waterLevel&&this.state.waterLevel.map((item,key) =>{
				return (
					<ul className={styles.listItem} key={key} onClick={this.showDetail.bind(this,item)}>
						<li className={styles.watername}>{item.STNM}</li>
						<li className={styles.watertime}>{item.TM}</li>
						<li className={styles.waterlevel}>{item.Z1}</li>
						{/*<li className={styles.watertrend}><i className={item.waterPower}></i></li>*/}
					</ul>
				)
			})
			return (
				<div className={styles.dataList}>
					<div className={styles.titleListDiv}>
					<ul className={styles.titleList}>
						<li className={styles.watername}>站名</li>
						<li className={styles.watertime}>时间</li>
						<li className={styles.waterlevel}>水位(m)</li>
						{/*<li className={styles.watertrend}>水势</li>*/}
					</ul>
					</div>
					<div className={styles.listMain}>
						{listItems}
					</div>
				</div>
			)
		}
		if (title == '闸站水位') {
			const listItems = this.state.zhData&&this.state.zhData.map((item,key) =>{
				return (
					<ul className={styles.listItem} key={key} onClick={this.showDetail.bind(this,item)}>
						<li className={styles.zhname}>{item.STNM}</li>
						<li className={styles.zhtime}>{item.TM}</li>
						<li className={styles.zhlevel}>{item.UPZ}</li>
						<li className={styles.zhlevel}>{item.DWZ}</li>
						<li className={styles.zhtrend}><i className={item.waterPower}></i></li>
					</ul>
				)
			})
			return (
				<div className={styles.dataList}>
					<div className={styles.titleListDiv}>
					<ul className={styles.titleList}>
						<li className={styles.zhname}>站名</li>
						<li className={styles.zhtime}>时间</li>
						<li className={styles.zhlevel}>上水位(m)</li>
						<li className={styles.zhlevel}>下水位(m)</li>
						<li className={styles.zhtrend}>水势</li>
					</ul>
					</div>
					<div className={styles.listMain}>
						{listItems}
					</div>
				</div>
			)
		}
		if (title == '渍水') {
			const listItems = this.state.waterLogging&&this.state.waterLogging.map((item,key) =>{
				return (
					<ul className={styles.listItem} key={key} onClick={this.showDetail.bind(this,item)}>
						<li className={styles.name}>{item.STNM}</li>
						<li className={styles.time}>{item.TM}</li>
						<li className={styles.level}>{item.Z1}</li>
						{/*<li className={styles.level}>{item.level}</li>*/}
						{/*<li className={styles.trend}>{item.WPTNNAME1}</li>*/}
					</ul>
				)
			})
			return (
				<div className={styles.dataList}>
					<div className={styles.titleListDiv}>
					<ul className={styles.titleList}>
						<li className={styles.name}>站名</li>
						<li className={styles.time}>时间</li>
						<li className={styles.level}>水深(cm)</li>
						{/*<li className={styles.level}>下水位</li>*/}
						{/*<li className={styles.trend}>水势</li>*/}
					</ul>
					</div>
					<div className={styles.listMain}>
						{listItems}
					</div>
				</div>
			)
		}
		if (title == '液位') {
			const listItems = this.state.level&&this.state.level.map((item,key) =>{
				return (
					<ul className={styles.listItem} key={key} onClick={this.showDetail.bind(this,item)}>
						<li className={styles.name}>{item.STNM}</li>
						<li className={styles.time}>{item.TM}</li>
						<li className={styles.level}>{item.Z1}</li>
						{/*<li className={styles.trend}>{item.WPTNNAME1}</li>*/}
					</ul>
				)
			})
			return (
				<div className={styles.dataList}>
					<div className={styles.titleListDiv}>
					<ul className={styles.titleList}>
						<li className={styles.name}>站名</li>
						<li className={styles.time}>时间</li>
						<li className={styles.level}>水深(m)</li>
						{/*<li className={styles.trend}>水势</li>*/}
					</ul>
					</div>
					<div className={styles.listMain}>
						{listItems}
					</div>
				</div>
			)
		}
		if (title == '降雨') {
			const listItems = this.state.rainFall&&this.state.rainFall.map((item,key) =>{
				return (
					<ul className={styles.listItem} key={key} onClick={this.showDetail.bind(this,item)}>
						<li className={styles.ylname}>{item.STNM}</li>
						<li className={styles.time}>{item.TM}</li>
						<li className={styles.level}>{item.DRP}</li>
						{/*<li className={styles.trend}>{item.trend}</li>*/}
					</ul>
				)
			})
			return (
				<div className={styles.dataList}>
					<div className={styles.titleListDiv}>
					<ul className={styles.titleList}>
						<li className={styles.ylname}>站名</li>
						<li className={styles.time}>时间</li>
						<li className={styles.level}>雨量(mm)</li>
						{/*<li className={styles.trend}>水势</li>*/}
					</ul>
					</div>
					<div className={styles.listMain}>
						{listItems}
					</div>
				</div>
			)
		}
	}

	render() {
		return (
			<div className={styles.grossData}>
				<NavBar className={styles.navBar} mode='light'>数据总览</NavBar>

				{/*数据列表*/}
				<div className={styles.main}>
					<Tabs tabs={tabs}
						  initialPage={0}
						  page={this.state.initialPage}
						  onChange={this.handleChangeTab}
						  renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3} />}>
						{this.renderContent}
					</Tabs>
				</div>
			</div>
		)
	}
}
