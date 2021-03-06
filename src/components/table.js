import React, { lazy, Suspense, Fragment, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import { getData } from '../store/selectors'

import tbl from '~/styles/table.css'
import TableData from './data'
import TableHeader from './header'
import TablePagination from './pagination'
import TableFilterParty from './filterParty'
import TableFilterState from './filterState'
import TableSearch from './search'
import TableRangeFilter from './range'
import { filterData } from './filter'

import store from '../store/store'
import { ORIGINAL_DATA, RESTRUCTURED_DATA, PAGINATED_DATA, PAGINATION_NUM, RESTRUCTURED_COL, FILTER_BY_PARTY, FILTER_BY_STATE } from '../store/actiontypes'

const BrowseTable = ({ data, queries, originalData, restructuredData, paginatedData, paginationNum, restructuredColumns, filterPartyType, filterStateType }) => {
    const [searchQueryParam, setsearchQueryParam] = useState(null)

    useEffect(() => {
        if (data) {
            const prefiltered = (queries.length > 0) ? filterData(data, queries[1], queries[0]) : data
            store.dispatch({type: FILTER_BY_PARTY, state: { data:  queries[0] } })
            store.dispatch({type: FILTER_BY_STATE, state: { data:  queries[1] } })

            var i, j, restructure_chunks = [], chunk = 7;
            for (i = 0, j = prefiltered.length; i < j; i += chunk) {
                restructure_chunks.push(prefiltered.slice(i, i + chunk))
            }

            store.dispatch({type: ORIGINAL_DATA, state: { data:  data } })
            store.dispatch({type: RESTRUCTURED_DATA, state: { data:  restructure_chunks } })

            const column = ["", "Name", "Title", "Party", "State", "Terms"]
            const column_type = ["photo", "name", "title", "party", "state", "terms_count"]
            const restructuredc = column.map((c, i) => {
                let item = {}
                item.name = c
                item.sort = 'desc'
                item.type = column_type[i]

                return item
            })

            store.dispatch({type: RESTRUCTURED_COL, state: { data: restructuredc } })
            store.dispatch({type: PAGINATED_DATA, state: { data:  restructure_chunks[0] } })
            store.dispatch({type: PAGINATION_NUM, state: { data:  0 } })

            if (queries[2]) setsearchQueryParam(queries[2])
        }
    }, [data])


    return (
        <div>
            <div className={tbl.hero}>
                <h2>U.S. Legislators Browser</h2>
            </div>

            <div className={tbl.datafilter}>
                <TableRangeFilter />
                <TableSearch param={searchQueryParam} />
                <TableFilterParty partytype={queries[0] || filterPartyType} />
                <TableFilterState statetype={queries[1] || filterStateType} />
            </div>
            <table id='uslegislator'>
                <tbody>
                    <tr><TableHeader col={restructuredColumns} /></tr>
                    <TableData data={paginatedData} />
                </tbody>
            </table>
            <TablePagination currentnum={paginationNum} totalnum={restructuredData.length} />

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
)(BrowseTable);
