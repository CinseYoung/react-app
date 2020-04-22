import React from 'react'
import {NavBar} from "antd-mobile"
import styles from './style.less'
import DetailsMain from "components/DetailsPopup/detailsMain";
import axios from 'utils/Axios'

export default class GrossData extends React.Component {
	constructor(props) {
		super(props)
		this.state={
			isDetails:false,
			detailsTitle:'',
			isPrimary:true,
			sParese:{}
		}
	}

	componentDidMount(){
		this.initData()
	}

	initData = ()=> {
		let This = this
		 axios.ajax({
			url: '/business/ststbprpb/tableData'
		}).then((response)=>{
				let data = response
				let id = This.props.match.params.id
				for (let i = 0; i < data.length; i++) {
					if (data[i].STCD == id) {
							This.reloadInit(data[i])
					}
				}
		})
	}

	reloadInit = (sParese)=> {
		let monitoringName = ''
		// 外江水位监测点
		if (sParese.COMMENTS == 'SW-WJ') {
			monitoringName = `外江水位`
		}
		// 港渠水位监测点
		if (sParese.COMMENTS == 'SW-GQ') {
			monitoringName = `港渠水位`
		}
		// 闸站水位监测点
		if (sParese.COMMENTS == 'SW,YL,ZZ' || sParese.COMMENTS == 'SW,ZDH,ZZ') {
			monitoringName = `闸站水位`
		}
		//  渍水监测点
		if (sParese.COMMENTS == 'ZS' || sParese.COMMENTS == 'ZS,LED') {
			monitoringName = `渍水`
		}
		// 管网液位监测点
		if (sParese.COMMENTS == 'YW') {
			monitoringName = `液位`
		}
		// 气象监测点(雨量)
		if (sParese.COMMENTS == 'YL' || sParese.COMMENTS == 'YL,WD') {
			monitoringName = `雨量`
		}
		// 堤防视频监测点
		if (sParese.COMMENTS == 'SP') {
			monitoringName = `视频`
		}
		let detailsTitle = sParese.STCD +'-' + monitoringName
		this.setState({sParese,detailsTitle})
	}

	onRef = (ref)=> {
		this.detailsMain = ref
	}

	render() {
		return (
			<div className={styles.grossDataDeatil}>
				<div className={styles.navBarMain} ref="navBarMain">
					<NavBar
						className={styles.navBar}
						mode='light'
						icon={<i className="iconfont icon-back" style={{color: '#666'}}></i>}
						onLeftClick={() => this.props.history.goBack()}
					>
						数据总览详情
					</NavBar>
				</div>

				{/*数据总览详情*/}
				<DetailsMain
					onRef={this.onRef}
					detailsTitle={this.state.detailsTitle}
					isPrimary={this.state.isPrimary}
					isDetails={this.state.isDetails}
					sParese={this.state.sParese}
				/>
			</div>
		)
	}
}
