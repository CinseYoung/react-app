import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import axios from 'axios'
import qs from 'qs'
import { Link } from 'react-router-dom'
import { Tabs, NavBar } from 'antd-mobile'
import { NoContents } from 'components/Status'
import PatrolRecordPopup from './components/PatrolRecordPopup'
import styles from './style.less'

// 用装饰器简写方式
@connect(
	// 你要state什么属性放到props里
	state => ({
		getTaskListData: state.getTaskListData
	}),
	// 你要什么方法，放到props里，自动dispatch
	{}
)
export default class PatrolTask extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			initialPage: 0,
			tabs: [
				{ title: '未完成', sub: '1' },
				{ title: '已完成', sub: '2' },
				{ title: '巡检记录', sub: '3' }
			],
			isNotFinished: true,
			isComplete: true,
			isPatrolRecord: true,
			notFinishedData: [],
			completeData: [],
			patrolRecordData: [],
			isShowPatrolRecord: false,
			patrolRecordContent: []
		}
		// 修改安卓 StatusBar 颜色
		if(process.env.NODE_ENV==='production'){
			if (typeof(cordova)!=='undefined' && cordova.platformId == 'android') {
		    StatusBar.overlaysWebView(false)
		    StatusBar.styleDefault()
		    StatusBar.backgroundColorByHexString('#ffffff')
			}
		}
		this.patrolRecordData()
	}

	componentDidMount() {
		let patrolTaskTab = sessionStorage.getItem('patrolTaskTab')
		if(patrolTaskTab == '未完成') {
			this.setState({initialPage: 0})
		} else if(patrolTaskTab == '已完成') {
			this.setState({initialPage: 1})
		} else if(patrolTaskTab == '巡检记录') {
			this.setState({initialPage: 2})
		}
		this.taskListData()
	}

	handleChangeTab = (tab)=> {
		sessionStorage.setItem('patrolTaskTab', tab.title)
		let title = tab.title
		if(title == '未完成') {
			this.setState({initialPage: 0})
		}
		if(title == '已完成') {
			this.setState({initialPage: 1})
		}
		if(title == '巡检记录') {
			this.setState({initialPage: 2})
		}
	}

	// 巡检任务
	taskListData = ()=> {
		let taskList = this.props.getTaskListData
    let notFinishedData = []
    let completeData = []
    for (var i = 0; i < taskList.length; i++) {
    	if (taskList[i].status!==2) {
    		notFinishedData.push(taskList[i])
    	}else {
    		completeData.push(taskList[i])
    	}
    }
    if (notFinishedData.length === 0) {
			this.setState({isNotFinished: false})
		}
    if (completeData.length === 0) {
			this.setState({isComplete: false})
		}
    this.setState({notFinishedData, completeData})
  }

  patrolRecordData = ()=> {
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: process.env.APP_URL + '/business/pollingrecord/tableData',
      method: 'post',
      data: qs.stringify({
      	personnel: parseInt(sessionStorage.getItem('userID'))
      })
    }).then((response)=>{
      let patrolRecordData = response.data
      this.setState({patrolRecordData})
      if (patrolRecordData.length === 0) {
				this.setState({isPatrolRecord: false})
			}
    })
  }

  handleClickPatrolRecord = (item)=> {
  	this.handleClickHide()
  	let patrolRecordContent = []
  	patrolRecordContent.push(item)
  	this.setState({patrolRecordContent})
  }
  handleClickHide = ()=> {
		this.setState({isShowPatrolRecord: !this.state.isShowPatrolRecord})
  }

	render() {
		return (
			<div className={styles.patrolTask}>
				<NavBar className={styles.navBar} mode='light' 
					icon={<i className="iconfont icon-back" style={{color: '#666'}}></i>} 
					onLeftClick={() => this.props.history.goBack()}>
          巡检任务
        </NavBar>

				{/*数据列表*/}
				<div className={styles.content}>
					<Tabs tabs={this.state.tabs} initialPage={0} page={this.state.initialPage} onChange={this.handleChangeTab}>
						{/*未完成*/}
						<ul className={styles.notFinished}>
							{
								this.state.notFinishedData.map((item,index) =>{
									return (
										<li className={styles.listItem} key={index}>
											<Link to={`/taskDetails/${item.id}`} className={styles.listLink}>
												<h3 className={styles.name}>{item.name}</h3>
												<div className={styles.column}>
													<p className={styles.realName}>{item.realName}</p>
													<p className={styles.time}>{item.tm}</p>
												</div>
											</Link>
										</li>
									)
								})
							}
							<div className={classnames({[`${styles.status}`]: this.state.isNotFinished})}>
								<NoContents/>
							</div>
						</ul>
						{/*已完成*/}
						<ul className={styles.complete}>
							{
								this.state.completeData.map((item,index) =>{
									return (
										<li className={styles.listItem} key={index}>
											<Link to={`/taskCompleteDetails/${item.id}`} className={styles.listLink}>
												<h3 className={styles.name}>{item.name}</h3>
												<div className={styles.column}>
													<p className={styles.realName}>{item.realName}</p>
													<p className={styles.time}>{item.tm}</p>
												</div>
											</Link>
										</li>
									)
								})
							}
							<div className={classnames({[`${styles.status}`]: this.state.isComplete})}>
								<NoContents/>
							</div>
						</ul>
						{/*巡检记录*/}
						<ul className={styles.patrolRecord}>
							{
								this.state.patrolRecordData.length > 0 ?
								this.state.patrolRecordData.map((item,index) =>{
									return (
										<li className={styles.listItem} key={index} onClick={()=>this.handleClickPatrolRecord(item)}>
											<h3 className={styles.name}>{item.result}</h3>
											<div className={styles.column}>
												<p className={styles.realName}>{item.realName}</p>
												<p className={styles.time}>{item.tm}</p>
											</div>
										</li>
									)
								}) : null
							}
							<div className={classnames({[`${styles.status}`]: this.state.isPatrolRecord})}>
								<NoContents/>
							</div>
						</ul>
					</Tabs>
				</div>
				{
					this.state.isShowPatrolRecord ?
					<PatrolRecordPopup content={this.state.patrolRecordContent} isShow={this.state.isShowPatrolRecord} handleClickHide={this.handleClickHide}/>:
					null
				}
			</div>
		)
	}
}
