import React from 'react'
import Axios from 'utils/Axios'
import axios from 'axios'
import qs from 'qs'
import classnames from 'classnames'
import F2 from '@antv/f2/lib/index'
import ScrollBar from '@antv/f2/lib/plugin/scroll-bar'
import styles from './style.less'
import { FormatDate } from 'utils/format'
// 注册插件 ScrollBar
F2.Chart.plugins.register(ScrollBar)  // 这里进行全局注册，也可以给 chart 的实例注册
import { Toast } from 'antd-mobile'

export default class DetailsMain extends React.Component {

	constructor(props) {
		super(props);
		this.state={
	  	dataSource:[],
			reverDataSource:[],
			collect: false,
			collectionList: []
		}
	}

	componentDidMount() {
		this.props.onRef(this)
	  this.isDataChange(this.props.detailsTitle,this.props.sParese)
		// 收藏列表
	  let userID = sessionStorage.getItem('userID')
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'post',
			url: process.env.APP_URL+'/business/StWasR/findSysFocusStation',
			data: qs.stringify({
				userId: userID
		  })
		}).then((response)=> {
			this.setState({collectionList: response.data})
		}).catch((error)=> {
			console.log(error,'error')
		})
	}

	UNSAFE_componentWillReceiveProps(nextProps){
		let newData = nextProps.detailsTitle;
		if(newData!==this.props.detailsTitle) {
		return this.isDataChange(newData,nextProps.sParese);
		}
	}
	
	isDataChange(detailsTitle,newsParese) {
		let sParese = detailsTitle ;
		if(sParese.indexOf('外江水位')!==-1||sParese.indexOf('港渠水位')!==-1) {
			this.initData('LOAD_RWDB_RIVER',newsParese);
		}
		if(sParese.indexOf('闸站水位')!==-1) {
			this.initData('LOAD_RWDB_WAS',newsParese);
		}
		if(sParese.indexOf('渍水')!==-1) {
			this.initData('LOAD_RWDB_WATERLOGGING',newsParese);
		}
		if(sParese.indexOf('液位')!==-1) {
			this.initData('LOAD_RWDB_LIQUID',newsParese);
		}
		if(sParese.indexOf('雨量')!==-1) {
			this.initData('LOAD_RWDB_PPTN',newsParese);
		}
	}
	initData(TYPE,sParese){
		this.setState({dataSource:[],reverDataSource:[]});
		let This = this;
		let nowTime = (new Date()).getTime();
		let severnTime = nowTime -7*24*3600*1000;
		if(TYPE=="LOAD_RWDB_LIQUID"){
			severnTime = nowTime - 24*3600*1000;
		}
		Axios.newAjax({
			url: "/business/common/action",
			TYPE:TYPE,
			CDN:{
				stcd:sParese.STCD,
				btime: FormatDate("yyyy-MM-dd hh:mm:ss",new Date(severnTime)),
				etime: FormatDate("yyyy-MM-dd hh:mm:ss",new Date())
			}
		}).then((data)=>{
			let reverDataSource = []
			let dataSource = []
			for (let i = 0; i < data.length; i++) {
				if (data[i].TM.substring(0, 10) == data[data.length-1].TM.substring(0, 10)) {
					reverDataSource.push(data[i])
					dataSource.push(data[i])
				}
				if (data[i].TM.substring(0, 10)==undefined||data[i].TM.substring(0, 10)==null) {
					reverDataSource.push(data[i])
					dataSource.push(data[i])
				}
			}
			if (reverDataSource.length > 800) {
				reverDataSource.splice(0, reverDataSource.length/1.25)
			}else if (reverDataSource.length > 500) {
				reverDataSource.splice(0, reverDataSource.length/1.5)
			}else if (reverDataSource.length > 300) {
				reverDataSource.splice(0, reverDataSource.length/2)
			}
			this.setState({dataSource:dataSource, reverDataSource:reverDataSource.reverse()},()=>{
				This.chartRender();
			})
		})
	}
	chartRender = ()=> {
		let This = this;
		// F2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
		let chartData = This.state.dataSource;
		let tickCount = [];
		let newDateSource = [];
		chartData.map((item)=>{
			if(item.STNM&&item.STNM.indexOf("闸")!==-1) {
				let frontWaterLevel ={
					TM:item.TM,
					Z:item.UPZ,
					TYPE:'闸前水位',
					DWZ:item.DWZ,
					SDWWPTN:item.SDWWPTN,
					STCD:item.STCD,
					STNM: item.STNM,
					SUPWPTN:item.SUPWPTN,
					UPZ:item.UPZ
				}
				let afterWaterLevel = {
					TM:item.TM,
					Z:item.DWZ,
					TYPE:'闸后水位',
					DWZ:item.DWZ,
					SDWWPTN:item.SDWWPTN,
					STCD:item.STCD,
					STNM: item.STNM,
					SUPWPTN:item.SUPWPTN,
					UPZ:item.UPZ
				}
				tickCount.push(frontWaterLevel.Z,afterWaterLevel.Z,);
				newDateSource.push(frontWaterLevel,afterWaterLevel);
			}else {
				tickCount.push(item.Z);
				newDateSource.push(item);
			}
		})

		// F2图表
		const chart = new F2.Chart({
      id: This.refs.myChart,
      pixelRatio: window.devicePixelRatio
    })
    let defs = {
			TM: {
				type: 'timeCat',
				mask: 'HH:mm',
				tickCount: 10,
				range: [0, 1],
				min: '00:00',
        max: '03:00',
				alias: '监测时间'
			},
			Z: {
				alias: '水位监测值'
			}
		}
    chart.source(newDateSource,defs);
    chart.tooltip({
      showCrosshairs: true,
      showItemMarker: false,
      background: {
        radius: 2,
        fill: '#1890FF',
        padding: [4, 6]
      },
      nameStyle: {
        fill: '#fff'
      },
      onShow: (ev)=> {
        let items = ev.items;
        items[0].name = `监测时间：${items[0].title} 水位监测值`
      }
    });
    chart.line().position('TM*Z')
    // 定义进度条
    chart.scrollBar({
      mode: 'x',
      xStyle: {
        offsetY: -5
      }
    })
    chart.render()
	}

	changeCollectState = ()=> {
		this.setState({collect: true})
	}
	changeNoCollectState = ()=> {
		this.setState({collect: false})
	}

	handleClickCollect = ()=> {
		let STCD = this.props.STCD
		let collectionList = this.state.collectionList
		console.log(STCD,collectionList)
		for (let i = 0; i < collectionList.length; i++) {
			if (collectionList[i].stcd === STCD) {
				console.log(collectionList[i].id)
				axios({
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					method: 'post',
					url: process.env.APP_URL+'/business/StWasR/deleteUserFocus',
					data: qs.stringify({
						id: collectionList[i].id
				  })
				}).then((response)=> {
					console.log(response)
					this.setState({collect: false})
					Toast.info('取消收藏',1.5)
				}).catch((error)=> {
					console.log(error,'error')
					Toast.info('取消失败',1.5)
				})
			}
		}
	}
	handleClickNoCollect = ()=> {
		let STCD = this.props.STCD
		let userID = sessionStorage.getItem('userID')
		console.log(STCD,userID)
		axios({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'post',
			url: process.env.APP_URL+'/business/StWasR/insertUserFocus',
			data: qs.stringify({
				userId: userID,
				stcd: STCD
		  })
		}).then((response)=> {
			console.log(response)
			this.setState({collect: true})
			Toast.info('收藏成功',1.5)
		}).catch((error)=> {
			console.log(error,'error')
			Toast.info('收藏失败',1.5)
		})
	}

	renderLevelReverData = ()=> {
		if (this.props.sParese.COMMENTS == 'SW,YL,ZZ' || this.props.sParese.COMMENTS == 'SW,ZDH,ZZ') {
			return(
				<div className={styles.level}>
					当前水位：{this.state.reverDataSource[0]&&this.state.reverDataSource[0].UPZ}/{this.state.reverDataSource[0]&&this.state.reverDataSource[0].DWZ} (m)
				</div>
			)
		}else {
			if (this.props.sParese.COMMENTS == 'ZS'||this.props.sParese.COMMENTS == 'ZS,LED') {
				return(
					<div className={styles.level}>当前水位：{this.state.reverDataSource[0]&&this.state.reverDataSource[0].Z} (cm)</div>
				)
			}else if(this.props.sParese.COMMENTS == 'YL,WD') {
				return(
					<div className={styles.level}>当前水位：{this.state.reverDataSource[0]&&this.state.reverDataSource[0].Z} (mm)</div>
				)
			}else {
				return(
					<div className={styles.level}>当前水位：{this.state.reverDataSource[0]&&this.state.reverDataSource[0].Z} (m)</div>
				)
			}
		}
	}
	renderCurrentReverData = ()=>{
		if (this.props.sParese.COMMENTS == 'SW,YL,ZZ' || this.props.sParese.COMMENTS == 'SW,ZDH,ZZ') {
			return (
				<li>
					<span>当前监测值：</span>
					<em>{this.state.reverDataSource[0]&&this.state.reverDataSource[0].UPZ}/{this.state.reverDataSource[0]&&this.state.reverDataSource[0].DWZ}
					</em> (m)
				</li>
			)
		}else {
			if (this.props.sParese.COMMENTS == 'ZS'||this.props.sParese.COMMENTS == 'ZS,LED') {
				return (
					<li>
						<span>当前监测值：</span>
						<em>{this.state.reverDataSource[0]&&this.state.reverDataSource[0].Z}</em> (cm)
					</li>
				)
			}else if(this.props.sParese.COMMENTS == 'YL,WD') {
				return (
					<li>
						<span>当前监测值：</span>
						<em>{this.state.reverDataSource[0]&&this.state.reverDataSource[0].Z}</em> (cm)
					</li>
				)
			}else {
				return (
					<li>
						<span>当前监测值：</span>
						<em>{this.state.reverDataSource[0]&&this.state.reverDataSource[0].Z}</em> (m)
					</li>
				)
			}
		}
	}

	render() {
		let liList = this.state.reverDataSource && this.state.reverDataSource.map((item,key) => {
			return <li className={styles.item} key={key}>
				<section>
					<span className={styles.times}>{item.TM}</span>
					{this.props.sParese.COMMENTS == 'SW,YL,ZZ' || this.props.sParese.COMMENTS == 'SW,ZDH,ZZ'?
						<span className={styles.waterLevel}>
							<span className={styles.UPZ}>{item.UPZ}</span>
							<span className={styles.DWZ}>{item.DWZ}</span>
						</span>:
						<span className={styles.waterLevelOnter}>{item.Z}</span>
					}
				</section>
			</li>
		})
		return (
			<div className={styles.detailsMain}>
				<h3 className={styles.title} onTouchStart={this.props.touchStartTop}>{this.props.detailsTitle}监测点</h3>
				<div className={styles.collect}>
					{
						this.state.collect ?
						<i className='iconfont icon-shoucang' onClick={this.handleClickCollect}></i> :
						<i className='iconfont icon-weishoucang' onClick={this.handleClickNoCollect}></i>
					}
				</div>
				<div className={classnames(styles.primary, {[`${styles.active}`]: this.props.isPrimary})}>
					<div className={styles.location}>
						<span>地理位置：</span>
						<p>{this.props.sParese.STLC}</p>
					</div>
					{this.renderLevelReverData()}
					<div className={styles.time}>监测时间：{this.state.reverDataSource[0]&&this.state.reverDataSource[0].TM}</div>
				</div>
				<div className={classnames(styles.details, {[`${styles.active}`]: this.props.isDetails})} id="details">
					<ul className={styles.info} onTouchStart={this.props.touchStartTop}>
						<li><span>类型：</span><em>{this.props.detailsTitle.split("-")[1]}</em></li>
						{this.renderCurrentReverData()}
						<li className={styles.width100}><span>地理位置：</span><em>{this.props.sParese.STLC}</em></li>
						<li className={styles.width100}><span>监测时间：</span><em>{this.state.reverDataSource[0]&&this.state.reverDataSource[0].TM.split("-")[1]+"月"+
						this.state.reverDataSource[0].TM.split("-")[2]}</em></li>
					</ul>
					<div className={styles.grayBar} onTouchStart={this.props.touchStartTop}></div>
					{/*图表*/}
					<canvas id="myChart" ref='myChart'></canvas>
					<div className={styles.tooltip} ref='f2Tooltip'>
						<span></span>
						<span></span>
					</div>
					{/*ref="detailsList"*/}
					<ul className={styles.detailsList} ref="detailsList">
						{liList}
					</ul>
				</div>
			</div>
		)
	}
}