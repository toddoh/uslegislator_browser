import React, { useState, useEffect } from 'react'
import tbl from '~/styles/table.css'
import { compareValues } from './sort'

import { connect } from 'react-redux'
import { getData } from '../store/selectors'

import store from '../store/store'
import { ORIGINAL_DATA, RESTRUCTURED_DATA, PAGINATED_DATA, PAGINATION_NUM, RESTRUCTURED_COL, FILTER_BY_PARTY, FILTER_BY_STATE } from '../store/actiontypes'

const TableHeader = ({ col, restructuredData, restructuredColumns, filterByState, filterByParty }) => {
    const [, forceUpdate] = React.useState(0);

    useEffect(() => {
        if (filterByParty == '' || filterByState == '') {
            
        }
    },[restructuredData])

    const sortDispatcher = (column, reqorder) => {
        const restructuredc = restructuredColumns.map((c, i) => {
            if (c.type == column) {
                (c.sort == 'asc' ? c.sort = 'desc' : c.sort = 'asc')
            } else {
                c.sort = 'desc'
            }
            return c
        })
    
        const sorteddata = restructuredData.flat().sort(compareValues(column, reqorder))
        var i, j, restructure_chunks = [], chunk = 7;
        for (i = 0, j = sorteddata.length; i < j; i += chunk) {
            restructure_chunks.push(sorteddata.slice(i, i + chunk))
        }

        store.dispatch({ type: RESTRUCTURED_COL, state: { data: restructuredc } })
        store.dispatch({ type: RESTRUCTURED_DATA, state: { data: restructure_chunks } })
        store.dispatch({ type: PAGINATED_DATA, state: { data: restructure_chunks[0] } })
        store.dispatch({ type: PAGINATION_NUM, state: { data: 0 } })
    }

    if (restructuredColumns) {
        return restructuredColumns.map((key, index) => {
            return <th key={index} onClick={() => sortDispatcher(key.type, key.sort)}>
                <div className={tbl.table__header} style={key.sort == 'asc' ? {'borderTop': `2px solid rgb(0, 168, 243)`, 'marginTop': '-2px'} : {'boderTop': `none`}}>
                    <p>{key.name}</p>
                    {key.sort == 'asc' ?
                        <div className={`${tbl.table__sortbutton} ${tbl.desc}`}></div>
                        :
                        <div className={`${tbl.table__sortbutton} ${tbl.asc}`}></div>
                    }
                </div>
            </th>
        })
    }
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
)(TableHeader);