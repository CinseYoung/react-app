import React from 'react'

export default class loading extends React.Component{
	constructor(props) {
		super(props)
		this.state = {}
	}
	render() {
		return (
			<div id="ajaxLoading" style={{zIndex:"5000"}}>
				<div id="ajaxLoadingMain">
					<div className="loader-inner line-scale-pulse-out">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
					<p>数据加载中</p>
				</div>
			</div>
		)
	}
}
