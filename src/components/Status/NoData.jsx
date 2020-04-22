import React from 'react'
import styles from './style.less'

export default class NoData extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className={styles.status}>
				<div className={styles.NoDataImg}></div>
				<p>暂无数据</p>
			</div>
		)
	}
}