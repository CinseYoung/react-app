import React from 'react'
import { createForm } from 'rc-form'
import axios from 'axios'
import qs from 'qs'
import classnames from 'classnames'
import { NavBar, List, Button, InputItem, Picker, WingBlank, ImagePicker, Toast } from 'antd-mobile'
import { FormatDate } from 'utils/format'
import styles from './feedba.less'

let monitoringOptions = []

class FeedbaWrapper extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			feedbaModal: false,
			describe: '',
			files: [],
			multiple: false,
			comments: ['SW', 'ZS', 'YW', 'YL'],
			deviceName: [],
			deviceStatus: [
				{label: '正常', value: '0'},
				{label: '故障', value: '1'}
			]
		}
	}
	componentDidMount() {
		for (let i = 0; i < this.state.comments.length; i++) {
      this.getStationData(this.state.comments[i])
    }
	}

	getStationData = (comments)=> {
    axios.post(process.env.APP_URL + '/business/common/action', JSON.stringify({
      ACTION: [{
        TYPE: "LOAD",
        CODE: 'LOAD_RWDB_STATION_DROP',
        RCODE: "ROW",
        CDN: {
	        comments: comments,
	        sttp: comments==='YL'?'ZQ':''
	      }
      }]
    }), {
      headers: {"Content-Type": "application/json;charset=UTF-8"}
    }).then((response) => {
      let data = response.data.result.ROW
      for (var i = 0; i < data.length; i++) {
      	monitoringOptions.push({label: data[i].STNM, value: data[i].STCD})
      }
      this.setState({deviceName: monitoringOptions})
  	})
  }

	onChangeInputItem = (describe)=> {
		this.setState({ describe })
	}
	onChangeImagePicker = (files, type, index)=> {
		console.log(files, type, index)
		this.setState({files})
	}
	closeFeedbaModal = ()=> {
		let describe = this.state.describe
		let deviceName = this.props.form.getFieldValue('deviceName')
		let deviceStatus = this.props.form.getFieldValue('deviceStatus')
		let files = this.state.files
		let imageUrl = ''
		if (files.length != 0) {
			for (var i = 0; i < files.length; i++) {
				imageUrl += `GUIREN${files[i].url}`
			}
		}
		if (deviceName == undefined) {
			Toast.info('请选择正确的巡检设备名称！')
			return
		}
		if (deviceStatus == undefined) {
			Toast.info('请选择正确的巡检设备状态！')
			return
		}
		if (describe == '') {
			Toast.info('请输入巡检结果！')
			return
		}

		axios({
			method: 'post',
			url: process.env.APP_URL + '/business/pollingrecord/add',
			data: qs.stringify({
				personnel: parseInt(sessionStorage.getItem('userID')),
				tm: FormatDate("yyyy-MM-dd hh:mm:ss", new Date()),
				result: describe,
				equipId: deviceName[0],
				image: imageUrl,
				taskId: parseInt(this.props.ID),
				equipStatus: deviceStatus[0]
		  })
		}).then((response)=> {
			if (response.data.code == 0) {
				Toast.success('上传成功 !!!', 1)
				this.setState({
					describe: '',
					files:[]
				})
			}else{
				console.log(response)
				Toast.offline('上传失败，请重试！', 1.5)
			}
		}).catch((error)=> {
			console.log(error)
			Toast.offline('上传错误，请重试！', 1.5)
		})
	}


	render() {
		const { getFieldProps } = this.props.form
		return (
			<div className={classnames(styles.feedbaWrapper, {[`${styles.isShowFeedba}`]: this.props.isShow})}>
				<NavBar className={styles.navBar} mode='light' 
					icon={<i className="iconfont icon-ca" style={{color: '#666'}}></i>} 
					onLeftClick={() => this.props.handleClickFeedba()}>
          巡检问题
        </NavBar>
        <div className={styles.content}>
        	<List>
          	<InputItem clear placeholder='请输入巡检结果' onChange={this.onChangeInputItem} value={this.state.describe}>巡检结果</InputItem>
          	<Picker data={this.state.deviceName} cols={1} {...getFieldProps('deviceName')} extra="请选择巡检设备名称" className="forss">
							<List.Item arrow="horizontal">设备名称</List.Item>
						</Picker>
						<Picker data={this.state.deviceStatus} cols={1} {...getFieldProps('deviceStatus')} extra="请选择巡检设备状态" className="forss">
							<List.Item arrow="horizontal">设备状态</List.Item>
						</Picker>
          	<InputItem editable={false} value={FormatDate("yyyy-MM-dd hh:mm:ss", new Date())}>巡检时间</InputItem>
          </List>
          <div className={styles.ImagePicker}>
						<div className='am-list-header'>巡检图片</div>
						<WingBlank>
							<ImagePicker
								files={this.state.files}
								onChange={this.onChangeImagePicker}
								onImageClick={(index, fs) => console.log(index, fs)}
								selectable={this.state.files.length < 3}
								multiple={this.state.multiple}
							/>
						</WingBlank>
					</div>
          <div className={styles.WingBlank}>
						<Button type="primary" size='large' onClick={this.closeFeedbaModal}>提 交 问 题</Button>
					</div>
        </div>
			</div>
		)
	}
}
const Feedba = createForm()(FeedbaWrapper)
export default Feedba