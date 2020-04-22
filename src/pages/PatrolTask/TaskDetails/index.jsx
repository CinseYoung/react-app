import React from 'react'
import AMap from 'AMap'
import classnames from 'classnames'
import axios from 'axios'
import qs from 'qs'
import { connect } from 'react-redux'
import { NavBar, Modal } from 'antd-mobile'
import { FormatDate } from 'utils/format'
import AMaps from 'components/AMaps'
import Scale from 'components/Scale'
import Location from 'components/Location'
import Feedba from '../components/Feedba'
import Legend from '../components/Legend'
import styles from './style.less'

let setTimer

@connect(
	state => ({
		globalMap: state.globalMap,
		getTaskListData: state.getTaskListData,
		getGlobalLocation: state.getGlobalLocation
	}),{}
)
export default class TaskDetails extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			routePath: [],
			taskRouteData: [],
			isStart: true,
			isStartTask: true,
			isContinue: false,
			ID: this.props.history.location.pathname.split("/")[2],
			isShowFeedba: false
		}
	}

	componentDidMount() {
		this.taskListData()
		let startTaskID = sessionStorage.getItem('startTaskID')
		if (startTaskID == this.state.ID) {
			this.setState({isStart: false})
		}else {
			this.setState({isStart: true})
		}
		this.getTaskRouteData()
	}

	// 地图绘制路线方法
	drawingRoute = (routeData, strokeColor='#00b33f')=> {
		let newTaskRoutePath = []
    let taskRoutePath = this.sliceArray(JSON.parse(`[${String(routeData)}]`),2)
    for (let j = 0; j < taskRoutePath.length; j++) {
    	let a1 = taskRoutePath[j][0] - 0.01
    	let a2 = taskRoutePath[j][1] - 1.585
    	newTaskRoutePath.push([a1, a2])
    }
		// 坐标转换
		AMap.convertFrom(newTaskRoutePath, 'gps',(status, result)=> {
			if (result.info === 'ok') {
				let path = result.locations
				let polyline = new AMap.Polyline({
					path: path,  
					borderWeight: 2, // 线条宽度，默认为 1
					strokeColor: strokeColor, // 线条颜色
					lineJoin: 'round' // 折线拐点连接处样式
				});
				this.props.globalMap.add(polyline)
			}
		})
		// 设置地图中心点，地图缩放大小
    setTimeout(()=>{
    	this.props.globalMap.setZoomAndCenter(12, newTaskRoutePath[0])
    },40)
	}

	// 获取用户路线,在地图绘制出来
	getTaskRouteData = ()=> {
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: process.env.APP_URL + '/business/pollingroute/tableData',
      method: 'post',
      data: qs.stringify({
      	taskId: parseInt(this.state.ID)
      })
    }).then((response)=>{
      let taskData = response.data
      for (let i = 0; i < taskData.length; i++) {
      	let taskRouteData = taskData[i].route
      	this.drawingRoute(taskRouteData)
      }
    })
	}
	/*
   * 将一个数组分成几个同等长度的数组
   * array[分割的原数组]
   * size[每个子数组的长度]
  */
	sliceArray(array, size){
    let result = []
    for (let i = 0; i < Math.ceil(array.length / size); i++) {
      let start = i * size
      let end = start + size
      result.push(array.slice(start, end))
    }
    return result
  }
	// 获取巡检任务，地图显示路线
	taskListData = ()=> {
		let ID = this.props.history.location.pathname.split("/")[2]
		let taskList = this.props.getTaskListData
    for (var i = 0; i < taskList.length; i++) {
    	if (taskList[i].id == ID) {
    		if (taskList[i].status == 3) {
    			this.setState({ isStartTask: false, isContinue: true })
    		}
				let taskRouteData = taskList[i].route.split(',')
				this.drawingRoute(taskRouteData,'#276eff')
    	}
    }
  }
  //改变任务状态
  changeTaskStatus = (status)=> {
  	let data = ''
  	if (status === 'startTime') {
			data = qs.stringify({startTime: FormatDate("yyyy-MM-dd hh:mm:ss", new Date()), status: 1})
  	}
  	if (status === 'endTime') {
  		data = qs.stringify({endTime: FormatDate("yyyy-MM-dd hh:mm:ss", new Date()), status: 2})
  	}
  	if (status === 'suspend'){
  		data = qs.stringify({status: 3})
  	}
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: process.env.APP_URL + '/business/pollingtask/edit/' + parseInt(this.state.ID),
      method: 'post',
      data: data
    }).then((response)=>{
      console.log(response.data)
    })
  }
	// 上传路线
  uploadRoutePath = (routePathStr)=> {
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: process.env.APP_URL + '/business/pollingroute/add',
      method: 'post',
      data: qs.stringify({
      	taskId: parseInt(this.state.ID),
				tm: FormatDate("yyyy-MM-dd hh:mm:ss", new Date()),
				route: routePathStr.join(",")
      })
    }).then((response)=>{
      console.log(response.data)
    })
  }
  // 开始任务
  handleClickStartTask = ()=>{
  	let isStartTask = sessionStorage.getItem('isStartTask')
		if (isStartTask === 'true') {
			Modal.alert('温馨提示', '已经有执行的任务，不能同时执行两个任务！', [
		    { text: '确定' }
		  ])
		}else{
			this.setState({isStart: false})
			sessionStorage.setItem('isStartTask', 'true')
			sessionStorage.setItem('startTaskID', this.state.ID)
			//改变当前任务状态（开始）
			this.changeTaskStatus('startTime')
			this.polylineFn()
		}
  }
  // 继续任务
  handleClickContinueTask = ()=> {
		let isStartTask = sessionStorage.getItem('isStartTask')
		if (isStartTask === 'true') {
			Modal.alert('温馨提示', '已经有执行的任务，不能同时执行两个任务！', [
		    { text: '确定' }
		  ])
		}else{
			this.setState({isStart: false})
			axios({
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	      url: process.env.APP_URL + '/business/pollingtime/add',
	      method: 'post',
	      data: qs.stringify({
	      	taskId: parseInt(this.state.ID),
					tm: FormatDate("yyyy-MM-dd hh:mm:ss", new Date()),
					status: 1
	      })
	    }).then((response)=>{
	      console.log(response.data)
	    })
			sessionStorage.setItem('isStartTask', 'true')
			sessionStorage.setItem('startTaskID', this.state.ID)
			this.polylineFn()
		}
  }
  //暂停任务
  handleClickSuspendTask = ()=>{
  	Modal.alert('温馨提示', '是否暂停本次巡检任务？', [
	    { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
	    { text: '确定', onPress: () => {
	    	clearInterval(setTimer)
				this.setState({
					isStart: true,
					isStartTask: false,
					isContinue: true
				})
				let isStartTask = sessionStorage.getItem('isStartTask')
				if (isStartTask === 'true') {
					sessionStorage.setItem('isStartTask','false')
					sessionStorage.setItem('startTaskID', '0')
				}
	    }}
	  ])
	  this.suspendData()
  }
  //停任务数据上传
  suspendData = ()=> {
		/*business/pollingtime/add
		taskId 任务ID
		tm 暂停（继续）时间
		status 状态（0: 暂停，1:继续）*/
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: process.env.APP_URL + '/business/pollingtime/add',
      method: 'post',
      data: qs.stringify({
      	taskId: parseInt(this.state.ID),
				tm: FormatDate("yyyy-MM-dd hh:mm:ss", new Date()),
				status: 0
      })
    }).then((response)=>{
      console.log(response.data)
    })
		// 路线上传
    let routePath = this.state.routePath
  	let routePathStr = []
		for (let i = 0; i < routePath.length; i++) {
			routePathStr.push(routePath[i])
		}

		//改变当前任务状态（暂停）
		this.changeTaskStatus('suspend')
		this.uploadRoutePath(routePathStr)
  	/*axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: process.env.APP_URL + '/business/pollingroute/add',
      method: 'post',
      data: qs.stringify({
      	taskId: parseInt(this.state.ID),
				tm: FormatDate("yyyy-MM-dd hh:mm:ss", new Date()),
				route: routePathStr.join(",")
      })
    }).then((response)=>{
      console.log(response.data)
    })*/
  }
  //结束任务
  handleClickEndTask = ()=>{
  	Modal.alert('温馨提示', '是否结束并上传本次巡检任务？', [
	    { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
	    { text: '确定', onPress: () => {
	    	clearInterval(setTimer)
				this.setState({
					isStart: true,
					isStartTask: true,
					isContinue: false
				})
				let isStartTask = sessionStorage.getItem('isStartTask')
				if (isStartTask === 'true') {
					sessionStorage.setItem('isStartTask','false')
					sessionStorage.setItem('startTaskID', '0')
				}
	    }}
	  ])
	  this.uploadData()
  }
  //结束任务数据上传
  uploadData = ()=> {
  	let routePath = this.state.routePath
  	let routePathStr = []
		for (let i = 0; i < routePath.length; i++) {
			routePathStr.push(routePath[i])
		}
		//改变当前任务状态（结束）
		this.changeTaskStatus('endTime')
		this.uploadRoutePath(routePathStr)
  	/*axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: process.env.APP_URL + '/business/pollingroute/add',
      method: 'post',
      data: qs.stringify({
      	taskId: parseInt(this.state.ID),
				tm: FormatDate("yyyy-MM-dd hh:mm:ss", new Date()),
				route: routePathStr.join(",")
      })
    }).then((response)=>{
      console.log(response.data)
    })*/
  }
	//地图查看执行任务的实时路线
  polylineFn = ()=> {
  	setTimer = setInterval(()=>{
			let routePath = this.props.getGlobalLocation()
			if (routePath.length < 2) {
				return
			}
			this.setState({routePath})
			AMap.convertFrom(routePath, 'gps',(status, result)=> {
				if (result.info === 'ok') {
					let path = result.locations
					let polyline = new AMap.Polyline({
		        path: path,
		        isOutline: true,
		        outlineColor: '#ffeeff',
		        borderWeight: 3,
		        strokeColor: "#00b33f", 
		        strokeOpacity: 1,
		        strokeWeight: 4,
		        // 折线样式还支持 'dashed'
		        strokeStyle: "solid",
		        // strokeStyle是dashed时有效
		        strokeDasharray: [10, 5],
		        lineJoin: 'round',
		        lineCap: 'round',
		        zIndex: 50
		    	})
					this.props.globalMap.add(polyline)
				}
			})
		},15000)
	}
	// 反馈问题
	handleClickFeedba = ()=> {
		this.setState({isShowFeedba: !this.state.isShowFeedba})
	}

	render() {
		return (
			<div className={styles.taskDetails} >
				<NavBar className={styles.navBar} mode='light' 
					icon={<i className="iconfont icon-back" style={{color: '#666'}}></i>} 
					onLeftClick={() => this.props.history.goBack()}>
          巡检任务详情
        </NavBar>
        <div className={styles.AMaps}>
        	<AMaps/>
        	{/*缩放*/}
					<Scale/>
					{/* 定位 */}
					<Location/>
        </div>
        <div className={styles.feedba} onClick={this.handleClickFeedba}><i className="iconfont icon-feedba"></i></div>
        <div className={styles.startTask}>
        	<div className={classnames(styles.beginToContinue, {[`${styles.isStart}`]: this.state.isStart})}>
        		<button className={classnames(styles.startTaskBtn, {[`${styles.isContinue}`]: this.state.isStartTask})} onClick={this.handleClickStartTask}>开始巡检</button>
        		<button className={classnames(styles.continueTaskBtn, {[`${styles.isContinue}`]: this.state.isContinue})} onClick={this.handleClickContinueTask}>继续巡检</button>
        	</div>
        	<div className={classnames(styles.suspendExecution, {[`${styles.isStart}`]: !this.state.isStart})}>
        		<button className={styles.suspendBtn} onClick={this.handleClickSuspendTask}>暂停巡检</button>
        		<button className={styles.endTaskBtn} onClick={this.handleClickEndTask}>结束巡检</button>
        	</div>
        </div>
        <Legend/>
      	{/*反馈问题组件*/}
        <Feedba isShow={this.state.isShowFeedba} handleClickFeedba={this.handleClickFeedba} ID={this.state.ID}/>
			</div>
		)
	}
}