import styled from 'styled-components'

const dropDown = styled.div(props => ({
    background: "rgb(255, 255, 255)",
    color: "rgb(0, 0, 0)",
    boxSizing: "border-box",
    boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
    borderWidth: "0px 1px 3px",
    borderTopStyle: "initial",
    display: "flex",
    width: props.width || "100%",
    zIndex: "9997",
}))
const itemsList = styled.ul(props => ({
    flex: "1",
    maxHeight: "90px",
    display: "inline-block",
    overflowY: "auto",
}))
const item = styled.li(props => ({
    listStyle: "none",
    display: "list-item",
    backgroundImage: "none",
    '& : hover': {
        background: "#ddecff"
    }
}))
const itemDiv = styled.div(props => ({
    padding: "6px 7px 5px",
    margin: "0",
    cursor: "pointer",
    minHeight: "1em",
}))

export {
    dropDown as DropDown,
    itemsList as ItemsList,
    item as Item,
    itemDiv as ItemDiv
}