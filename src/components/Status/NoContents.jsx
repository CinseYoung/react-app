import React from 'react'
import styles from './style.less'

export default class NoContents extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className={styles.status}>
				<div className={styles.NoContentsImg}></div>
				<p>暂无内容</p>
			</div>
		)
	}
}