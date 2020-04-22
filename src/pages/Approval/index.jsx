import React from 'react'
import axios from 'axios'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { Tabs, Badge, NavBar, Toast } from 'antd-mobile'
import { NoContents, NoNetwork } from 'components/Status'
import styles from './style.less'


function loadingToast() {
	Toast.loading('加载中...', 0, () => {
		console.log('加载中！！！')
	})
}

export default class Approval extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			tabs: [
				{ title: <Badge text={''}>待处理</Badge>, sub: '1' },
				{ title: <Badge text={''}>处理中</Badge>, sub: '2' },
				{ title: <Badge text={''}>全部完成</Badge>, sub: '3' }
			],
			badge: 3,
			modal: false,
			listData: [],
			isContents: true,
			isNetwork: true
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
		loadingToast()
		const This = this
		axios.post(process.env.APP_URL + '/business/dikesurveyrecords/tableData').then(function (response) {
			if (response.data.code === 0) {
				let data = response.data.result.list
				Toast.hide()
				This.setState({
					listData: data
				})
				if (data.length === 0) {
					This.setState({
						isContents: false
					})
				}

				let Badge1 = []
				let Badge2 = []
				let Badge3 = []
				for (let i = 0; i < data.length; i++) {
					if (data[i].state == 1) {
						Badge1.push(data[i])
					}
					if (data[i].state == 2) {
						Badge2.push(data[i])
					}
					if (data[i].state == 3) {
						Badge3.push(data[i])
					}
				}
				This.setState({
					tabs: [
						{ title: <Badge text={Badge1.length}>待处理</Badge>, sub: '1' },
						{ title: <Badge text={Badge2.length}>处理中</Badge>, sub: '2' },
						{ title: <Badge text={''}>全部完成</Badge>, sub: '3' }
					]
				})

			}
		}).catch(function (error) {
			console.log(error)
			Toast.hide()
			This.setState({
				isNetwork: false
			})
		})
	}

	render() {
		return (
			<div className={styles.approval}>
				<NavBar className={styles.navBar} mode='light' 
					icon={<i className="iconfont icon-back" style={{color: '#666'}}></i>} 
					onLeftClick={() => this.props.history.goBack()}>
          事件审批
        </NavBar>

				{/*数据列表*/}
				<div className={styles.content}>
					<Tabs tabs={this.state.tabs} initialPage={0}>
						<div className={styles.pending}>
							<ul className={styles.list}>
								{
									this.state.listData.map((item,index) =>{
										if (item.state == 1) {
											return (
												<li className={styles.listItem} key={index}>
													<Link to={`/details/${item.id}`} className={styles.listLink}>
														<div className={styles.img}><img src={require(`../../static/images/listImg${1}.jpg`)} alt=""/></div>
														<div className={styles.sidebar}>
															<h2 className={styles.title}>{item.dikeUnit}</h2>
															<p className={styles.problem}>{item.record}</p>
															<div className={styles.time}>{item.reportTime}</div>
														</div>
														<i className="iconfont icon-daichuli"></i>
													</Link>
												</li>
											)
										}
									})
								}
							</ul>

							<div className={classnames({[`${styles.status}`]: this.state.isContents})}>
								<NoContents/>
							</div>
							<div className={classnames({[`${styles.status}`]: this.state.isNetwork})}>
								<NoNetwork/>
							</div>
						</div>

						<div className={styles.processing}>
							<ul className={styles.list}>
								{
									this.state.listData.map((item,index) =>{
										if (item.state == 2) {
											return (
												<li className={styles.listItem} key={index}>
													<Link to={`/details/${item.id}`} className={styles.listLink}>
														<div className={styles.img}><img src={require(`../../static/images/listImg${1}.jpg`)} alt=""/></div>
														<div className={styles.sidebar}>
															<h2 className={styles.title}>{item.dikeUnit}</h2>
															<p className={styles.problem}>{item.record}</p>
															<div className={styles.time}>{item.reportTime}</div>
														</div>
														<i className="iconfont icon-chuli"></i>
													</Link>
												</li>
											)
										}
									})
								}
							</ul>

							<div className={classnames({[`${styles.status}`]: this.state.isContents})}>
								<NoContents/>
							</div>
							<div className={classnames({[`${styles.status}`]: this.state.isNetwork})}>
								<NoNetwork/>
							</div>
						</div>

						<div className={styles.complete}>
							<ul className={styles.list}>
								{
									this.state.listData.map((item,index) =>{
										if (item.state == 3) {
											return (
												<li className={styles.listItem} key={index}>
													<Link to={`/details/${item.id}`} className={styles.listLink}>
														<div className={styles.img}><img src={require(`../../static/images/listImg${1}.jpg`)} alt=""/></div>
														<div className={styles.sidebar}>
															<h2 className={styles.title}>{item.dikeUnit}</h2>
															<p className={styles.problem}>{item.record}</p>
															<div className={styles.time}>{item.reportTime}</div>
														</div>
														<i className="iconfont icon-yichuli"></i>
													</Link>
												</li>
											)
										}
									})
								}
							</ul>

							<div className={classnames({[`${styles.status}`]: this.state.isContents})}>
								<NoContents/>
							</div>
							<div className={classnames({[`${styles.status}`]: this.state.isNetwork})}>
								<NoNetwork/>
							</div>
						</div>
					</Tabs>
				</div>
			</div>
		)
	}
}
