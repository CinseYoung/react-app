import React from 'react'
import { NavBar, Tabs } from 'antd-mobile'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from './style.less'

const tabs = [
  { title: '已收短信', sub: '1' },
  { title: '已发短信', sub: '2' }
]

export default class Message extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			initialPage: sessionStorage.getItem('initialPage') ? sessionStorage.getItem('initialPage') : '0',
			smsReceiverDetail: [],
			smsSenderDetail: []
		}

		// 修改安卓 StatusBar 颜色
		if (process.env.NODE_ENV === 'production') {
			if (typeof cordova !== 'undefined' && cordova.platformId == 'android') {
				StatusBar.overlaysWebView(false)
				StatusBar.styleDefault()
				StatusBar.backgroundColorByHexString('#ffffff')
			}
		}
	}

	componentDidMount() {
		this.getDataDetail()
	}

	handleChangeTab = (tab)=> {
		if (tab.sub == 1) {
			sessionStorage.setItem('initialPage', tab.sub)
		}
		if (tab.sub == 2) {
			sessionStorage.setItem('initialPage', tab.sub)
		}
	}
	getDataDetail = ()=> {
		let This = this
		let userID = sessionStorage.getItem('userID')
		// 收件人数据
		axios({
			url: process.env.APP_URL+'/business/smsrecorddetail/tableData',
			headers: {'Content-Type': 'application/json'},
			method: 'post',
			data: JSON.stringify({
				receiverId: userID,
				pageNo: 1,
				pageSize: 10
		  })
		}).then(function (response) {
			console.log(response.data.result.list,'response')
			This.setState({smsReceiverDetail: response.data.result.list})
		}).catch(function (error) {
			console.log(error,'error')
		})

		// 发件人数据
		axios({
			url: process.env.APP_URL+'/business/smsrecorddetail/tableData',
			headers: {'Content-Type': 'application/json'},
			method: 'post',
			data: JSON.stringify({
				senderId: userID,
				pageNo: 1,
				pageSize: 10
		  })
		}).then(function (response) {
			console.log(response.data.result.list,'response')
			This.setState({smsSenderDetail: response.data.result.list})
		}).catch(function (error) {
			console.log(error,'error')
		})
	}

	render() {
		return (
			<div className={styles.message}>
				<NavBar
					className={styles.navBar}
					mode="light"
					icon={<i className="iconfont icon-back"
					style={{ color: '#666' }}></i>}
					onLeftClick={() => this.props.history.goBack()}>
					短信
				</NavBar>
				<div className={styles.messageMain}>
					<Tabs tabs={tabs} initialPage={this.state.initialPage-1} tabBarPosition="top" renderTab={tab => <span>{tab.title}</span>} onChange={this.handleChangeTab}>
		        <ul className={styles.list}>
		        	{this.state.smsReceiverDetail.map((item,index)=>{
								return(
									<li key={index}>
										<Link to={{pathname:'/messageDetails',query:{name: item.RECEIVER_NAME?item.RECEIVER_NAME:item.RECEIVER_PHONE,time:item.SEND_TIME,content:item.CONTENT}}}>
											<div className={styles.header}><span><i className="iconfont icon-ren"></i></span></div>
											<div className={styles.sidebar}>
												<div className={styles.title}>
													<h3 className={styles.name}>{item.RECEIVER_NAME ? item.RECEIVER_NAME : item.RECEIVER_PHONE}</h3>
													<h4>{item.SEND_TIME.substr(5)}</h4>
												</div>
												<p className={styles.content}>{item.CONTENT}</p>
											</div>
										</Link>
									</li>
								)
							})}
						</ul>
			      <ul className={styles.list}>
							{this.state.smsSenderDetail.map((item,index)=>{
								return(
									<li key={index}>
										<Link to={{pathname:'/messageDetails',query:{name: item.RECEIVER_NAME?item.RECEIVER_NAME:item.RECEIVER_PHONE,time:item.SEND_TIME,content:item.CONTENT}}}>
											<div className={styles.header}><span><i className="iconfont icon-ren"></i></span></div>
											<div className={styles.sidebar}>
												<div className={styles.title}>
													<h3 className={styles.name}>{item.RECEIVER_NAME ? item.RECEIVER_NAME : item.RECEIVER_PHONE}</h3>
													<h4>{item.SEND_TIME.substr(5)}</h4>
												</div>
												<p className={styles.content}>{item.CONTENT}</p>
											</div>
										</Link>
									</li>
								)
							})}
						</ul>
		    	</Tabs>
		    	<div className={styles.addMsg}><Link to="/sendMessage"><i className="iconfont icon-add"></i></Link></div>
				</div>
			</div>
		)
	}
}