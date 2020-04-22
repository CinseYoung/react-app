import React from 'react'
import { hot } from 'react-hot-loader'
import {Route,HashRouter} from 'react-router-dom'
import AnimatedRouter from 'react-animated-router'
// Router
import Navigation from 'pages/Navigation'
import HomePage from 'pages/HomePage'
import Login from 'pages/Login'
import Report from 'pages/Report'
import Information from 'pages/Information'
import GrossData from 'pages/GrossData'
import Contacts from 'pages/Contacts'
import AddressList from 'pages/Contacts/AddressList'
import Development from 'pages/Development'
import InspectionDetails from 'pages/InspectionDetails'
import Suggestion from 'pages/Suggestion'
import Inspection  from 'pages/Inspection'
import SelectListView from 'pages/Inspection/SelectListView'
import Archives  from 'pages/Archives'
import GrossDataDetail from 'pages/GrossData/GrossDataDetail'
import SignIn from 'pages/SignIn'
import SignInDetails from 'pages/SignInDetails'
import Message from 'pages/Message'
import MessageDetails from 'pages/MessageDetails'
import SendMessage from 'pages/SendMessage'
import DataSummary from 'pages/DataSummary'
import Approval from 'pages/Approval'
import PatrolTask from 'pages/PatrolTask'
import TaskDetails from 'pages/PatrolTask/TaskDetails'
import TaskCompleteDetails from 'pages/PatrolTask/TaskCompleteDetails'

// const history = createHashHistory()
// import history from './history'
// history={history}
const routerMap = ()=>(
	<HashRouter >
		<AnimatedRouter>
			<Route path='/' exact component={Navigation}/>
			<Route path='/home'  component={HomePage}/>
			<Route path='/grossData' component={GrossData} />
			<Route path='/inspection' component={Inspection} />
			<Route path='/selectListView' component={SelectListView} />
			<Route path='/archives' component={Archives} />
			<Route path='/login' component={Login}/>
			<Route path='/report' component={Report} />
			<Route path='/info' component={Information} />
			<Route path='/contacts' component={Contacts} />
			<Route path='/addressList' component={AddressList} />
			<Route path='/approval' component={Approval} />
			<Route path='/details/:id' component={InspectionDetails} />
			<Route path='/grossDataDetail/:id' component={GrossDataDetail} />
			<Route path='/suggestion' component={Suggestion} />
			<Route path='/signIn' component={SignIn}/>
			<Route path='/signInDetails' component={SignInDetails}/>
			<Route path='/message' component={Message}/>
			<Route path='/messageDetails' component={MessageDetails}/>
			<Route path='/sendMessage' component={SendMessage}/>
			<Route path='/dataSummary' component={DataSummary}/>
			<Route path='/patrolTask' component={PatrolTask}/>
			<Route path='/taskDetails' component={TaskDetails}/>
			<Route path='/taskCompleteDetails' component={TaskCompleteDetails}/>
			<Route path='/404' component={Development} />
		</AnimatedRouter>
	</HashRouter>
)

export default hot(module)(routerMap)
