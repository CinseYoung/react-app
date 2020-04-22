import React from 'react'
import AMap from 'AMap'
import { connect } from 'react-redux'
import { NavBar } from 'antd-mobile'
import AMaps from 'components/AMaps'
import Scale from 'components/Scale'
import Location from 'components/Location'
import Legend from '../components/Legend'
import styles from './style.less'

@connect(
	state => ({
		globalMap: state.globalMap,
		getTaskListData: state.getTaskListData,
		getGlobalLocation: state.getGlobalLocation
	}),{}
)
export default class TaskCompleteDetails extends React.Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.taskListData()
	}

	/*
   * 将一个数组分成几个同等长度的数组
   * array[分割的原数组]
   * size[每个子数组的长度]
  */
	sliceArray(array, size){
    let result = []
    for (let i = 0; i < Math.ceil(array.length / size); i++) {
      let start = i * size
      let end = start + size
      result.push(array.slice(start, end))
    }
    return result
  }
	// 获取巡检任务，地图显示路线
	taskListData = ()=> {
		let ID = this.props.history.location.pathname.split("/")[2]
		let taskList = this.props.getTaskListData
		let newTaskPath = []
    for (let i = 0; i < taskList.length; i++) {
    	if (taskList[i].id == ID) {
				let routeArr = taskList[i].route.split(',')
        let taskPath = this.sliceArray(JSON.parse(`[${String(routeArr)}]`),2)
        for (let j = 0; j < taskPath.length; j++) {
        	let a1 = taskPath[j][0] - 0.01
        	let a2 = taskPath[j][1] - 1.585
        	newTaskPath.push([a1, a2])
        }
				// 坐标转换
				AMap.convertFrom(newTaskPath, 'gps',(status, result)=> {
					if (result.info === 'ok') {
						let path = result.locations
						let polyline = new AMap.Polyline({
							path: path,
							outlineColor: '#ffeeff',
							borderWeight: 2, // 线条宽度，默认为 1
							strokeColor: '#276eff', // 线条颜色
							lineJoin: 'round' // 折线拐点连接处样式
						});
						this.props.globalMap.add(polyline)
					}
				})
    	}
    }
    // 设置地图中心点，地图缩放大小
    setTimeout(()=>{
    	this.props.globalMap.setZoomAndCenter(12, newTaskPath[0])
    },40)
  }

	render() {
		return (
			<div className={styles.taskCompleteDetails}>
				<NavBar className={styles.navBar} mode='light' 
					icon={<i className="iconfont icon-back" style={{color: '#666'}}></i>} 
					onLeftClick={() => this.props.history.goBack()}>
          巡检任务完成详情
        </NavBar>
        <div className={styles.AMaps}>
        	<AMaps/>
        	{/*缩放*/}
					<Scale/>
					{/* 定位 */}
					<Location/>
        </div>
        <Legend/>
			</div>
		)
	}
}