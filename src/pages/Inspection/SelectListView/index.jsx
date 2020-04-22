import React from 'react'
import axios from 'axios'
import qs from 'qs'
import { NavBar } from 'antd-mobile'
import styles from './style.less'

export default class SelectListView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			listViewData: [],
			imageID: [],
			imgList: []
		}
	}
	componentDidMount() {
		let listViewData = [this.props.history.location.query.data]
		console.log(listViewData,'listViewData')
		let imageID = [listViewData[0].imageID]
		console.log(imageID,'imageID')
		this.setState({listViewData})
		if (imageID[0] !== null) {
			this.setState({imageID}, ()=>{
				this.getImageList()
			})
		}
	}

	getImageList = ()=>{
		console.log(this.state.imageID.join(','))
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
			<div className={styles.selectListView}>
				<NavBar
					className={styles.navBar}
					mode='light'
					icon={<i className="iconfont icon-back" style={{color: '#666'}}></i>}
					onLeftClick={() => this.props.history.goBack()}
				>
					事件详情
				</NavBar>
				<div className={styles.main}>
					{this.state.listViewData.map((item,index)=>{
						return(
							<div key={index} className={styles.selectList}>
								<ul className={styles.list}>
									<li><span>上报地址：</span><h3>{item.location}</h3></li>
									<li><span>上报人：</span><h3>{item.reporter}</h3></li>
									<li><span>上报时间：</span><h3>{item.reportTime}</h3></li>
								</ul>
								<div className={styles.description}><span>事件描述：</span><p>{item.eventDes}</p></div>
								<div className={styles.imgListColumn}>
									<h3>事件图片：</h3>
									<div className={styles.imgList}>
										{this.state.imgList.map((item,index)=>{
											return <img src={`${process.env.APP_URL}/upload/`+item} alt="" key={index}/>
										})}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}