import React from 'react'
import { TabBar } from 'antd-mobile'
import HomePage from 'pages/HomePage'
import DataSummary from 'pages/DataSummary'
import Inspection from 'pages/Inspection'
import Information from 'pages/Information'

import styles from './style.less'

export default class Navigation extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			selectedTab: sessionStorage.getItem('selectedTab') ? sessionStorage.getItem('selectedTab') : 'Tab1',
			hidden: false,
			fullScreen: false,
			noRenderContent:true
		}
	}
	componentDidMount() {
		this.initData();
	}
	initData = ()=> {
		this.renderContent("Tab1")
		this.setState({noRenderContent:false})
	}
	tabChange = (tabs)=> {
		this.setState({noRenderContent:true})
		this.setState({
			selectedTab: tabs
		},()=>{
			this.renderContent(this.state.selectedTab)
			this.setState({noRenderContent:false})
		})
		sessionStorage.setItem('selectedTab', tabs)

		// 修改安卓 StatusBar 颜色
		if(tabs==="Tab1"){
			if(process.env.NODE_ENV==='production'){
				if (typeof(cordova)!=='undefined' && cordova.platformId == 'android') {
			    StatusBar.overlaysWebView(false)
			    StatusBar.styleLightContent()
			    StatusBar.backgroundColorByHexString('#3d92fb')
				}
			}
		}
		if(tabs==="Tab2"){
			if(process.env.NODE_ENV==='production'){
				if (typeof(cordova)!=='undefined' && cordova.platformId == 'android') {
			    StatusBar.overlaysWebView(false)
			    StatusBar.styleDefault()
		    	StatusBar.backgroundColorByHexString('#ffffff')
				}
			}
		}
		if(tabs==="Tab3"){
			if(process.env.NODE_ENV==='production'){
				if (typeof(cordova)!=='undefined' && cordova.platformId == 'android') {
			    StatusBar.overlaysWebView(false)
			    StatusBar.styleDefault()
		    	StatusBar.backgroundColorByHexString('#ffffff')
				}
			}
		}
		if (tabs==="Tab4") {
			if (process.env.NODE_ENV === 'production') {
				if (typeof cordova !== 'undefined' && cordova.platformId == 'android') {
					StatusBar.overlaysWebView(false)
					StatusBar.styleLightContent()
					StatusBar.backgroundColorByHexString('#3ea0f8')
				}
			}
		}
	}

	renderContent = (tabs)=> {
		if(tabs==="Tab1"){
			return <HomePage history={this.props.history}/>
		}
		if(tabs==="Tab2"){
			return <DataSummary history={this.props.history}/>
		}
		if(tabs==='Tab3'){
			return <Inspection history={this.props.history}/>
		}
		if(tabs==="Tab4"){
			return <Information history={this.props.history}/>
		}
	}
	render() {
		return (
			<div className={styles.Navigation}>
				<TabBar
					unselectedTintColor="#727272"
					tintColor="#4287ff"
					barTintColor="white"
					tabBarPosition="bottom"
					prerenderingSiblingsNumber={0}
					hidden={this.state.hidden}>
					<TabBar.Item
						id="Tab1"
						title="首页"
						key="Home"
						icon={<i className="iconfont icon-map"></i>}
						selectedIcon={<i className="iconfont icon-map" style={{color:'#4287ff'}}></i>}
						selected={sessionStorage.getItem('selectedTab') === 'Tab1'}
						onPress={()=>{this.tabChange("Tab1")}}
						ref='Tab1'
						data-seed="Tab1"
					>
						{/*<HomePage/>*/}
						{this.renderContent("Tab1")}
					</TabBar.Item>
					<TabBar.Item
						id="Tab2"
						title="数据总览"
						key="Data"
						icon={<i className="iconfont icon-data"></i>}
						selectedIcon={<i className="iconfont icon-data" style={{color:'#4287ff'}}></i>}
						selected={sessionStorage.getItem('selectedTab') === 'Tab2'}
						onPress={()=>{this.tabChange("Tab2")}}
						ref='Tab2'
						data-seed="Tab2"
					>
						{/*<DataSummary/>*/}
						{this.renderContent("Tab2")}
					</TabBar.Item>
					<TabBar.Item
						id="Tab3"
						title="事件管理"
						key="Inspection"
						icon={<i className="iconfont icon-shijianguanli"></i>}
						selectedIcon={<i className="iconfont icon-shijianguanli" style={{color:'#4287ff'}}></i>}
						selected={sessionStorage.getItem('selectedTab') === 'Tab3'}
						onPress={()=>{this.tabChange("Tab3")}}
						ref='Tab3'
						data-seed="Tab3"
					>
						{this.renderContent("Tab3")}
						{/*<Inspection/>*/}
					</TabBar.Item>
					<TabBar.Item
						id="Tab4"
						title="我的"
						key="Information"
						icon={<i className="iconfont icon-wode1"></i>}
						selectedIcon={<i className="iconfont icon-wode1" style={{color:'#4287ff'}}></i>}
						selected={sessionStorage.getItem('selectedTab') === 'Tab4'}
						onPress={()=>{this.tabChange("Tab4")}}
						ref='Tab4'
						data-seed="Tab4"
					>
						{this.renderContent("Tab4")}
					</TabBar.Item>
				</TabBar>
			</div>
		)
	}
}
