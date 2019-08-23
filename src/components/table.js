import React, { lazy, Suspense, Fragment, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

import tbl from '~/styles/table.css';

const BrowseTable = ({ data }) => {
    const [originalData, setOriginalData] = useState([])
    const [restructuredData, setRestructuredData] = useState([])
    const [paginatedData, setPaginatedData] = useState([])
    const [restructuredColumns, setRestructuredColumns] = useState([])
    const [paginationNum, setPaginationNum] = useState(0)
    const [canPreviousPage, setcanPreviousPage] = useState(false)
    const [canNextPage, setcanNextPage] = useState(false)
    const [filterPartyType, setFilterPartyType] = useState('')
    const [filterStateType, setFilterStateType] = useState('')

    useEffect(() => {
        if (data) {
            setFilterPartyType('')
            setFilterStateType('')

            var i, j, restructure_chunks = [], chunk = 7;
            for (i = 0, j = data.length; i < j; i += chunk) {
                restructure_chunks.push(data.slice(i, i + chunk))
            }

            setOriginalData(data)
            setRestructuredData(restructure_chunks)

            const column = ["", "Name", "Title", "Party", "State", "Terms"]
            const column_type = ["photo", "name", "title", "party", "state", "terms_count"]
            const restructuredc = column.map((c, i) => {
                let item = {}
                item.name = c
                item.sort = 'desc'
                item.type = column_type[i]

                return item
            })
            setRestructuredColumns(restructuredc)
            setPaginatedData(restructure_chunks[0])
            setPaginationNum(0)
        }
    }, [data])

    const sortData = (column, reqorder) => {
        const compareValues = (key, order = 'asc') => {
            return function (a, b) {
                if (!a.hasOwnProperty(key) ||
                    !b.hasOwnProperty(key)) {
                    return 0;
                }

                const varA = (typeof a[key] === 'string') ?
                    a[key].toUpperCase() : a[key];
                const varB = (typeof b[key] === 'string') ?
                    b[key].toUpperCase() : b[key];

                let comparison = 0;
                if (varA > varB) {
                    comparison = 1;
                } else if (varA < varB) {
                    comparison = -1;
                }
                return (
                    (order == 'desc') ?
                        (comparison * -1) : comparison
                );
            };
        }

        const restructuredc = restructuredColumns.map((c, i) => {
            if (c.type == column) {
                (c.sort == 'asc' ? c.sort = 'desc' : c.sort = 'asc')
            } else {
                c.sort = 'desc'
            }
            return c
        })
        setRestructuredColumns(restructuredc)

        const sorteddata = restructuredData.flat().sort(compareValues(column, reqorder))
        var i, j, restructure_chunks = [], chunk = 7;
        for (i = 0, j = sorteddata.length; i < j; i += chunk) {
            restructure_chunks.push(sorteddata.slice(i, i + chunk))
        }

        setRestructuredData(restructure_chunks)
        setPaginatedData(restructure_chunks[0])
        setPaginationNum(0)
    }

    const renderTableHeader = (col) => {
        if (col) {
            return col.map((key, index) => {
                return <th key={index} onClick={() => sortData(key.type, key.sort)}>
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

    const renderLegislatorPhoto = (bioguide) => {
        return (
            <div key={bioguide} style={{ 'backgroundImage': `url(https://theunitedstates.io/images/congress/225x275/${bioguide}.jpg)` }} />
        )
    }

    const renderTableData = (data) => {
        try {
            if (data && Array.isArray(data)) {
                return data.map((legislator, i1) => {
                    return (
                        <tr key={legislator.bioguide}>
                            <td className={tbl.table__row_photo}>{renderLegislatorPhoto(legislator.bioguide)}</td>
                            <td>{legislator.name}</td>
                            <td>{legislator.title}</td>
                            <td>{legislator.party}</td>
                            <td>{legislator.state}</td>
                            <td>{legislator.terms_count}</td>
                        </tr>
                    )
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    const renderTablePagination = (currentnum, totalnum) => {
        useEffect(() => {
            if (currentnum == 0) {
                setcanPreviousPage(false)
                setcanNextPage(true)
            } else if (currentnum > 0 && currentnum < totalnum) {
                setcanPreviousPage(true)
                setcanNextPage(true)
            } else if (currentnum == totalnum) {
                setcanPreviousPage(true)
                setcanNextPage(false)
            }
        }, [totalnum, currentnum])

        const previousPage = () => {
            setPaginatedData(restructuredData[currentnum - 1])
            setPaginationNum(currentnum - 1)
        }

        const nextPage = () => {
            setPaginatedData(restructuredData[currentnum + 1])
            setPaginationNum(currentnum + 1)
        }

        const gotoPage = (num) => {
            setPaginatedData(restructuredData[num])
            setPaginationNum(num)
        }

        const pagination = (total, currentoriginal) => {
            let shownPages = 5
            let result = []
            let current = currentoriginal + 1
            if (current > total - shownPages) {
                result.push(total - 2, total - 1, total)
            } else {
                result.push(current, current + 1, current + 2, '...', total)
            }
            console.log(result)
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
                            <button key={n} className={tbl.button__nums} onClick={() => gotoPage(paginationArray[i - 1])}>
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

    const renderTableFilterParty = (partytype) => {
        useEffect(() => {

        }, [partytype])

        const removeFilter = () => {
            setFilterPartyType('')

            const filtered = originalData.filter((group, i) => {
                if (filterStateType == '') {
                    return true
                } else {
                    if (group.state == filterStateType) return true
                }
            })
            var i, j, restructure_chunks = [], chunk = 7;
            for (i = 0, j = filtered.length; i < j; i += chunk) {
                restructure_chunks.push(filtered.slice(i, i + chunk))
            }

            setRestructuredData(restructure_chunks)
            setPaginatedData(restructure_chunks[0])
            setPaginationNum(0)
        }

        const filterByParty = (party) => {
            setFilterPartyType(party)
            if (party == '') return removeFilter()

            const filtered = originalData.filter((group, i) => {
                if (filterStateType == '') {
                    if (group.party == party) return true
                } else {
                    if (group.state == filterStateType && group.party == party) return true
                }

            })
            var i, j, restructure_chunks = [], chunk = 7;
            for (i = 0, j = filtered.length; i < j; i += chunk) {
                restructure_chunks.push(filtered.slice(i, i + chunk))
            }

            setRestructuredData(restructure_chunks)
            setPaginatedData(restructure_chunks[0])
            setPaginationNum(0)
        }

        return (
            <div className={tbl.table__filter_party} data-activeid={partytype}>
                <p>Party</p>
                <select value={partytype} onChange={e => { filterByParty(e.target.value) }}>
                    <option value="">Any</option>
                    <option value="Democrat">Democrat</option>
                    <option value="Republican">Republican</option>
                    <option value="Independent">Independent</option>
                </select>
            </div>
        )
    }

    const renderTableFilterState = (statetype) => {
        useEffect(() => {

        }, [statetype])

        const removeFilter = () => {
            setFilterStateType('')

            const filtered = originalData.filter((group, i) => {
                if (filterPartyType == '') {
                    return true
                } else {
                    if (group.party == filterPartyType) return true
                }
            })
            var i, j, restructure_chunks = [], chunk = 7;
            for (i = 0, j = filtered.length; i < j; i += chunk) {
                restructure_chunks.push(filtered.slice(i, i + chunk))
            }

            setRestructuredData(restructure_chunks)
            setPaginatedData(restructure_chunks[0])
            setPaginationNum(0)
        }

        const filterByState = (state) => {
            setFilterStateType(state)
            if (state == '') return removeFilter()

            const filtered = originalData.filter((group, i) => {
                if (filterPartyType == '') {
                    if (group.state == state) return true
                } else {
                    if (group.state == state && group.party == filterPartyType) return true
                }
            })
            var i, j, restructure_chunks = [], chunk = 7;
            for (i = 0, j = filtered.length; i < j; i += chunk) {
                restructure_chunks.push(filtered.slice(i, i + chunk))
            }

            setRestructuredData(restructure_chunks)
            setPaginatedData(restructure_chunks[0])
            setPaginationNum(0)
        }

        return (
            <div className={tbl.table__filter_state} data-activeid={statetype}>
                <p>State</p>
                <select value={statetype} onChange={e => { filterByState(e.target.value) }}>
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

    return (
        <div>
            <div className={tbl.hero}>
                <h2>U.S. Legislators Browser</h2>
            </div>

            <div className={tbl.datafilter}>
                {renderTableFilterParty(filterPartyType)}
                {renderTableFilterState(filterStateType)}
            </div>
            <table id='uslegislator'>
                <tbody>
                    <tr>{renderTableHeader(restructuredColumns)}</tr>
                    {renderTableData(paginatedData)}
                </tbody>
            </table>
            {renderTablePagination(paginationNum, restructuredData.length)}

        </div>
    )
}

export default BrowseTable;
