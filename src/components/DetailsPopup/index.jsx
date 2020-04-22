import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import DetailsMain from './detailsMain/index.jsx'
import Axios from 'utils/Axios'
import axios from 'axios'
import qs from 'qs'
import { actions } from '@/store'
import LiveVideo from 'components/LiveVideo'
import styles from './style.less'

const circleClickDetailsPopup = actions.circleClick.circleClickDetailsPopup
const { showVideo, hideVideo } = actions.showVideo

// 用装饰器简写方式
@connect(
  // 你要state什么属性放到props里
  state => ({
    globalMap: state.globalMap,
    monitoring: state.monitoring,
    isShowVideo: state.isShowVideo
  }),
  { circleClickDetailsPopup, showVideo, hideVideo }
)
export default class DetailsPopup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      PointData: [],
      startValue: 0,
      endValue: 1000,
      moveTo: 0,
      disY: 0,
      isPrimary: false,
      isDetails: true,
      detailsTitle: '',
      STCD: '',
      scrollTop: 0,
      isChartRender: true,
      sParese: {},
      videoData: null
    }
  }

  componentDidMount() {
    Axios.ajax({
      url: '/business/ststbprpb/tableData',
      data: {
        isShowLoading: false
      }
    }).then((data) => {
      this.setState({
        PointData: data
      })
      setTimeout(() => {
        this.clickMonitoring()
      }, 300)
    })
    // 把circleClickFn加到redux里面，供SearchContent组件使用
    this.props.circleClickDetailsPopup(this.circleClickFn)
  }

  circleClickFn = (That)=> {
    let globalMap = this.props.globalMap
    let monitoringName = ''
    let circleMarkers = this.props.monitoring
    // 清除之前点动画，点击平移到中心，设置当前点点击动画
    for (let j = 0; j < circleMarkers.length; j++) {
      circleMarkers[j].setAnimation('AMAP_ANIMATION_NONE')
    }
    globalMap.panTo([That.getPosition().lng, That.getPosition().lat])
    That.setAnimation('AMAP_ANIMATION_DROP')
    // 如果是视频就不弹下拉窗，显示视频弹窗
    // 堤防视频
    let dike = That.getExtData().COMMENTS === 'SP' && That.getExtData().id && That.getExtData().id.indexOf('D')
    //港渠视频
    let harbourCanal = That.getExtData().COMMENTS == 'SP' && That.getExtData().id && That.getExtData().id.indexOf('V')
    //闸站视频
    let gateStation = That.getExtData().PointData && That.getExtData().PointData.ZHVIDEO == 'ZHVIDEO'
    //渍水视频
    let waterlogging = That.getExtData().PointData && That.getExtData().PointData.ZSVIDEO == 'ZSVIDEO'
    if (dike || harbourCanal || gateStation || waterlogging) {
      let videoDataSource = {}
      let ID = That.getExtData().id
      let PointData = this.state.PointData
      for (let i = 0; i < PointData.length; i++) {
        if (PointData[i].STCD == ID) {
          videoDataSource = PointData[i]
        }
      }
      this.refs.detailsPopup.style.cssText = `
        bottom: 0px !important;
        transition: 200ms ease-out;
        -webkit-transform 200ms ease-out;
      `
      console.log(videoDataSource,'videoDataSource')
      this.setState({ videoData: videoDataSource })
      this.props.showVideo()
      // 调用 LiveVideo 组件的 getVideoData 方法
      this.showVideoData.getVideoData()
      return
    }
    this.props.hideVideo()
    this.refs.detailsPopup.style.cssText = `
      bottom: 184px !important;
      transition: 200ms ease-out;
      -webkit-transform 200ms ease-out;
    `
    let ID = That.getExtData().id
    let PointData = this.state.PointData
    for (let i = 0; i < PointData.length; i++) {
      if (PointData[i].STCD == ID) {
        // 外江水位监测点
        if (PointData[i].COMMENTS == 'SW-WJ') {
          monitoringName = `外江水位`
        }
        // 港渠水位监测点
        if (PointData[i].COMMENTS == 'SW-GQ') {
          monitoringName = `港渠水位`
        }
        // 闸站水位监测点
        if (PointData[i].COMMENTS == 'SW,YL,ZZ' || PointData[i].COMMENTS == 'SW,ZDH,ZZ') {
          monitoringName = `闸站水位`
        }
        //  渍水监测点
        if (PointData[i].COMMENTS == 'ZS' || PointData[i].COMMENTS == 'ZS,LED') {
          monitoringName = `渍水`
        }
        // 管网液位监测点
        if (PointData[i].COMMENTS == 'YW') {
          monitoringName = `液位`
        }
        // 气象监测点(雨量)
        if (PointData[i].COMMENTS == 'YL' || PointData[i].COMMENTS == 'YL,WD') {
          monitoringName = `雨量`
        }
        // 堤防视频监测点
        if (PointData[i].COMMENTS == 'SP') {
          monitoringName = `视频`
        }
        this.setState({
          detailsTitle: PointData[i].STNM + '-' + monitoringName,
          sParese: PointData[i],
          STCD: PointData[i].STCD
        })
      }
    }
    // 判断是否已经收藏了
    let STCD = That.getExtData().PointData.STCD
    let userID = sessionStorage.getItem('userID')
    axios({
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'post',
      url: process.env.APP_URL + '/business/StWasR/findSysFocusStation',
      data: qs.stringify({
        userId: userID
      })
    }).then(response => {
      let collectionList = response.data
      for (let i = 0; i < collectionList.length; i++) {
        if (collectionList[i].stcd === STCD) {
          // 调用子组件 detailsMain 的方法
          this.detailsMain.changeCollectState()
          break
        } else {
          this.detailsMain.changeNoCollectState()
        }
      }
    }).catch(error => {
      console.log(error, 'error')
    })
  }

  // 点击地图监测点
  clickMonitoring = () => {
    let This = this
    /*let globalMap = this.props.globalMap
    let monitoringName = ''*/
    let circleMarkers = this.props.monitoring
    //console.log(This,'ThisThisThis')
    for (let i = 0; i < circleMarkers.length; i++) {
      circleMarkers[i].on('click', function() {
        This.circleClickFn(this)
      })
    }
  }
  // 如果不是点击的有滑动子元素，判断为0
  touchStartTop = () => {
    // console.log("如果不是点击的有滑动子元素，判断为0");
    this.setState({ scrollTop: 0 })
  }
  // 上拉动画
  touchStartFn = event => {
    let This = this
    let startValue = event.changedTouches[0].clientY
    let disY = startValue - this.refs.detailsPopup.offsetTop
    this.setState({ startValue, disY })

    // touchmove的时候判断子元素是否有滑动
    let detailsPopup = this.refs.detailsPopup
    /*let scrollTop = This.refs.detailsList.scrollTop
    this.setState({scrollTop})*/
    // moveTo this.state.scrollTop
    if (this.state.scrollTop === 0) {
      detailsPopup.ontouchmove = function(event) {
        let moveValue = event.changedTouches[0].clientY
        let moveTo = This.state.disY - moveValue
        let screenHeight = document.body.clientHeight
        This.setState({ moveTo })
        if (moveTo < 0) {
          moveTo = 0
        } else if (moveTo > screenHeight) {
          moveTo = screenHeight
        }
        This.refs.detailsPopup.style.cssText = `
          bottom: ${moveTo}px !important;
          transition: 100ms ease-out;
          -webkit-transform 100ms ease-out;
        `
        if (moveTo < 190) {
          This.setState({
            isPrimary: false,
            isDetails: true
          })
        } else {
          This.setState({
            isPrimary: true,
            isDetails: false
          })
        }
      }
      let detailsList = this.detailsMain.refs.detailsList
      detailsList.onscroll = function() {
        let scrollTop = detailsList.scrollTop
        This.setState({ scrollTop })
        // console.log("scrollTop",scrollTop);
      }
    } else {
      detailsPopup.ontouchmove = function() {}
    }
  }
  touchEndFn = () => {
    let This = this
    let screenHeight = document.body.clientHeight
    let startValue = this.state.startValue
    let moveTo = this.state.moveTo
    let endValue = event.changedTouches[0].clientY
    this.setState({ endValue })
    if (startValue > endValue) {
      if (moveTo > 0 && moveTo <= 184) {
        moveTo = 0
      } else if (moveTo > 184 && moveTo < screenHeight) {
        moveTo = screenHeight
      }
    }
    if (startValue < endValue) {
      if (moveTo > 0 && moveTo <= 184) {
        moveTo = 0
      } else if (moveTo > 184 && moveTo < screenHeight) {
        moveTo = 184
      }
    }
    if (startValue == endValue) {
      if (moveTo > 0 && moveTo <= 184) {
        moveTo = 0
      } else if (moveTo > 184 && moveTo < screenHeight) {
        moveTo = screenHeight
      }
    }

    if (moveTo < 0) {
      moveTo = 0
    } else if (moveTo > screenHeight) {
      moveTo = screenHeight
    }
    This.refs.detailsPopup.style.cssText = `
      bottom: ${moveTo}px !important;
      transition: 200ms ease-out;
      -webkit-transform 200ms ease-out;
    `

    if (moveTo < 190) {
      This.setState({
        isPrimary: false,
        isDetails: true
      })
    } else {
      This.setState({
        isPrimary: true,
        isDetails: false
      })
      // 执行一次ChartRender
      if (This.state.isChartRender) {
        This.detailsMain.chartRender(this.state.sParese)
        This.setState({ isChartRender: false })
      }
    }
    this.setState({ moveTo })
  }
  onRef = ref => {
    this.detailsMain = ref
  }
  onRefVideoData = ref => {
    this.showVideoData = ref
  }
  render() {
    return (
      <Fragment>
        <div className={styles.detailsPopup} ref="detailsPopup" onTouchStart={this.touchStartFn} onTouchEnd={this.touchEndFn} id="detailsPopup">
          <div className={styles.pullIcon}></div>
          <DetailsMain
            onRef={this.onRef}
            detailsTitle={this.state.detailsTitle}
            STCD={this.state.STCD}
            isPrimary={this.state.isPrimary}
            isDetails={this.state.isDetails}
            sParese={this.state.sParese}
            touchStartTop={this.touchStartTop}
          />
        </div>
        {/*视频播放*/}
        <LiveVideo videoData={this.state.videoData} onRefVideoData={this.onRefVideoData}/>
        {/*this.props.isShowVideo.isShowVideo ? <LiveVideo videoData={this.state.videoData}/> : null*/}
      </Fragment>
    )
  }
}
