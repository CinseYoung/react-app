import React from 'react'
import { connect } from 'react-redux'
import { Toast } from 'antd-mobile'
import styles from './style.less'

@connect(
    // 你要state什么属性放到props里
    state => ({ globalMap: state.globalMap })
)
export default class Scale extends React.Component {

	constructor(props) {
		super(props)
	}

	handleClickZoomIn = ()=> {
		let Map = this.props.globalMap
		if (Map.getZoom() === 19) {
			Toast.info('已经放大到最高级别', 1)
			return
		}
		Map.zoomIn()
	}

	handleClickZoomOut = ()=> {
		let Map = this.props.globalMap
		if (Map.getZoom() === 8) {
			Toast.info('已经缩放到最低级别', 1)
			return
		}
		Map.zoomOut()
	}

	render() {
		return (
			<div className={styles.scale}>
				<span onClick={this.handleClickZoomIn}><i className="iconfont icon-jia"></i></span>
				<span onClick={this.handleClickZoomOut}><i className="iconfont icon-jian"></i></span>
			</div>
		)
	}
}