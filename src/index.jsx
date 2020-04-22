import React from 'react'
import ReactDOM from 'react-dom'
import store from './store'
import { Provider } from 'react-redux'
import { TransitionGroup, CSSTransition } from "react-transition-group"
import RouterMap from '@/router/routerMap'
import * as serviceWorker from './serviceWorker'

import 'static/init.js'
import 'static/reset.css'

ReactDOM.render(
	// 这个动画是页面首次加载的动画，设置appear={true} 这个属性，并且动画时间设置为400ms，和css中的需要一致。
	// 一定要用 TransitionGroup 包着 CSSTransition，动画才有效，
	// 原因是TransitionGroup 负责检测并自动给CSSTransition添加‘in’的prop，
	// 并且TransitionGroup 要一直存在，不能放在动态生成的组件中。
	<Provider store={store}>
		<TransitionGroup className="transitionGroup">
			<CSSTransition appear={true} classNames="appAppear" timeout={300}>
				<RouterMap/>
			</CSSTransition>
		</TransitionGroup>
	</Provider>,
	document.querySelector('#root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()