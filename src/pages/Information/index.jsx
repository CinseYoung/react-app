import React from 'react'
import { Redirect } from 'react-router-dom'
import { Modal, Toast } from 'antd-mobile'
import axios from 'axios'
import { actions } from '@/store'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import WaveAnimation from 'components/WaveAnimation'
import UpdatePopup from 'components/UpdatePopup'

import styles from './style.less'

const userLogout = actions.author.userLogout
const { showUpPopup, hideUpPopup } = actions.showUpdatePopup

const alert = Modal.alert
@connect(
	// 你要state什么属性放到props里
	state => ({
		Auth: state.auth,
		showUpdatePopup: state.showUpdatePopup 
	}),
	// 你要什么方法，放到props里，自动dispatch
	{ userLogout, showUpPopup, hideUpPopup }
)
export default class Information extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			userName: '',
			versionName: ''
		}
		// 修改安卓 StatusBar 颜色
		if (process.env.NODE_ENV === 'production') {
			if (typeof cordova !== 'undefined' && cordova.platformId == 'android') {
				StatusBar.overlaysWebView(false)
				StatusBar.styleLightContent()
				StatusBar.backgroundColorByHexString('#3ea0f8')
			}
		}
	}

	componentDidMount() {
		this.getAllUser()
		
	}

	getAllUser = ()=> {
		let userID = sessionStorage.getItem('userID')
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'post',
			url: process.env.APP_URL+'/business/sysuser/getAllUser'
		}).then((response)=> {
			let allUser = response.data.result
			for (let i = 0; i < allUser.length; i++) {
				if (allUser[i].id == userID) {
					this.setState({userName: allUser[i].name})
				}
			}
		}).catch((error)=> {
			console.log(error)
			Toast.offline('获取用户错误，请重试！', 1.5)
		})
	}

	handleClickVersion = ()=> {
		let This = this
		let version = sessionStorage.getItem('version')
		axios.get(process.env.APP_URL + '/business/android/getVersion').then(function(response) {
			let versionName = response.data.data.name
			// 判断当前版本是否是最新版本
			if (version !== versionName && parseFloat(versionName)>parseFloat(version)) {
				This.props.showUpPopup()
				console.log( This.props.showUpdatePopup.isShowUpPopup,' isShowUpPopup')
			}else {
				Toast.success('已经是最新版本了', 2)
			}
		}).catch(function(error) {
			console.log(error)
			This.props.hideUpPopup()
			Toast.fail('获取版本信息失败', 2)
		})
	}
	handleClickVideo = ()=> {
		cordova.exec((success)=>{
			alert(success)
		},(error)=>{
			alert(error)
		},'video','coolMethod',['rtsp://111.48.124.7:554/openUrl/BfbAOZ2'])
	}

	render() {
		return (
			<div className={styles.Information}>
				{this.props.Auth.isAuth ? null : <Redirect to={'/login'} />}

				<div className={styles.header}>
					{/*<i className="iconfont icon-back" onClick={() => this.props.history.goBack()}></i>*/}
					<WaveAnimation />
					<ul className={styles.bgList}>
						<li></li>
						<li></li>
						<li></li>
					</ul>
					<div className={styles.userInfo}>
						<div className={styles.userInfoHead}>
							<div className={styles.img}></div>
						</div>
						<div className={styles.userName}>
							<h3 className={styles.name}>{this.state.userName}</h3>
							<div className={styles.ascription}>
								<span>水务局</span>
								<span>巡检人员</span>
							</div>
						</div>
					</div>
				</div>
				<ul className={styles.list}>
					<li className={styles.listItem}>
						<Link to='patrolTask'>
							<div className={styles.item}>
								<div className={styles.itemLeft}>
									<i className="iconfont icon-xunjianguiji"></i>
									<span>巡检任务</span>
								</div>
								<div className={styles.itemRight}>
									{/*<span className={styles.tel}>027-1234567</span>*/}
									<i className="iconfont icon-arrow"></i>
								</div>
							</div>
						</Link>
					</li>
					<li className={styles.listItem}>
						<Link to='signIn'>
							<div className={styles.item}>
								<div className={styles.itemLeft}>
									<i className="iconfont icon-kaoqin"></i>
									<span>签到统计</span>
								</div>
								<i className="iconfont icon-arrow"></i>
							</div>
						</Link>
					</li>
					<li className={styles.listItem}>
						<Link to='message'>
							<div className={styles.item}>
								<div className={styles.itemLeft}>
									<i className="iconfont icon-duanxin"></i>
									<span>收发短信</span>
								</div>
								<i className="iconfont icon-arrow"></i>
							</div>
						</Link>
					</li>
					<li className={styles.listItem} onClick={this.handleClickVideo}>
						<div className={styles.item}>
							<div className={styles.itemLeft}>
								<i className="iconfont icon-mima"></i>
								<span>修改密码</span>
							</div>
							<i className="iconfont icon-arrow"></i>
						</div>
					</li>
					<li className={styles.listItem} onClick={this.handleClickVersion}>
						<div className={styles.item}>
							<div className={styles.itemLeft}>
								<i className="iconfont icon-version"></i>
								<span>当前版本号</span>
							</div>
							<div className={styles.itemRight}>
								<span className={styles.version}>{sessionStorage.getItem('version')}</span>
								<i className="iconfont icon-arrow"></i>
							</div>
						</div>
					</li>
				</ul>
				<div className={styles.button}>
					<button
						onClick={() =>
							alert('温馨提示', '是否退出登录？', [
								{ text: '取消', onPress: () => console.log('cancel') },
								{ text: '确定', onPress: () => this.props.userLogout() }
							])
						}
					>
						退出登录
					</button>
				</div>
				{/*提示升级弹窗*/}
				<UpdatePopup/>
			</div>
		)
	}
}
