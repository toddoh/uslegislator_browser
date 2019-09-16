import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { filterData } from './filter'

import store from '../store/store'
import { getData } from '../store/selectors'
import { ORIGINAL_DATA, RESTRUCTURED_DATA, PAGINATED_DATA, PAGINATION_NUM, RESTRUCTURED_COL, FILTER_BY_PARTY, FILTER_BY_STATE } from '../store/actiontypes'

import tbl from '~/styles/table.css'

const TableSearch = ({param, originalData, restructuredData, filterByParty, filterByState }) => {
    const [searchQueryValue, setsearchQueryValue] = useState(null)

    useEffect(() => {
        if (param) {
            setsearchQueryValue(param)
            searchFuzzy(null, param)
        } 
    },[param])

    const searchFuzzy = (e, param) => {
        const val = (e) ? e.target.value : param
        setsearchQueryValue(val)

        if (val == '') {
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
            
            let fuzzyresult = originalArray.reduce((match, legislator) => {
                let legislatorname = legislator.name.toLowerCase()
                let searchstring = val.toLowerCase().split(' ')

                let fuzzymatches = 0
                searchstring.map(str => {
                    let stringmatch = 0
                    if (legislatorname.indexOf(str) > -1) {
                        stringmatch++
                    }

                    if (stringmatch >= 1) fuzzymatches++
                })

                if (fuzzymatches == searchstring.length) match.push(legislator)
                return match
            }, [])

            var i, j, restructure_chunks = [], chunk = 7;
            for (i = 0, j = fuzzyresult.length; i < j; i += chunk) {
                restructure_chunks.push(fuzzyresult.slice(i, i + chunk))
            }

            store.dispatch({type: RESTRUCTURED_DATA, state: { data: restructure_chunks} })
            store.dispatch({type: PAGINATED_DATA, state: { data: restructure_chunks[0]} })
            store.dispatch({type: PAGINATION_NUM, state: { data: 0} })
        }
    }

    return (
        <div className={tbl.table__filter_textsearch}>
            <p>Search by name</p>
            <input type="text" value={searchQueryValue} onChange={searchFuzzy} />
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
)(TableSearch)