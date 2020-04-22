import React from 'react'
import { NavBar } from 'antd-mobile'
import styles from './style.less'

export default class MessageDetails extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className={styles.messageDetails}>
				<NavBar
					className={styles.navBar}
					mode="light"
					icon={<i className="iconfont icon-back"
					style={{ color: '#666' }}></i>}
					onLeftClick={() => this.props.history.goBack()}>
					{this.props.location.query.name}
				</NavBar>
				<ul className={styles.wrapper}>
					<li className={styles.list}>
						<p className={styles.time}>{this.props.location.query.time.substr(5)}</p>
						<div className={styles.content}>
							{this.props.location.query.content}
						</div>
					</li>
				</ul>
			</div>
		)
	}
}