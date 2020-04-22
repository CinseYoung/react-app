import React from 'react'
import { connect } from 'react-redux'
import axios from 'utils/Axios'
import axiosGet from 'axios'
import { actions } from '@/store'
import classnames from 'classnames'
import { NavBar, Toast } from 'antd-mobile'
import styles from './style.less'

const { showVideo, hideVideo } = actions.showVideo
// 用装饰器简写方式
@connect(
  // 你要state什么属性放到props里
  state => ({
    monitoring: state.monitoring,
    isShowVideo: state.isShowVideo
  }),
  { showVideo, hideVideo }
)
export default class LiveVideo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isPlay: false,
      videoDataList: []
    }
  }
  componentDidMount() {
    this.props.onRefVideoData(this)
  }

  getVideoData() {
    if (this.props.videoData ===null) {return}
    axios.newAjax({
      url: '/business/common/action',
      TYPE: 'LOAD_STATION_VIDEO',
      CDN: {
        code: this.props.videoData.STCD
      }
    }).then(data => {
      let videoDataList = data
      this.setState({videoDataList})
      console.log(data,'videoDataSourceLIst')
    })
  }

  hideLiveVideo = () => {
    this.props.hideVideo()
  }

  playVideo = (item)=> {
    console.log(item.CAMERAINDEXCODE)
    if (item.CAMERAINDEXCODE) {
      console.log('code值', item.CAMERAINDEXCODE)
      axiosGet.get(process.env.APP_URL + '/business/video/getCameraPreviewURL', {
        params: {
          cameraindexcode: item.CAMERAINDEXCODE
        }
      }).then(result => {
        console.log(result.data.data.url,'result')
        let url = result.data.data.url
        if (process.env.NODE_ENV === 'production') {
          if (typeof cordova !== 'undefined' && cordova.platformId == 'android') {
            cordova.exec((success)=>{
              console.log(success)
            },(error)=>{
              console.log(error)
            },'video','coolMethod',[url])
          }
        }
      })
    }
  }

  render() {
    return (
      <div className={classnames(styles.videoContainer, {[`${styles.isShowVideo}`]: this.props.isShowVideo.isShowVideo})}>
        <NavBar className={styles.navBar} mode='light' 
          icon={<i className="iconfont icon-ca" style={{color: '#666'}}></i>} 
          onLeftClick={() => this.hideLiveVideo()}>
          站点视频列表
        </NavBar>
        <div className={styles.content}>
          <h3 className={styles.videoListTitle}>点击列表，播放视频</h3>
          {JSON.stringify(this.state.videoDataSource) !== '{}' ? (
            <ul className={styles.videoList}>
              {this.state.videoDataList &&
                this.state.videoDataList.map((item, index) => {
                  return (
                    <li onClick={()=>this.playVideo(item)} key={index}>
                      {item.POSITION + '(' + item.CODE + ')'}
                    </li>
                  )
                })
              }
            </ul>
          ) : null}
        </div>
      </div>
    )
  }
}
