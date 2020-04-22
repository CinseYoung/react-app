import React from 'react'
import classnames from 'classnames'
import styles from './style.less'

export default class SearchPopup extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			isShowPopup: null
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const { isShowPopup } = nextProps
		// 当传入的type发生变化的时候，更新state
		if (isShowPopup !== prevState.isShowPopup) {
			return {
				isShowPopup
			}
		}
		// 否则，对于state不进行任何操作
		return null
	}

	shouldComponentUpdate() {
		if (this.props.isShowPopup !== null) {
			return true
		} else {
			return false
		}
	}

	handleClickPopup = ()=> {
		this.props.handleClickPopup()
	}
	

	render() {
		return (
			<div className={classnames(styles.searchPopup, {[`${styles.isShowPopup}`]: this.props.isShowPopup})} onClick={this.handleClickPopup}>
				<ul className={styles.listItem}>
					{this.props.searchvalue.map((item,index)=>{
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
			</div>
		)
	}
}