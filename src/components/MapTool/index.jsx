import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import AMap from 'AMap'
import styles from './style.less'
import { actions } from '@/store'

const { showSidebar, afterShowSidebarAsync } = actions.showLayerPopup

@connect(
  // 你要state什么属性放到props里
  state => ({
    globalMap: state.globalMap,
    showLayerPopup: state.showLayerPopup
  }),
  // 你要什么方法，放到props里，自动dispatch
  {showSidebar, afterShowSidebarAsync}
)
export default class MapTool extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isRule: true,
      isMeasureArea: true,
      mouseTool: null,
      mouseToolIcon: null
    }
  }

  // 测距离
  handleClickRule = () => {
    let Map = this.props.globalMap
    let mouseTool = new AMap.MouseTool(Map)
    this.setState({
      mouseTool
    })
    if (this.state.isRule) {
      if (this.state.mouseTool != null && this.state.mouseToolIcon != null) {
        this.state.mouseTool.close(true)
        this.state.mouseToolIcon.close(true)
        this.setState({
          isMeasureArea: !this.state.isMeasureArea
        })
        if (this.state.isMeasureArea) {
          this.setState({
            isMeasureArea: true
          })
        }
      }
      mouseTool.rule({
        startMarkerOptions: { //可缺省
          icon: new AMap.Icon({
            size: new AMap.Size(19, 31), //图标大小
            imageSize: new AMap.Size(19, 31),
            image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
          })
        },
        endMarkerOptions: { //可缺省
          icon: new AMap.Icon({
            size: new AMap.Size(19, 31), //图标大小
            imageSize: new AMap.Size(19, 31),
            image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
          }),
          offset: new AMap.Pixel(-9, -31)
        },
        midMarkerOptions: { //可缺省
          icon: new AMap.Icon({
            size: new AMap.Size(19, 31), //图标大小
            imageSize: new AMap.Size(19, 31),
            image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
          }),
          offset: new AMap.Pixel(-9, -31)
        },
        lineOptions: { //可缺省
          strokeStyle: "solid",
          strokeColor: "#FF33FF",
          strokeOpacity: 1,
          strokeWeight: 2
        }
      })
    } else {
      this.state.mouseTool.close(true)
      if (this.state.mouseToolIcon != null) {
        this.state.mouseToolIcon.close(true)
      }
    }
    this.setState({
      isRule: !this.state.isRule
    })
  }
  // 测面积
  handleClickMeasureArea = () => {
    let Map = this.props.globalMap
    let mouseToolIcon = new AMap.MouseTool(Map)
    let mouseTool = new AMap.MouseTool(Map)
    this.setState({mouseTool})
    this.setState({mouseToolIcon})
    if (this.state.isMeasureArea) {
      if (this.state.mouseTool != null) {
        this.state.mouseTool.close(true)
        this.setState({
          isRule: !this.state.isRule
        })
        if (this.state.isRule) {
          this.setState({
            isRule: true
          })
        }
      }
      mouseToolIcon.marker()
      mouseTool.measureArea()
    } else {
      this.state.mouseTool.close(true)
      if (this.state.mouseToolIcon != null) {
        this.state.mouseToolIcon.close(true)
      }
    }
    this.setState({
      isMeasureArea: !this.state.isMeasureArea
    })
  }
  handleClickShowPopup = () => {
    this.props.showSidebar()
    this.props.afterShowSidebarAsync()
  }

  render() {
    return (
      <div className={styles.MapTool}>
        <span onClick={this.handleClickShowPopup}><i className='iconfont icon-tuceng'></i><em>图层</em></span>
        <span onClick={this.handleClickRule} className={classnames({[`${styles.isActive}`]: !this.state.isRule})}>
        	<i className='iconfont icon-celiang'></i>
        	<em>测距</em>
        </span>
        <span onClick={this.handleClickMeasureArea} className={classnames({[`${styles.isActive}`]: !this.state.isMeasureArea})}>
        	<i className='iconfont icon-cemian'></i>
        	<em>测面</em>
        </span>
        <Link to='/report'>
          <span><i className='iconfont icon-shangbao'></i><em>上报</em></span>
        </Link>
      </div>
    )
  }
}