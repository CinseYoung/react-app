import React,{ Fragment } from 'react'
import styles from './style.less'

export default class DataSummaryList extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			startValue: 0,
			startX: 0,
			startY: 0
		}
	}

	// 数据详情列表
	showDetail = (item)=> {
		this.props.history.push({ pathname : '/grossDataDetail/'+item.STCD ,query : { item: item}})
	}

	// 数据列表
	renderContent = () => {
		return (
			<Fragment>
				<ul className={styles.titleList} ref='titleList'>
					{
						this.props.titleList.map((items,key) =>{
							return <li key={key} style={{width: items.width}}>{items.title}</li>
						})
					}
				</ul>
				<div className={styles.listMain} ref='listMain'>
					{
						this.props.listData.map((item,key) =>{
							return (
								<ul className={styles.listItem} key={key} onClick={()=>{this.showDetail(item)}}>
									{
										this.props.titleList.map((items,index) =>{
											return (
												items.name.slice(0,2)==='wa' ? 
												<li key={index} style={{width: items.width}}><i className={item[items.name]}></i></li>: 
												<li key={index} style={{width: items.width}}>{item[items.name]}</li>
											)
										})
									}
								</ul>
							)
						})
					}
				</div>
			</Fragment>
		)
	}

	render() {
		return (
			<div className={styles.dataSummaryList}>
				{this.renderContent()}
			</div>
		)
	}
}