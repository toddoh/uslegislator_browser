import React, { lazy, Suspense, Fragment, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { Provider } from 'react-redux'
import queryString from 'query-string'

import store from './store/store'
import BrowseTable from '~/components/table'
import appstyle from '~/styles/app.css'

const App = () => {
    const [legislatorData, setlegislatorData] = useState(null)
    const [queries, setQueries] = useState([])
    const [isDataLoading, setIsDataLoading] = useState(false)

    useEffect(() => {
        const query = queryString.parse(location.search)
        if (typeof query == 'object') {
            const queryParty = (query.party == 'dem') ? 'Democrat' : 'Republican'
            const queryState = query.state.toUpperCase()
            let queryArray = []
            queryArray.push(queryParty)
            queryArray.push(queryState)
            if (query.string) queryArray.push(query.string)
            console.log(queryArray)
            setQueries(queryArray)
        }

        setIsDataLoading(true);
        const publicdata = axios(
            'https://theunitedstates.io/congress-legislators/legislators-current.json'
        ).then(async (response) => {
            const restructure = response.data.map((legislator, i) => {
                let item = {}
                item.bioguide = legislator.id.bioguide
                item.name = `${legislator.name.first} ${legislator.name.last}`
                item.gender = legislator.bio.gender

                item.terms = legislator.terms
                if (legislator.bio.gender == 'F') {
                    item.title = (legislator.terms[legislator.terms.length - 1].type == 'sen') ? 'Senator' : 'Congresswoman'
                } else if (legislator.bio.gender == 'M') {
                    item.title = (legislator.terms[legislator.terms.length - 1].type == 'sen') ? 'Senator' : 'Congressman'
                }

                item.party = legislator.terms[legislator.terms.length - 1].party
                item.state = legislator.terms[legislator.terms.length - 1].state
                item.term_period_start = legislator.terms[legislator.terms.length - 1].start
                item.term_period_end = legislator.terms[legislator.terms.length - 1].end
                item.terms_count = legislator.terms.length

                return item
            })

            await setlegislatorData(restructure);
        })
            .catch(error => {
                console.log(error);
            }).then(() => {
                setIsDataLoading(false);
            });
    }, [])

    return (
        <div className={appstyle.app__main}>
            <BrowseTable data={legislatorData} queries={queries} />
        </div>
    );
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector("#app__root")
);
