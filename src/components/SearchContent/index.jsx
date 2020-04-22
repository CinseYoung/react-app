import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { SearchBar } from 'antd-mobile'
// import PointData from 'public/data/monitoring'
import styles from './style.less'
import axios from "utils/Axios";

// 用装饰器简写方式
@connect(
    // 你要state什么属性放到props里
    state => ({
    	globalMap: state.globalMap,
    	monitoring: state.monitoring,
    	circleClickFn: state.circleClickFn
    })
)
export default class SearchContent extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: '',
			searchValue: '',
			searchList: [],
			isShow: false,
			PointData:[]
		}
	}
  componentDidMount(){
		let This = this;
		axios.ajax({
			url: '/business/ststbprpb/tableData',
			data:{
				isShowLoading: false
			}
		}).then((data)=>{
			This.setState({
				PointData: data
			})
		})
	}
	handleClickSearchContent = (event) => {
		if (event.target.id == 'searchContent') {
			this.refs.searchContent.style.cssText = 'top: 1000px'
		}
	}

	handleChangeSearch = (value) => {
		if (value === '') {
			this.setState({
				value: value,
				searchList: [],
				isShow: false
			})
			return
		}
		let arrList = this.state.PointData.filter(function (e) { return e.STCD.toLowerCase().includes(value.toLowerCase()) })
		this.setState({
			value: value,
			searchList: arrList,
			isShow: true
		})
	}

	handleCancelSearch = () => {
		this.refs.searchContent.style.cssText = 'top: 1000px'
		this.setState({
			value: '',
			searchList: [],
			isShow: false
		})
	}

	handleClickSearchList = (event) => {
		let el = event.currentTarget
		let globalMap = this.props.globalMap
		let searchListID = el.querySelector('h3').innerHTML
		let detailsPopup = document.querySelector('#detailsPopup')
		this.refs.searchContent.style.cssText = 'top: 1000px'
		let circleMarkers = this.props.monitoring
		console.log(this.props.circleClickFn,'circleClickFn')
		for (let i = 0; i < circleMarkers.length; i++) {
			let ID = circleMarkers[i].getExtData().id
			if (ID === searchListID) {
				detailsPopup.style.cssText = `bottom: 0px !important;`
				globalMap.setZoom(14)
				globalMap.panTo([circleMarkers[i].getPosition().lng,circleMarkers[i].getPosition().lat])
				circleMarkers[i].setAnimation('AMAP_ANIMATION_DROP')
				// 调用 DetailsPopup 组件里面的 circleClickFn 方法
				this.props.circleClickFn(circleMarkers[i])
			}
		}
	}

	render() {
		return (
			<div className={styles.searchContent} ref='searchContent' id='searchContent' onClick={this.handleClickSearchContent}>
				<div className={styles.search}>
					<SearchBar
						defaultValue
						value={this.state.value}
						placeholder="搜索监测站"
						maxLength={15}
						onChange={this.handleChangeSearch}
						onCancel={this.handleCancelSearch}
						ref='manualFocusInst'
					/>
				</div>
				<ul className={classnames(styles.searchList, {[`${styles.showSearchList}`]: this.state.isShow})}>
					{
						this.state.searchList.map((item,index) =>{
							return (
								<li key={index} onClick={this.handleClickSearchList}><h3>{item.STCD}</h3><p>{item.STLC}</p></li>
							)
						})
					}
				</ul>
			</div>
		)
	}
}
