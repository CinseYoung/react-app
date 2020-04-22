import React from 'react'
import styles from './style.less'

export default class Development extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className={styles.content}>
				<div className={styles.development}>
					<div className={styles.img}></div>
					<h3>coming soon</h3>
					<h2>披星戴月开发中，敬请期待</h2>
				</div>
				<button onClick={() => this.props.history.goBack()}>返回上一页</button>
			</div>
		)
	}
}