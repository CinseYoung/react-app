import React from 'react'
import styles from './style.less'

export default class NoNetwork extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className={styles.status}>
				<div className={styles.NoNetworkImg}></div>
				<p>服务器连接错误</p>
			</div>
		)
	}
}