import React from 'react'
import axios from 'axios'
import qs from 'qs'
import { NavBar, ActionSheet } from 'antd-mobile'
import styles from './style.less'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
let wrapProps
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault()
  }
}

export default class Inspection extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			clicked: 'none',
			type: 0,
			status: 0,
			eventType: '路面积水',
			eventStatus: '待处理',
			listViewData: []
		}

		// 修改安卓 StatusBar 颜色
		if(process.env.NODE_ENV==='production'){
			if (typeof(cordova)!=='undefined' && cordova.platformId == 'android') {
		    StatusBar.overlaysWebView(false)
		    StatusBar.styleDefault()
		    StatusBar.backgroundColorByHexString('#ffffff')
			}
		}
	}
	componentDidMount() {
		this.getListCommonData()
	}

	handleChangeEventType = ()=> {
    const BUTTONS = ['路面积水', '涵洞积水', '堤段巡查', '取消'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      message: '请选择相关的参数查询',
      maskClosable: true,
      'data-seed': 'logId',
      wrapProps
    },
    (buttonIndex) => {
    	if (buttonIndex != BUTTONS.length-1) {
    		this.handleChangeTabEventType(BUTTONS[buttonIndex])
    		this.setState({eventType: BUTTONS[buttonIndex]})
    	}
      this.setState({ clicked: BUTTONS[buttonIndex] })
    })
  }
  handleChangeEventStatus = ()=> {
    const BUTTONS = ['待处理', '处理中', '已完成', '取消'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      message: '请选择相关的事件状态查询',
      maskClosable: true,
      'data-seed': 'logId',
      wrapProps
    },
    (buttonIndex) => {
    	if (buttonIndex != BUTTONS.length-1) {
    		this.handleChangeTabEventStatus(BUTTONS[buttonIndex])
    		this.setState({eventStatus: BUTTONS[buttonIndex]})
    	}
      this.setState({ clicked: BUTTONS[buttonIndex] })
    })
  }
  handleChangeTabEventType = (item)=> {
  	let type
  	switch (item) {
  		case '路面积水':
  			type = 0
  			break;
  		case '涵洞积水':
  			type = 1
  			break;
  		case '堤段巡查':
  			type = 2
  			break;
  		default:
  			type = 0
  			break;
  	}
  	this.setState({type}, ()=>{
  		this.getListCommonData()
  	})
  }
  handleChangeTabEventStatus = (item)=> {
		let status
  	switch (item) {
  		case '路面积水':
  			status = 0
  			break;
  		case '涵洞积水':
  			status = 1
  			break;
  		case '堤段巡查':
  			status = 2
  			break;
  		default:
  			status = 0
  			break;
  	}
  	this.setState({status}, ()=>{
  		this.getListCommonData()
  	})
  }
  getListCommonData = ()=> {
		axios({
			headers: {'Content-Type': 'application/json;charset=UTF-8'},
			method: 'post',
			url: process.env.APP_URL+'/business/eventreport/listCommon',
			data: JSON.stringify({
				eventType: this.state.type,
				eventStatus: this.state.status
		  })
		}).then((response)=> {
			let listViewData = []
			let listViewImgData = []
			for (let i = 0; i < response.data.length; i++) {
				let data = response.data[i]
				if (typeof(data.eventType)==='number') {
					listViewData.push(response.data[i])
				}
			}
			for (let i = 0; i < listViewData.length; i++) {
				if (listViewData[i].image) {
					axios({
						method: 'post',
						url: process.env.APP_URL+'/file/getFilePath',
						data: qs.stringify({
							ids: listViewData[i].image
					  })
					}).then((response)=> {
						listViewImgData.push({
							eventDes: listViewData[i].eventDes,
							eventStatus: listViewData[i].eventStatus,
							eventType: listViewData[i].eventType,
							id: listViewData[i].id,
							image: response.data[0],
							imageID: listViewData[i].image,
							lgtd: listViewData[i].lgtd,
							location: listViewData[i].location,
							lttd: listViewData[i].lttd,
							modifyTime: listViewData[i].modifyTime,
							reportTime: listViewData[i].reportTime,
							reporter: listViewData[i].reporter
						})
					}).catch((error)=> {
						console.log(error,'error')
					})
				}else {
					listViewImgData.push({
						eventDes: listViewData[i].eventDes,
						eventStatus: listViewData[i].eventStatus,
						eventType: listViewData[i].eventType,
						id: listViewData[i].id,
						image: listViewData[i].image,
						imageID: listViewData[i].image,
						lgtd: listViewData[i].lgtd,
						location: listViewData[i].location,
						lttd: listViewData[i].lttd,
						modifyTime: listViewData[i].modifyTime,
						reportTime: listViewData[i].reportTime,
						reporter: listViewData[i].reporter
					})
				}
			}
			// 图片信息解析结构赋值给listViewData
			this.setState({listViewData:listViewImgData})
		}).catch((error)=> {
			console.log(error,'error')
		})
  }
	hanldeClickListView = (item)=> {
		 this.props.history.push( { pathname:'/selectListView',query:{ data: item}})
	}
	render() {
		return (
			<div className={styles.inspection}>
				<NavBar className={styles.navBar} mode='light'>事件管理</NavBar>
				<div className={styles.listCommonSelect}>
					<div className={styles.selectList} onClick={this.handleChangeEventType}>
						<span>{this.state.eventType?this.state.eventType:'路面积水'}</span>
						<i className='iconfont icon-jiantou'></i>
					</div>
					<div className={styles.selectList} onClick={this.handleChangeEventStatus}>
						<span>{this.state.eventStatus?this.state.eventStatus:'待处理'}</span>
						<i className='iconfont icon-jiantou'></i>
					</div>
				</div>
				<ul className={styles.content}>
					{this.state.listViewData.map((item,index)=>{
						return (
							<li className={styles.listView} key={index} onClick={()=>this.hanldeClickListView(item)}>
								<div className={styles.listMain}>
									<img src={`${process.env.APP_URL}/upload/`+item.image} alt=""/>
									<div className={styles.column}>
										<p className={styles.location}>{item.location}</p>
										<p className={styles.reporter}>{item.reporter}</p>
										<p className={styles.reportTime}>{item.reportTime}</p>
									</div>
								</div>
								<h3>{item.eventDes}</h3>
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
}