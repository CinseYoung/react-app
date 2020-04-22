import React from 'react'
import { actions } from '@/store'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import qs from 'qs'
import { Modal } from 'antd-mobile'
import AMaps from 'components/AMaps'
import Search from 'components/Search'
import SearchContent from 'components/SearchContent'
import Scale from 'components/Scale'
import Location from 'components/Location'
import MapTool from 'components/MapTool'
import LayerPopup from 'components/MapTool/LayerPopup'
import DetailsPopup from 'components/DetailsPopup'
import CollectionPopup from 'components/CollectionPopup'
import { FormatDate, TimestampToTime } from 'utils/format'
import styles from './style.less'

const userLogout = actions.author.userLogout
const setAddressList = actions.addressList.setAddressList
const setTaskListData = actions.taskListData.setTaskListData
const { showCollectionSidebar, afterShowCollectionSidebarAsync } = actions.showCollectionPopup

// 用装饰器简写方式
@connect(
	// 你要state什么属性放到props里
	state => ({
		globalMap: state.globalMap,
		Auth: state.auth
	}),
	// 你要什么方法，放到props里，自动dispatch
	{ userLogout, setAddressList, setTaskListData, showCollectionSidebar, afterShowCollectionSidebarAsync }
)
export default class App extends React.Component {

	constructor(props) {
		super(props)
		// 修改安卓 StatusBar 颜色
		if(process.env.NODE_ENV==='production'){
			if (typeof(cordova)!=='undefined' && cordova.platformId == 'android') {
		    StatusBar.overlaysWebView(false)
		    StatusBar.styleLightContent()
		    StatusBar.backgroundColorByHexString('#3d92fb')
			}
		}
	}
	componentDidMount() {
		axios.post(process.env.APP_URL + '/business/sysuser/appAddressList').then((response)=>{
			this.props.setAddressList(response.data.result)
		}).catch(function(error) {
			console.log(error)
		})
		this.getTaskListData()
	}
	// 巡检任务列表数据
	getTaskListData = ()=> {
		let userID = sessionStorage.getItem('userID')
		let isTaskList = sessionStorage.getItem('isTaskList')
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: process.env.APP_URL + '/business/pollingtask/tableData',
      method: 'post',
      data: qs.stringify({
      	personnel: parseInt(userID),
        btime: TimestampToTime(new Date().setMonth((new Date()).getMonth()-1)),
        etime: FormatDate("yyyy-MM-dd hh:mm:ss", new Date())
      })
    }).then((response)=>{
      let taskList = response.data
      this.props.setTaskListData(taskList)
      // 判断是否有巡检任务
      for (var i = 0; i < taskList.length; i++) {
      	if (taskList[i].status===0 || taskList[i].status===1) {
      		if (isTaskList!=='false') {
      			sessionStorage.setItem('isTaskList','false')
	      		Modal.alert('温馨提示', '你有巡检任务是否查看？', [
					    { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
					    { text: '确定', onPress: () => this.props.history.push('/patrolTask') }
					  ])
      		}
      		break
      	}
      }
    })
  }

	handleClickShowPopup = ()=> {
		this.props.showCollectionSidebar()
    this.props.afterShowCollectionSidebarAsync()
    this.collectionPopup.getCollectionList()
	}
	onRef = ref => {
    this.collectionPopup = ref
  }

	render() {
		let App = (
			<div className={styles.main}>
				{/*地图*/}
				<AMaps/>

				{/*搜索*/}
				<Search />
				<SearchContent />

				{/*我的*/}
				<div className={styles.info} onClick={this.handleClickShowPopup}>
					<i className='iconfont icon-shoucang'></i>
					<em>收藏</em>
				</div>

				{/*联系电话*/}
				<Link to='/contacts'>
					<div className={styles.telColumn}>
						<i className='iconfont icon-dianhua'></i>
						<em>联系人</em>
					</div>
				</Link>

				{/*联系电话*/}
				<Link to='/approval'>
					<div className={styles.approval}>
						<i className='iconfont icon-shenpi'></i>
						<em>审批</em>
					</div>
				</Link>

				{/* 定位 */}
				<Location/>

				{/*内容工具*/}
				<MapTool/>
				{/*图层弹窗*/}
				<LayerPopup/>

				{/*缩放*/}
				<Scale/>

				{/*弹窗*/}
				<DetailsPopup/>
				<CollectionPopup onRef={this.onRef}/>
			</div>
		)
		const redirectToLogin = <Redirect exact to='/login'></Redirect>
		return (this.props.Auth.isAuth ? App : redirectToLogin)
	}
}
