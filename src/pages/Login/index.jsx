import React from 'react'
import { actions } from '@/store'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import qs from 'qs'
import axios from 'axios'
import { Toast, ActivityIndicator } from 'antd-mobile'
import UpdatePopup from 'components/UpdatePopup'
import styles from './style.less'

const userLogin = actions.author.userLogin
const showUpPopup = actions.showUpdatePopup.showUpPopup

@connect(
	state=>state.auth,
	{ userLogin, showUpPopup }
)
export default class Login extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			version: '1.3.0',
			visible: false,
			username: 'admin',
			userpassword: '123',
			verification: '',
			verificationCode: '',
			animating: false
		}
		// 修改安卓 StatusBar 颜色
		if(process.env.NODE_ENV==='production'){
			if (typeof(cordova)!=='undefined' && cordova.platformId == 'android') {
		    StatusBar.overlaysWebView(false)
		    StatusBar.styleLightContent()
		    StatusBar.backgroundColorByHexString('#000000')
			}
		}
	}

	componentDidMount() {
		let version = this.state.version
		// 设置软件版本号
		sessionStorage.setItem('version', version)
		axios.get(process.env.APP_URL + '/business/android/getVersion').then((response)=> {
			let versionName = response.data.data.name
			// 判断当前版本是否是最新版本
			if (version !== versionName && parseFloat(versionName)>parseFloat(version)) {
				this.props.showUpPopup()
			}
		}).catch((error)=> {
			console.log(error)
		})
		// 验证码
		axios({
			responseType: 'arraybuffer',
			method: 'get',
			url: process.env.APP_URL+'/admin/Verification'
		}).then((response)=> {
			let verificationCode = 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((response, byte) => response + String.fromCharCode(byte), ''))
			this.setState({verificationCode})
		}).catch((error)=> {
			console.log(error,'error')
		})
		// 初始化Navigation的Tab状态显示首页
    sessionStorage.setItem('selectedTab', 'Tab1')
	}

	handleChangeName = (event)=> {
		const value = event.target.value
		this.setState({
			visible: false,
			username: value
		})
	}
	handleChangePassword = (event)=> {
		const value = event.target.value
		this.setState({
			visible: false,
			userpassword: value
		})
	}
	handleChangeVerification = (event)=> {
		const value = event.target.value
		this.setState({
			visible: false,
			verification: value
		})
	}
	handleClickVerification = ()=> {
		let This = this
		axios({
			responseType: 'arraybuffer',
			method: 'get',
			url: process.env.APP_URL+'/admin/Verification'
		}).then(function (response) {
			let verificationCode = 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((response, byte) => response + String.fromCharCode(byte), ''))
			This.setState({verificationCode})
		}).catch(function (error) {
			console.log(error,'error')
		})
	}

	showPopup = ()=> {
		let username = this.state.username
		let password = this.state.userpassword
		//let verification = this.state.verification
		let appLoginParam = 'app'
		this.setState({ animating: !this.state.animating })
		//this.props.userLogin()
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'post',
			url: process.env.APP_URL+'/admin/login',
			data: qs.stringify({
				username,
				password,
				appLoginParam
			})
		}).then((response)=> {
			console.log(response.data,'登录成功！')
			console.log(response.data.code == 0)
			this.setState({ animating: !this.state.animating })
			// 登录成功
			if (response.data.code == 0) {
				let userID = response.data.result
				sessionStorage.setItem('userID', userID)
				this.props.userLogin()
			}else{
				Toast.offline(response.data.msg, 1.5)
			}
		}).catch((error)=> {
			this.setState({ animating: !this.state.animating })
			console.log(error)
			Toast.offline('登录错误，请重试！', 1.5)
		})
	}

	render() {
		return (
			<div className={styles.login}>
				{this.props.isAuth ? <Redirect to='/'/> : null}
				<div className={styles.loginBG}></div>
				<div className={styles.logo}></div>
				<h3 className={styles.title}>临空港智慧水务</h3>
				<div className={styles.userinfo}>
					<div className={styles.username}>
						<i className="iconfont icon-people_fill"></i>
						<input type="text" placeholder='默认为 admin' value={this.state.username} onChange={this.handleChangeName}/>
					</div>
					<div className={styles.userpassword}>
						<i className="iconfont icon-lock_fill"></i>
						<input type="password" placeholder='默认为 123' value={this.state.userpassword} onChange={this.handleChangePassword}/>
					</div>
					{/*<div className={styles.verification}>
						<i className="iconfont icon-yanzhengma"></i>
						<div className={styles.verificationColumn}>
							<input type="text" placeholder='请输入验证码' value={this.state.verification} onChange={this.handleChangeVerification}/>
							<img src={this.state.verificationCode} alt="" onClick={this.handleClickVerification}/>
						</div>
					</div>*/}
				</div>
				<button className={styles.button} onClick={this.showPopup}>登 录</button>
				<ActivityIndicator toast text="Loading..." animating={this.state.animating} />
				{/*提示升级弹窗*/}
				<UpdatePopup/>
			</div>
		)
	}
}
