import React from 'react'
import { SearchBar } from 'antd-mobile'
import styles from './style.less'

export default class Search extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			searchValue: ''
		}
	}

	handleChangeValue = (val) => {
		this.setState({
			searchValue: val
		})
	}
	handleClickSearch = () => {
		let searchContent = document.querySelector('#searchContent')
		searchContent.style.cssText = 'top: 0'
	}

	render() {
		return (
			<div className={styles.search} onClick={this.handleClickSearch}>
				<SearchBar placeholder="搜索监测站" disabled/>
			</div>
		)
	}
}