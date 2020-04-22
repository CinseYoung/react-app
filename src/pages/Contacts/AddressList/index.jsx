import React from 'react'
import { connect } from 'react-redux'
import { SearchBar } from 'antd-mobile'
import SearchPopup from '../SearchPopup'
import styles from './style.less'

@connect(
	state => ({
		addressList: state.addressList
	})
)
export default class AddressList extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: [],
			searchData: [],
			isShowPopup: false
		}
	}
	componentDidMount() {
		this.setState({value: this.props.location.state.value})
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
			<div className={styles.AddressListItem}>
				<div className={styles.searchBar}>
					<i className='iconfont icon-back' onClick={() => this.props.history.goBack()}></i>
					<div className={styles.search}>
						<SearchBar placeholder="Search" maxLength={8} onChange={this.handleChangeSearch} onFocus={this.handleFocusSearch}/>
					</div>
				</div>

				<ul className={styles.listItem}>
					{this.state.value.map((item,index)=>{
						return (
							<li key={index}>
								<div className={styles.header}>{item.realName.substring(item.realName.length-2)}</div>
								<a className={styles.information} href={`tel:${item.mobilePhone}`}>
									<div className={styles.describe}>
										<h3>{item.realName}</h3>
										{item.duty ? <span>{item.duty}</span> : null}
									</div>
									<p className={styles.tel}>{item.mobilePhone}</p>
								</a>
							</li>
						)
					})}
				</ul>
				<SearchPopup searchvalue={this.state.searchData} isShowPopup={this.state.isShowPopup} handleClickPopup={this.handleClickPopup}/>
			</div>
		)
	}
}