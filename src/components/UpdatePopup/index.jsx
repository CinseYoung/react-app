import React from 'react'
import axios from 'axios'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Progress, Toast } from 'antd-mobile'
import { actions } from '@/store'
import styles from './style.less'

const hideUpPopup = actions.showUpdatePopup.hideUpPopup

// 用装饰器简写方式
@connect(
	// 你要state什么属性放到props里
	state => ({ showUpdatePopup: state.showUpdatePopup }),
	// 你要什么方法，放到props里，自动dispatch
	{ hideUpPopup }
)
export default class UpdatePopup extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			percent: 0,
			isShow: false,
			isShowPercent: true,
			version: '',
			remark: [],
			url: ''
		}
	}

	componentDidMount() {
		let This = this
		axios.get(process.env.APP_URL + '/business/android/getVersion').then(function(response) {
			let remark = response.data.data.remark.split('\\n')
			This.setState({
				version: response.data.data.name,
				remark: remark,
				url: response.data.data.url
			})
		}).catch(function(error) {
			console.log(error)
		})
	}
	
	handleClickIsShow = () => {
		this.props.hideUpPopup()
	}
	handleClickUpdate = () => {
		if(process.env.NODE_ENV==='production'){
			if (typeof(cordova)!=='undefined' && cordova.platformId == 'android') {
		    this.createFile()
			}
		}
	}

	// 创建文件方法
	createFile = ()=> {
		let This = this
		window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(fs) {
  		fs.getFile('whdxhzhsw-app.apk', {create: false}, function(fileEntry) {
  			fileEntry.remove()
  		})
			fs.getFile( 'whdxhzhsw-app.apk', { create: true, exclusive: true },function(fileEntry) {
					// 创建成功回调下载方法写入文件
					This.downloadApk(fileEntry)
				},function(error) {
					// 失败回调
					console.log(error)
					Toast.fail('读取文件失败', 3)
				}
			)},function(error) {
				console.log(error)
				Toast.fail('进入文件系统失败！', 3)
			}
		)
	}
	// 下载 apk
	downloadApk = (fileEntry) => {
		let This = this
		// 初始化
		let fileTransfer = new FileTransfer()
		//监听下载进度
		fileTransfer.onprogress = function(e) {
			if (e.lengthComputable) {
				var progress = e.loaded / e.total
				// 显示下载进度
				let percent = (progress * 100).toFixed(2)
				This.setState({
					percent: percent,
					isShowPercent:false
				})
			}
		}
		// 使用fileTransfer.download开始下载
		fileTransfer.download(
			encodeURI('http://111.48.124.5:9010/app/whdxhzhsw-app.apk'), //uri网络下载路径
			fileEntry.toURL(), //文件本地存储路径
			function(entry) {
				// 下载完成执行本地预览
				if (This.state.percent > 1 || This.state.percent === 100) {
					entry.file(data => {
						console.log(data)
						This.previewApp(fileEntry)
					})
				}
			},function(error) {
				console.log(error)
				Toast.fail('下载失败！', 3)
			}
		)
	}
	// 打开app开方法
	previewApp = (fileEntry) => {
		cordova.plugins.fileOpener2.open(
			fileEntry.toInternalURL(),
			'application/vnd.android.package-archive'
		)
	}

	render() {
		return (
			<div className={classnames(styles.updatePopup, {[`${styles.updatePopupIsShow}`]: this.props.showUpdatePopup.isShowUpPopup })}>
				<div className={classnames({[`${styles.isShowPercent}`]: this.state.isShowPercent})}>
					<Progress percent={this.state.percent} position="fixed" />
				</div>
				<div className={styles.contentBG} onClick={this.handleClickIsShow}></div>
				<div className={styles.content}>
					<div className={styles.UpdateBg}>
						<img src={require(`../../static/images/update.png`)} alt="" />
					</div>
					<div className={styles.version}>
						<h2>发现新版本</h2>
						<p>V{this.state.version}</p>
					</div>
					<div className={styles.column}>
						<ul className={styles.list} ref="list">
							{this.state.remark.map((item, key) => {
								return <li key={key}>{item}</li>
							})}
						</ul>
						<button className={styles.updateButton} onClick={this.handleClickUpdate}>
							立即升级
						</button>
					</div>
				</div>
			</div>
		)
	}
}
