import React from 'react'
import axios from 'axios'
import AMap from 'AMap'
import classnames from 'classnames'
import { NavBar, Carousel, Steps, WingBlank, TextareaItem, Toast } from 'antd-mobile'
import styles from './style.less'
import qs from 'qs'
// import newAxios from 'utils/Axios'

const Step = Steps.Step

function loadingToast() {
  Toast.loading('加载中...', 0, () => {
    console.log('加载中！！！')
  })
}


export default class InspectionDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: ['1', '2', '3'],
      imgHeight: 176,
      current: 1,
      branchOpinion: '',
      regionOpinion: '',
      cityOpinion: '',
      Area: false,
      City: false,
      isProcessed: false,
      isProcessedArea: false,
      isProcessedCity: false,
      listData: [],
      address: ''
    }
    loadingToast()
    
    // 修改安卓 StatusBar 颜色
    if(process.env.NODE_ENV==='production'){
      if (typeof(cordova)!=='undefined' && cordova.platformId == 'android') {
        StatusBar.overlaysWebView(false)
        StatusBar.styleLightContent()
        StatusBar.backgroundColorByHexString('#3d92fb')
      }
    }
  }

  componentDidMount() {
    this.initData()
  }
  initData(){
    const This = this
    let inspectionDetails = this.refs.inspectionDetails
    inspectionDetails.onscroll = function(){
      let scrollTop = inspectionDetails.scrollTop * 0.8
      if (scrollTop < 10) {
        scrollTop = 0
      }
      if (scrollTop > 100) {
        scrollTop = 100
      }
      let opacity = scrollTop / 100
      let goBack = This.refs.goBack
      let navBarMain = This.refs.navBarMain
      goBack.style.cssText = `opacity: ${1 - opacity};`
      navBarMain.style.cssText = `opacity: ${opacity};`
    }

    axios.post(process.env.APP_URL + '/business/dikesurveyrecords/tableData').then(function (response) {
      if (response.data.code === 0) {
        Toast.hide()
        let data = response.data.result.list
        let id = This.props.match.params.id
        for (let i = 0; i < data.length; i++) {
          if (data[i].id == id) {
            console.log("listData",data[i]);
            This.setState({
              listData: data[i]
            })
            let lnglat = [data[i].lttd, data[i].lgtd]
            This.regeoCode(lnglat)
          }
        }
      }
    }).catch(function (error) {
      console.log(error)
      Toast.hide()
      Toast.offline('服务器连接失败 ！', 3)
    })
  }
  regeoCode= (lnglat) => {
    const This = this
    let geocoder = new AMap.Geocoder({
      city: "010", //城市设为北京，默认：“全国”
      radius: 1000 //范围，默认：500
    })
    geocoder.getAddress(lnglat, function(status, result) {
      if (status === 'complete'&&result.regeocode) {
        let address = result.regeocode.formattedAddress
        This.setState({
          address
        })
      }else{console.log(JSON.stringify(result))}
    })
  }

  handleChangeValue = (value)=> {
    this.setState({
      branchOpinion: value
    })
  }
  handleChangeAreaValue = (value)=> {
    this.setState({
      regionOpinion: value
    })
  }
  handleChangeCityValue = (value)=> {
    this.setState({
      cityOpinion: value
    })
  }
  requestMethod(state){
    let id = this.props.history.location.pathname.split("/")[2];
    let formData ={
      state:state,
      id:id,
      inspectDuke:this.state.listData.inspectDuke,
      inspectUnit:this.state.listData.inspectUnit,
      schLeader:this.state.listData.schLeader,
      schStaffs:this.state.listData.schStaffs,
      weather:this.state.listData.weather,
      record:this.state.listData.record,
      lgtd:this.state.listData.lgtd,
      lttd:this.state.listData.lttd,
      dikeUnit:this.state.listData.dikeUnit,
      reportRegion:this.state.isProcessed,
      reportCity:this.state.isProcessedArea,
      reportTime:this.state.listData.reportTime,
      branchHandleTime: this.state.listData.branchHandleTime,
      cityHandleTime: this.state.listData.cityHandleTime,
      image: this.state.listData.image,
      regionHandleTime: this.state.listData.regionHandleTime,
      reportRegionTime: this.state.listData.reportRegionTime
    };
    if(this.state.branchOpinion!=""&&this.state.branchOpinion!=null) {
      formData.branchOpinion = this.state.branchOpinion;
    }
    if(this.state.regionOpinion!=""&&this.state.regionOpinion!=null) {
      formData.regionOpinion = this.state.regionOpinion;
    }
    if(this.state.cityOpinion!=""&&this.state.cityOpinion!=null) {
      formData.cityOpinion = this.state.cityOpinion;
    }

    axios.post(process.env.APP_URL + '/business/dikesurveyrecords/edit/'+id,
      qs.stringify(formData),
      {headers: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}}
    ).then(()=>{
      Toast.success("请求成功");
      this.initData();
    }).catch(()=>{
      Toast.fail("请求失败");
    })
  }
  saveOptions=()=>{
    this.requestMethod("2");
  }
  // 分部处理意见
  handleClickBranch = ()=> {
    this.setState({
      current: 5,
      isProcessed: true
    })
    this.requestMethod("3");

  }
  handleClickBranchArea = ()=> {
    this.setState({
      current: 5,
      isProcessedArea: true
    })
    this.requestMethod("3");
  }
  handleClickBranchCity = ()=> {
    this.setState({
      current: 5,
      isProcessedCity: true
    })
    this.requestMethod("3");
  }
  handleClickReportArea = ()=> {
    this.setState({
      Area: true,
      current: this.state.current + 1,
      isProcessed: true
    })
  }
  handleClickReportCity = ()=> {
    this.setState({
      City: true,
      current: this.state.current + 1,
      isProcessedArea: true
    })
  }

  render() {
    return (
      <div className={styles.inspectionDetails} ref="inspectionDetails">
        <div className={styles.goBack} ref="goBack">
          <span onClick={() => this.props.history.goBack()}><i className="iconfont icon-back"></i></span>
        </div>
        <div className={styles.navBarMain} ref="navBarMain">
          <NavBar className={styles.navBar} mode='light'
            icon={<i className="iconfont icon-back" style={{color:'#666'}}></i>}
            onLeftClick={() => this.props.history.goBack()}
          >
            事件审批详情
          </NavBar>
        </div>
        <div className={styles.content} ref="content">
          <Carousel autoplay={true} infinite>
            {this.state.data.map(val => (
              <a key={val} style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}>
                <img src={require(`../../static/images/listImg${val}.jpg`)} alt="" style={{ width: '100%', verticalAlign: 'top' }}
                  onLoad={() => {
                    window.dispatchEvent(new Event('resize'))
                    this.setState({ imgHeight: 'auto' })
                  }}
                />
              </a>
            ))}
          </Carousel>
          <ul className={styles.detailsList}>
            <li className={styles.listItem}>
              <span>事件描述：</span>
              <em>{this.state.listData.dikeUnit}</em>
            </li>
            <li className={styles.listItem}>
              <span>河流名称：</span>
              <em>{this.state.listData.inspectDuke}</em>
            </li>
            <li className={styles.listItem}>
              <span>事件类别：</span>
              <em>巡查问题解决情况</em>
            </li>
            <li className={styles.listItem}>
              <span>上报地址：</span>
              <em>{this.state.address}</em>
            </li>
            <li className={styles.listItem}>
              <span>事件状态：</span>
              <div className={styles.icon}>
                {(this.state.listData.state == 1) ? <i className="iconfont icon-daichuli"></i>: <div></div>}
                {(this.state.listData.state == 2) ? <i className="iconfont icon-chuli"></i>: <div></div>}
                {(this.state.listData.state == 3) ? <i className="iconfont icon-yichuli"></i>: <div></div>}
              </div>
            </li>
          </ul>
          <div className={styles.grayBar}></div>

          {/*处理过程*/}
          <WingBlank>
            <Steps current={this.state.current}>
              <Step
                title={<h3 className={styles.stepsTitle}>上报</h3>}
                description={<p className={styles.stepsText}>{this.state.listData.record}</p>}
              />
              <Step
                title={<h3 className={styles.stepsTitle}>分部处理意见</h3>}
                description={
                  <div className={classnames({[`${styles.processed}`]: this.state.isProcessed})}>
                    <p className={classnames(styles.processedText, {[`${styles.hide}`]: !this.state.isProcessed})}>
                      {this.state.branchOpinion}
                    </p>
                    <TextareaItem
                      placeholder="请填写分部处理的意见"
                      clear
                      rows={4}
                      count={300}
                      className={classnames({[`${styles.hide}`]: this.state.isProcessed})}
                      onChange={this.handleChangeValue}
                    />
                    <div className={styles.stepsButton}>
                      <button onClick={this.handleClickBranch}>处理完成</button>
                      <button onClick={this.handleClickReportArea}>上报区部</button>
                      <div onClick={this.saveOptions}>保存意见</div>
                    </div>
                  </div>
                }
              />
              <Step
                title={<h3 className={styles.stepsTitle}>区部处理意见</h3>}
                description={
                  <div className={classnames({[`${styles.processed}`]: this.state.isProcessedArea})}>
                    <p className={classnames(styles.processedText, {[`${styles.hide}`]: !this.state.isProcessedArea})}>
                      {this.state.regionOpinion}
                    </p>
                    <TextareaItem
                      placeholder="请填写区部处理的意见"
                      clear
                      rows={4}
                      count={300}
                      className={classnames({[`${styles.hide}`]: this.state.isProcessedArea})}
                      onChange={this.handleChangeAreaValue}
                    />
                    <div className={styles.stepsButton}>
                      <button onClick={this.handleClickBranchArea}>处理完成</button>
                      <button onClick={this.handleClickReportCity}>上报市部</button>
                      <div onClick={this.saveOptions}>保存意见</div>
                    </div>
                  </div>
                }
                style={{display: this.state.Area ? "block" : "none"}}
              />
              <Step
                title={<h3 className={styles.stepsTitle}>市部处理意见</h3>}
                description={
                  <div className={classnames({[`${styles.processed}`]: this.state.isProcessedCity})}>
                    <p className={classnames(styles.processedText, {[`${styles.hide}`]: !this.state.isProcessedCity})}>
                      {this.state.cityOpinion}
                    </p>
                    <TextareaItem
                      placeholder="请填写市部处理的意见"
                      clear
                      rows={4}
                      count={300}
                      className={classnames({[`${styles.hide}`]: this.state.isProcessedCity})}
                      onChange={this.handleChangeCityValue}
                    />
                    <div className={styles.stepsButton}>
                      <button onClick={this.handleClickBranchCity}>处理完成</button>
                      <div onClick={this.saveOptions}>保存意见</div>
                    </div>
                  </div>
                }
                style={{display: this.state.City ? "block" : "none"}}
              />
              <Step title={<h3 className={styles.stepsTitle}>完成</h3>}/>
            </Steps>
          </WingBlank>
        </div>
      </div>
    )
  }
}
