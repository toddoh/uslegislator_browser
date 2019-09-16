import  { ORIGINAL_DATA, RESTRUCTURED_DATA, PAGINATED_DATA, PAGINATION_NUM, RESTRUCTURED_COL, FILTER_BY_PARTY, FILTER_BY_STATE } from './actiontypes'

const DEFAULT_STATE = [
    {
        type: 'ORIGINAL_DATA',
        data: []
    },
    {
        type: 'RESTRUCTURED_DATA',
        data: []
    },
    {
        type: 'PAGINATED_DATA',
        data: []
    },
    {
        type: 'PAGINATION_NUM',
        data: 0
    },
    {
        type: 'RESTRUCTURED_COL',
        data: []
    },
    {
        type: 'FILTER_BY_PARTY',
        data: ''
    },
    {
        type: 'FILTER_BY_STATE',
        data: ''
    }
];

const saveData = (state, action) => {
    return state.map(item => 
        item.type == action.type ? 
        { ...item, data: action.state.data } : item
    )
}

const tableReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'ORIGINAL_DATA' : {
            return saveData(state, action)
        }
        default:  return saveData(state, action)
    }
}

export default tableReducer