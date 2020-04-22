import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'

import rootReducer from './root-reducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

function configureStore(initialState={}) {
	return createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk)))
}

// pass an optional param to rehydrate state on app start
const store = configureStore()

// export store singleton instance
export default store
