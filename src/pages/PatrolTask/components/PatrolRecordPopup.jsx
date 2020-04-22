import React from 'react'
import axios from 'axios'
import qs from 'qs'
import classnames from 'classnames'
import { NavBar } from 'antd-mobile'
import styles from './patrolRecordPopup.less'

export default class PatrolRecordPopup extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			istViewData: [],
			imageID: [],
			imgList: []
		}
	}
	componentDidMount() {
		console.log(this.props.content,'content')
		let listViewData = this.props.content
		let imageID = [listViewData[0].image]
		this.setState({listViewData})
		if (imageID[0] !== null) {
			this.setState({imageID}, ()=>{
				this.getImageList()
			})
		}
	}
	getImageList = ()=>{
		axios({
			method: 'post',
			url: process.env.APP_URL+'/file/getFilePath',
			data: qs.stringify({
				ids: this.state.imageID.join(',')
		  })
		}).then((response)=> {
			console.log(response.data,'imgList')
			this.setState({imgList: response.data})
		}).catch((error)=> {
			console.log(error,'error')
		})
	}

	render() {
		return (
			<div className={classnames(styles.patrolRecordPopup, {[`${styles.isShowPatrolRecord}`]: this.props.isShow})}>
				<NavBar className={styles.navBar} mode='light' 
					icon={<i className="iconfont icon-ca" style={{color: '#666'}}></i>} 
					onLeftClick={() => this.props.handleClickHide()}>
          巡检记录详情
        </NavBar>
        <div className={styles.content}>
					{
						this.props.content.map((item,index)=>{
							return (
								<ul className={styles.listMain} key={index}>
									<li><span>巡检人：</span><p>{item.realName}</p></li>
									<li><span>巡检时间：</span><p>{item.tm}</p></li>
									<li><span>设备名称：</span><p>{item.stnm}</p></li>
									<li><span>设备地址：</span><p>{item.stlc}</p></li>
									<li><span>设备状态：</span><p>{item.equipStatus==0 ? '正常' : '故障'}</p></li>
									<li><span>巡检结果：</span><p>{item.result}</p></li>
								</ul>
							)
						})
					}
					<div className={styles.imgListColumn}>
						<h3 className={styles.subtitle}>事件图片：</h3>
						<div className={styles.imgList}>
							{this.state.imgList.map((item,index)=>{
								return <img src={`${process.env.APP_URL}/upload/`+item} alt="" key={index}/>
							})}
						</div>
					</div>
        </div>
			</div>
		)
	}
}