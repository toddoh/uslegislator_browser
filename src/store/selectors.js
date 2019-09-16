
const getData = (tableState, dataType) => {
    return tableState.find(({type}) => type === dataType).data
}

export { getData }