export const filterData = (data, filterByState, filterByParty) => {


    return data.filter((group, i) => {
        if (filterByState == '' && filterByParty !== '') {
            if (group.party == filterByParty) return true
        } else if (filterByState !== '' && filterByParty == '') {
            if (group.state == filterByState) return true
        } else if (filterByState !== '' && filterByParty !== '') {
            if (group.state == filterByState && group.party == filterByParty) return true
        } else {
            return true
        }
    })
}