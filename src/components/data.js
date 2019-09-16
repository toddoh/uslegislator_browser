import React, { useState, useEffect } from 'react'
import tbl from '~/styles/table.css'

const TableData = ({ data }) => {
    const renderLegislatorPhoto = (bioguide) => {
        return (
            <div key={bioguide} style={{ 'backgroundImage': `url(https://theunitedstates.io/images/congress/225x275/${bioguide}.jpg)` }} />
        )
    }
    
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
    } else {
        return (<tr></tr>)
    }
}

export default TableData