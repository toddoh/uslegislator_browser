import React, { useState, useEffect } from 'react'
import tbl from '~/styles/table.css'

import { connect } from 'react-redux'
import { getData } from '../store/selectors'
import { filterData } from './filter'

import store from '../store/store'
import { ORIGINAL_DATA, RESTRUCTURED_DATA, PAGINATED_DATA, PAGINATION_NUM, RESTRUCTURED_COL, FILTER_BY_PARTY, FILTER_BY_STATE } from '../store/actiontypes'

const TableFilterParty = ({ partytype, originalData, filterByState, filterByParty, restructuredColumns }) => {
    const removeFilter = () => {
        store.dispatch({type: FILTER_BY_PARTY, state: { data: ''} })

        const filtered = filterData(originalData, filterByState, '')
        var i, j, restructure_chunks = [], chunk = 7;
        for (i = 0, j = filtered.length; i < j; i += chunk) {
            restructure_chunks.push(filtered.slice(i, i + chunk))
        }

        store.dispatch({type: RESTRUCTURED_DATA, state: { data: restructure_chunks} })
        store.dispatch({type: PAGINATED_DATA, state: { data: restructure_chunks[0]} })
        store.dispatch({type: PAGINATION_NUM, state: { data: 0} })
    }

    const filterParty = (party) => {
        store.dispatch({type: FILTER_BY_PARTY, state: { data: party} })
        const restructuredc = restructuredColumns.map((c, i) => {
            c.sort = 'desc'
            
            return c
        })
    
        store.dispatch({ type: RESTRUCTURED_COL, state: { data: restructuredc } })
        if (party == '') return removeFilter()

        const filtered = filterData(originalData, filterByState, party)
        var i, j, restructure_chunks = [], chunk = 7;
        for (i = 0, j = filtered.length; i < j; i += chunk) {
            restructure_chunks.push(filtered.slice(i, i + chunk))
        }

        store.dispatch({type: RESTRUCTURED_DATA, state: { data: restructure_chunks} })
        store.dispatch({type: PAGINATED_DATA, state: { data: restructure_chunks[0]} })
        store.dispatch({type: PAGINATION_NUM, state: { data: 0} })
    }

    return (
        <div className={tbl.table__filter_party} data-activeid={partytype}>
            <p>Party</p>
            <select value={partytype} onChange={e => { filterParty(e.target.value) }}>
                <option value="">Any</option>
                <option value="Democrat">Democrat</option>
                <option value="Republican">Republican</option>
                <option value="Independent">Independent</option>
            </select>
        </div>
    )
}

const mapState = state => ({
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
)(TableFilterParty);