import { createStore, combineReducers } from 'redux'
import tableReducer from './tableReducer'

const mainReducer = combineReducers({
    tableState: tableReducer
})

export default mainReducer

