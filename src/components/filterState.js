import React, { useState, useEffect } from 'react'
import tbl from '~/styles/table.css'

import { connect } from 'react-redux'
import { getData } from '../store/selectors'
import { filterData } from './filter'

import store from '../store/store'
import { ORIGINAL_DATA, RESTRUCTURED_DATA, PAGINATED_DATA, PAGINATION_NUM, RESTRUCTURED_COL, FILTER_BY_PARTY, FILTER_BY_STATE } from '../store/actiontypes'

const TableFilterState = ({ statetype, originalData, filterByState, filterByParty, restructuredColumns }) => {
    const removeFilter = () => {
        store.dispatch({type: FILTER_BY_STATE, state: { data: ''} })

        const filtered = filterData(originalData, '', filterByParty)
        var i, j, restructure_chunks = [], chunk = 7;
        for (i = 0, j = filtered.length; i < j; i += chunk) {
            restructure_chunks.push(filtered.slice(i, i + chunk))
        }

        store.dispatch({type: RESTRUCTURED_DATA, state: { data: restructure_chunks} })
        store.dispatch({type: PAGINATED_DATA, state: { data: restructure_chunks[0]} })
        store.dispatch({type: PAGINATION_NUM, state: { data: 0} })
    }

    const filterState = (state) => {
        store.dispatch({type: FILTER_BY_STATE, state: { data: state} })
        const restructuredc = restructuredColumns.map((c, i) => {
            c.sort = 'desc'
            
            return c
        })
    
        store.dispatch({ type: RESTRUCTURED_COL, state: { data: restructuredc } })
        if (state == '') return removeFilter()

        const filtered = filterData(originalData, state, filterByParty)
        var i, j, restructure_chunks = [], chunk = 7;
        for (i = 0, j = filtered.length; i < j; i += chunk) {
            restructure_chunks.push(filtered.slice(i, i + chunk))
        }

        store.dispatch({type: RESTRUCTURED_DATA, state: { data: restructure_chunks} })
        store.dispatch({type: PAGINATED_DATA, state: { data: restructure_chunks[0]} })
        store.dispatch({type: PAGINATION_NUM, state: { data: 0} })
    }

    return (
        <div className={tbl.table__filter_state} data-activeid={statetype}>
            <p>State</p>
            <select value={statetype} onChange={e => { filterState(e.target.value) }}>
                <option value="">Any</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District Of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
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
)(TableFilterState);