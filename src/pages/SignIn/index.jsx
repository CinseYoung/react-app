import React from 'react'
import { NavBar, TabBar } from 'antd-mobile'
import SignInStatistics from 'components/SignInStatistics'
import SignInPage from 'components/SignInPage'

import styles from './style.less'

export default class SignIn extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedTab: sessionStorage.getItem('selectedSignInTab') ? sessionStorage.getItem('selectedSignInTab') : 'Tab1',
			hidden: false
		}
		// 修改安卓 StatusBar 颜色
		if (process.env.NODE_ENV === 'production') {
			if (typeof cordova !== 'undefined' && cordova.platformId == 'android') {
				StatusBar.overlaysWebView(false)
				StatusBar.styleDefault()
				StatusBar.backgroundColorByHexString('#ffffff')
			}
		}
	}

	renderSignInContent = (tabs) => {
		if (tabs === "Tab1") {
			return <SignInPage />
		}
		if (tabs === 'Tab2') {
			return <SignInStatistics />
		}
	}
	tabChange = (tabs)=> {
		this.setState({ selectedTab: tabs })
		sessionStorage.setItem('selectedSignInTab', tabs)
	}

	render() {
		return (
			<div className={styles.signInContainer}>
				<NavBar
					className={styles.navBar}
					mode="light"
					icon={<i className="iconfont icon-back" style={{ color: '#666' }}></i>}
					onLeftClick={() => this.props.history.goBack()}
				>
					签到
				</NavBar>
				<div className={styles.container}>
					<TabBar
						unselectedTintColor="#727272"
						tintColor="#4287ff"
						barTintColor="white"
						tabBarPosition="bottom"
						prerenderingSiblingsNumber={0}
						hidden={this.state.hidden}>
						<TabBar.Item
							title="签到"
							key="signIn"
							icon={<i className="iconfont icon-qiandao"></i>}
							selectedIcon={<i className="iconfont icon-qiandao" style={{ color: '#4287ff' }}></i>}
							selected={this.state.selectedTab === 'Tab1'}
							onPress={() => { this.tabChange('Tab1') }}>
							{this.renderSignInContent('Tab1')}
						</TabBar.Item>
						<TabBar.Item
							title="统计"
							key="signCount"
							icon={<i className="iconfont icon-tongji"></i>}
							selectedIcon={<i className="iconfont icon-tongji" style={{ color: '#4287ff' }}></i>}
							selected={this.state.selectedTab === 'Tab2'}
							onPress={() => { this.tabChange('Tab2') }}>
							{this.renderSignInContent('Tab2')}
						</TabBar.Item>
					</TabBar>
				</div>
			</div>
		)
	}
}
