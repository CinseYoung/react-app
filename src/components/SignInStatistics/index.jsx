import React from 'react'
import AMap from 'AMap'
import axios from 'axios'
import qs from 'qs'
import { Tabs } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { NoData } from 'components/Status'
import { FormatDate } from 'utils/format'
import styles from './style.less'

const tabs = [
  { title: '人员签到', sub: '1' },
  { title: '车辆签到', sub: '2' }
]

export default class SignInStatistics extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			time: '',
			personnelList:[],
			vehicleList:[]
		}
	}
	componentDidMount() {
		this.setState({time: `${FormatDate('yyyy-MM-dd',new Date())}`},()=>{
			this.getSignInStatisticsData()
		})
	}

	getSignInStatisticsData = ()=> {
		let This = this
		console.log(This.state.time)
		// 人员签到列表
		axios.post(process.env.APP_URL + '/business/fhsignininfo/tableData',
			qs.stringify({tm: This.state.time}),
      {headers: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}}
    ).then(function(response) {
			let resultData = response.data
			let personnelList = []
			for (let i = 0; i < resultData.length; i++) {
				let lnglat = [resultData[i].lgtd,resultData[i].lttd]
				This.regeoCode(lnglat).then(result => {
					let list = { name: resultData[i].realName, time: `${resultData[i].tm} 签到`, remark: resultData[i].remark, address: result, lnglat: lnglat }
					personnelList.push(list)
					This.setState({ personnelList })
				})
			}
		}).catch(function(error) {
			console.log(error)
		})

		// 车辆签到列表
		axios.post(process.env.APP_URL + '/business/fhcarsignininfo/tableData',
			qs.stringify({tm: This.state.time}),
      {headers: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}}
    ).then(function(response) {
			let resultData = response.data
			let vehicleList = []
			for (let i = 0; i < resultData.length; i++) {
				let lnglat = [resultData[i].lgtd,resultData[i].lttd]
				This.regeoCode(lnglat).then(result => {
					let list = { name: resultData[i].plateno, time: `${resultData[i].tm} 签到`, remark: resultData[i].remark, address: result, lnglat: lnglat }
					vehicleList.push(list)
					This.setState({ vehicleList })
				})
			}
		}).catch(function(error) {
			console.log(error)
		})
	}

	regeoCode = async (lnglat)=> {
		let address = ''
		let geocoder = new AMap.Geocoder({
			city: "010", //城市设为北京，默认：“全国”
			radius: 1000 //范围，默认：500
		})
		let promise = new Promise(resolve => {
			geocoder.getAddress(lnglat, function(status, result) {
				if (status === 'complete'&&result.regeocode) {
					address = result.regeocode.formattedAddress
					resolve(address)
				}else{
					console.log('根据经纬度查询地址失败')
				}
			})
		})
		let promiseResult = await promise
		return promiseResult
	}

	render() {
		return (
			<div className={styles.signInStatistics}>
				<Tabs tabs={tabs} initialPage={0} tabBarPosition="top" renderTab={tab => <span>{tab.title}</span>}>
	        <ul className={styles.list}>
						{this.state.personnelList.map((item,index)=>{
							return(
								<li key={index}>
									<Link to={{pathname:'/signInDetails',query:{name: item.name,time:item.time,address:item.address,lnglat: item.lnglat}}}>
										<div className={styles.header}><span>{item.name.substr(0,1)}</span></div>
										<div className={styles.sidebar}>
											<div className={styles.title}>
												<h3 className={styles.name}>{item.name}</h3>
												<h4>{item.time}</h4>
											</div>
											<p className={styles.remark}>{item.remark}</p>
											<p className={styles.address}><i className="iconfont icon-weizhi"></i>{item.address}</p>
										</div>
									</Link>
								</li>
							)
						})}
						{this.state.personnelList.length < 1 ? <NoData/> :null}
					</ul>
		      <ul className={styles.list}>
						{this.state.vehicleList.map((item,index)=>{
							return(
								<li key={index}>
									<Link to={{pathname:'/signInDetails',query:{name: item.name,time:item.time,address:item.address,lnglat: item.lnglat}}}>
										<div className={styles.header}><span>{item.name.substr(0,1)}</span></div>
										<div className={styles.sidebar}>
											<div className={styles.title}>
												<h3 className={styles.name}>{item.name}</h3>
												<h4>{item.time}</h4>
											</div>
											<p className={styles.remark}>{item.remark}</p>
											<p className={styles.address}><i className="iconfont icon-weizhi"></i>{item.address}</p>
										</div>
									</Link>
								</li>
							)
						})}
						{this.state.vehicleList.length < 1 ? <NoData/> :null}
					</ul>
		    </Tabs>
			</div>
		)
	}
}