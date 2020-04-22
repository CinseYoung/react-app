import React from 'react'
import { Link } from 'react-router-dom'
import { SearchBar } from 'antd-mobile'
// import axios from 'axios'
import { connect } from 'react-redux'
import SearchPopup from './SearchPopup'
import styles from './style.less'

@connect(
	state => ({
		addressList: state.addressList
	})
)
export default class Contacts extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			addressListData: [],
			searchData: [],
			isShowPopup: false
		}
		// 修改安卓 StatusBar 颜色
		if(process.env.NODE_ENV==='production'){
			if (typeof(cordova)!=='undefined' && cordova.platformId == 'android') {
		    StatusBar.overlaysWebView(false)
		    StatusBar.styleDefault()
		    StatusBar.backgroundColorByHexString('#ffffff')
			}
		}
	}
	
	componentDidMount() {
		this.setState({addressListData: this.props.addressList})
	}

	componentWillUnmount() {
  	// 卸载异步操作设置状态
	  this.setState = (state, callback) => {
	    return
	  }
	}

	// 搜索
	handleChangeSearch = (value)=> {
		this.handleSearchData(value)
	}
	handleSearchData = (value)=> {
		let data = []
		let searchAllData = this.search(this.props.addressList)
		searchAllData.forEach((child)=> {
			if (child.value && value !== '') {
				child.value.filter((e)=> {
					if (e.realName.toLowerCase().includes(value.toLowerCase())) {
						data.push(e)
						return data
					}
				})
			}
		})
		this.setState({searchData: data})
	}
	search = (tree)=>{
		if (!tree.value) {
			return tree
		}
	  tree.forEach((child)=>{
	  	if (child.value) {
	  		return this.search(child.value)
	  	}
	  })
	}
	handleFocusSearch = ()=> {
		this.setState({isShowPopup: true})
	}
	handleClickPopup = ()=> {
		this.setState({isShowPopup: false})
	}

	render() {
		return (
			<div className={styles.contacts}>
				<div className={styles.searchBar}>
					<i className='iconfont icon-back' onClick={() => this.props.history.goBack()}></i>
					<div className={styles.search}>
						<SearchBar placeholder="Search" maxLength={8} onChange={this.handleChangeSearch} onFocus={this.handleFocusSearch}/>
					</div>
				</div>
				<ul className={styles.addressList}>
					{this.state.addressListData.map((item,index)=>{
						return (
							item.value.length > 0 ?
							<li key={index}>
								<Link to={{ pathname:'/addressList' ,state:{ value: item.value } }}>
									<p>{item.label}<span>({item.value.length})</span></p>
									<i className='iconfont icon-arrow'></i>
								</Link>
							</li>
							: null
						)
					})}
				</ul>
				<SearchPopup searchvalue={this.state.searchData} isShowPopup={this.state.isShowPopup} handleClickPopup={this.handleClickPopup}/>
			</div>
		)
	}
}