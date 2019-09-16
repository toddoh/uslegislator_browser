import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { getData } from '../store/selectors'
import { ORIGINAL_DATA, RESTRUCTURED_DATA, PAGINATED_DATA, PAGINATION_NUM, RESTRUCTURED_COL, FILTER_BY_PARTY, FILTER_BY_STATE } from '../store/actiontypes'
import { filterData } from './filter'
import store  from '../store/store'

import tbl from '~/styles/table.css'

const TableRangeFilter = ({ originalData, filterByState, filterByParty }) => {

    const rangeChange = (e) => {
        const val = e.target.value
        
        if (val == 0) {
            let originalArray = filterData(originalData, filterByState, filterByParty)

            var i, j, restructure_chunks = [], chunk = 7;
            for (i = 0, j = originalArray.length; i < j; i += chunk) {
                restructure_chunks.push(originalArray.slice(i, i + chunk))
            }

            store.dispatch({type: RESTRUCTURED_DATA, state: { data: restructure_chunks} })
            store.dispatch({type: PAGINATED_DATA, state: { data: restructure_chunks[0]} })
            store.dispatch({type: PAGINATION_NUM, state: { data: 0} })
        } else {
            let originalArray = filterData(originalData, filterByState, filterByParty)
            let rangeMatch = originalArray.reduce((match, item) => {
                if (item.terms_count == val) match.push(item)

                return match
            },[])
            
            var i, j, restructure_chunks = [], chunk = 7;
            for (i = 0, j = rangeMatch.length; i < j; i += chunk) {
                restructure_chunks.push(rangeMatch.slice(i, i + chunk))
            }

            store.dispatch({type: RESTRUCTURED_DATA, state: { data: restructure_chunks} })
            store.dispatch({type: PAGINATED_DATA, state: { data: restructure_chunks[0]} })
            store.dispatch({type: PAGINATION_NUM, state: { data: 0} })
        }
    }

    return (
        <div className={tbl.table__filter_range}>
            <p>Filter by terms</p>
            <input type="range" min="0" max="30" defaultValue="0" onChange={rangeChange} step="1" />
        </div>
    )
}

const mapState = (state) => ({
    originalData: getData(state.tableState, ORIGINAL_DATA),
    restructuredData: getData(state.tableState, RESTRUCTURED_DATA),
    paginatedData: getData(state.tableState, PAGINATED_DATA),
    paginatedNum: getData(state.tableState, PAGINATION_NUM),
    restructuredColumns: getData(state.tableState, RESTRUCTURED_COL),
    filterByParty: getData(state.tableState, FILTER_BY_PARTY),
    filterByState: getData(state.tableState, FILTER_BY_STATE)
})

export default connect(
    mapState
)(TableRangeFilter)