import React, { useState, useEffect } from 'react'
import tbl from '~/styles/table.css'

import { connect } from 'react-redux'
import { getData } from '../store/selectors'

import store from '../store/store'
import { ORIGINAL_DATA, RESTRUCTURED_DATA, PAGINATED_DATA, PAGINATION_NUM, RESTRUCTURED_COL, FILTER_BY_PARTY, FILTER_BY_STATE } from '../store/actiontypes'

const TablePagination = ({ restructuredData, paginatedNum }) => {
    if (isNaN(paginatedNum) || !Array.isArray(restructuredData)) return (<div></div>)
    const [canPreviousPage, setcanPreviousPage] = useState(false)
    const [canNextPage, setcanNextPage] = useState(false)
    const [currentnum, setCurrentnum] = useState(0)
    const [totalnum, setTotalnum] = useState(0)
    
    useEffect(() => {
        if (restructuredData && Array.isArray(restructuredData)) {
            setTotalnum(restructuredData.length)
            setCurrentnum(paginatedNum)

            if (paginatedNum == 0) {
                setcanPreviousPage(false)
                setcanNextPage(true)
            } else if (paginatedNum > 0 && paginatedNum < totalnum) {
                setcanPreviousPage(true)
                setcanNextPage(true)
            } else if (paginatedNum == totalnum) {
                setcanPreviousPage(true)
                setcanNextPage(false)
            }
        }
    }, [paginatedNum, restructuredData])

    const previousPage = () => {
        store.dispatch({ type: PAGINATED_DATA, state: { data: restructuredData[currentnum - 1] } })
        store.dispatch({ type: PAGINATION_NUM, state: { data: currentnum - 1 } })
    }

    const nextPage = () => {
        store.dispatch({ type: PAGINATED_DATA, state: { data: restructuredData[currentnum + 1] } })
        store.dispatch({ type: PAGINATION_NUM, state: { data: currentnum + 1 } })
    }

    const gotoPage = (num) => {
        store.dispatch({ type: PAGINATED_DATA, state: { data: restructuredData[num] } })
        store.dispatch({ type: PAGINATION_NUM, state: { data: num } })
    }

    const pagination = (total, currentoriginal) => {
        let shownPages = 5
        let result = []
        let current = currentoriginal + 1
        if (current > total - shownPages) {
            let i;
            for (i = 0; i < total; i++) {
                result.push(i+1)
            }

            result = result.slice(-5)
        } else {
            if (current > 2) {
                result.push(current - 2, current - 1, current, current + 1, current + 2, '...', total)
            } else { 
                result.push(current, current + 1, current + 2, '...', total)
            }
        }

        return result
    }

    return (
        <div className={tbl.table__pagination}>
            <div className={tbl.buttons}>
                <button className={tbl.button__firstpage} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    <div className={tbl.button__prev}></div>
                    <div className={tbl.button__prev}></div>
                </button>
                <button className={tbl.button__left} onClick={() => previousPage()} disabled={!canPreviousPage}>
                    <div className={tbl.button__prev}></div>
                </button>

                {pagination(totalnum, currentnum).map((n, i) =>
                    isNaN(n) ? (
                        <button key={n} className={tbl.button__nums} onClick={() => gotoPage(currentnum + 3)}>
                            {n}
                        </button>
                    ) : (
                            <button key={n} className={tbl.button__nums} onClick={() => gotoPage(n - 1)}>
                                {n}
                            </button>
                        )
                )}

                <button className={tbl.button__right} onClick={() => nextPage()} disabled={!canNextPage}>
                    <div className={tbl.button__next}></div>
                </button>

                <button className={tbl.button__lastpage} onClick={() => gotoPage(totalnum - 1)} disabled={!canNextPage}>
                    <div className={tbl.button__next}></div>
                    <div className={tbl.button__next}></div>
                </button>
            </div>
            <p>
                Page <strong>{currentnum + 1} of {totalnum}</strong>
            </p>
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
)(TablePagination);