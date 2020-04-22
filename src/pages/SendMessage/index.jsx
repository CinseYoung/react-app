import React from 'react'
import axios from 'axios'
import classnames from 'classnames'
import { createForm } from 'rc-form'
import { connect } from 'react-redux'
import { NavBar, Tag, TextareaItem, Button, List, Checkbox, Toast } from 'antd-mobile'
import styles from './style.less'

@connect(
	state => ({
		addressList: state.addressList
	})
)
class SendMessageWrapper extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			isShowPopup: false,
			addresseeArray: [],
			contacts: [],
			addressListData: []
		}
	}
	componentDidMount() {
	  axios.post(process.env.APP_URL + '/business/sysuser/appAddressList').then((response)=>{
	  	console.log(response.data.result,'response.data.result')
	  	let data = response.data.result
	  	let newData = []
	  	for (let i = 0; i < data.length; i++) {
	  		if (data[i].value.length > 0) {
	  			let value = []
	  			for (let j = 0; j < data[i].value.length; j++) {
  					if (data[i].value[j].duty) {
							value.push({duty: data[i].value[j].duty, id: data[i].value[j].id, mobilePhone: data[i].value[j].mobilePhone, orgId:data[i].value[j].orgId,realName:data[i].value[j].realName, checked:false})
						}else {
							value.push({id: data[i].value[j].id, mobilePhone: data[i].value[j].mobilePhone, orgId:data[i].value[j].orgId,realName:data[i].value[j].realName, checked:false})
						}
	  			}
	  			newData.push({label: data[i].label,value})
	  		}
			}
			this.setState({addressListData: newData})
		}).catch(function(error) {
			console.log(error)
		})
	  //this.setState({addressListData: this.props.addressList})
	}


	handleClickAddressList = ()=> {
		this.setState({isShowPopup: true})
	}
	// 改变通讯录选中状态
	onChangeContacts = (id)=> {
		console.log(id,'id')
		let addressListData = this.state.addressListData
		let newAddressListData = []
		let addresseeArray = []
		for (let i = 0; i < addressListData.length; i++) {
  		if (addressListData[i].value.length > 0) {
  			let value = []
  			for (let j = 0; j < addressListData[i].value.length; j++) {
  				if (addressListData[i].value[j].id === id) {
  					if (addressListData[i].value[j].duty) {
							value.push({duty: addressListData[i].value[j].duty, id: addressListData[i].value[j].id, mobilePhone: addressListData[i].value[j].mobilePhone, orgId:addressListData[i].value[j].orgId,realName:addressListData[i].value[j].realName, checked:!addressListData[i].value[j].checked})
						}else {
							value.push({id: addressListData[i].value[j].id, mobilePhone: addressListData[i].value[j].mobilePhone, orgId:addressListData[i].value[j].orgId,realName:addressListData[i].value[j].realName, checked:!addressListData[i].value[j].checked})
						}
  				}else {
  					if (addressListData[i].value[j].duty) {
							value.push({duty: addressListData[i].value[j].duty, id: addressListData[i].value[j].id, mobilePhone: addressListData[i].value[j].mobilePhone, orgId:addressListData[i].value[j].orgId,realName:addressListData[i].value[j].realName, checked:addressListData[i].value[j].checked})
						}else {
							value.push({id: addressListData[i].value[j].id, mobilePhone: addressListData[i].value[j].mobilePhone, orgId:addressListData[i].value[j].orgId,realName:addressListData[i].value[j].realName, checked:addressListData[i].value[j].checked})
						}
  				}
  			}
  			newAddressListData.push({label: addressListData[i].label,value})
  		}
		}
		for (let i = 0; i < newAddressListData.length; i++) {
			for (let j = 0; j < newAddressListData[i].value.length; j++) {
				if (newAddressListData[i].value[j].checked === true) {
					addresseeArray.push(newAddressListData[i].value[j])
				}
			}
		}
		this.setState({
			addressListData: newAddressListData,
			addresseeArray
		})
	}
	handleClickCa = ()=> {
		this.setState({isShowPopup: false})
	}
	handleClickButton = ()=> {
		let userID = sessionStorage.getItem('userID')
		let content = this.props.form.getFieldValue('content')
		let addresseeArray = this.state.addresseeArray
		let contactsID = []
		for (let i = 0; i < addresseeArray.length; i++) {
			contactsID.push(addresseeArray[i].id)
		}
		console.log(content,contactsID)
		if (contactsID.length === 0) {
			Toast.info('请选择联系人！', 1.5)
			return
		}
		if (content===undefined) {
			Toast.info('请输入短信内容！', 1.5) 
			return
		}
		axios({
			url: process.env.APP_URL+'/business/warningdetails/app/sms',
			headers: {'Content-Type': 'application/json'},
			method: 'post',
			data: JSON.stringify({
				senderId: userID,
				receiverIds: contactsID.join(','),
				content: content
		  })
		}).then((response)=> {
			Toast.info(response.data.msg, 1.5)
		}).catch((error)=> {
			console.log(error,'error')
		})
	}

	render() {
		const { getFieldProps } = this.props.form
		const CheckboxItem = Checkbox.CheckboxItem
		return (
			<div className={styles.sendMessage}>
				<NavBar
					className={styles.navBar}
					mode="light"
					icon={<i className="iconfont icon-back"
					style={{ color: '#666' }}></i>}
					onLeftClick={() => this.props.history.goBack()}>
					新短信
				</NavBar>
				<div className={styles.wrapper}>
					<div className={styles.addressee}>
						<h3>收件人：</h3>
						<div className={styles.contacts}>
							{this.state.addresseeArray.map(item => <Tag closable key={item.id} onClose={() => this.onChangeContacts(item.id)}>{item.realName}</Tag>)}
						</div>
						<i className='iconfont icon-tongxunlu' onClick={this.handleClickAddressList}></i>
	    		</div>
					<div className={styles.contents}>
						<TextareaItem placeholder='短信内容' {...getFieldProps('content')}
	            rows={8}
	            count={300}
	          />
					</div>
					<div className={styles.sendOutBtn}>
						<Button type="primary" onClick={this.handleClickButton}>发 送</Button>
					</div>
				</div>
				{/*通讯录列表*/}
				<div className={classnames(styles.contactsPopup, {[`${styles.isShowPopup}`]: this.state.isShowPopup})}>
					<div className={styles.top}>
						<i className='iconfont icon-ca' onClick={this.handleClickCa}></i>
						<h3>请选择联系人</h3>
						<i className='iconfont icon-gou' style={{opacity: 0}}></i>
					</div>
					<ul className={styles.contactsList}>
		        {this.state.addressListData.map((item,index)=>{
							return (
								item.value.length > 0 ?
								<li key={index}>
									<p className={styles.title}>{item.label}</p>
									<List>
										{item.value.map((items)=>{
											return (
												<CheckboxItem key={items.id} checked={items.checked} onChange={() => this.onChangeContacts(items.id)}>
							            <div className={styles.describe}>
							            	<h3>{items.realName}</h3>
														{items.duty ? <span>{items.duty}</span> : null}
							            </div>
							            <List.Item.Brief>{items.mobilePhone}</List.Item.Brief>
							          </CheckboxItem>
											)
										})}
									</List>
								</li>
								: null
							)
						})}
					</ul>
				</div>
			</div>
		)
	}
}
const SendMessage = createForm()(SendMessageWrapper)
export default SendMessage