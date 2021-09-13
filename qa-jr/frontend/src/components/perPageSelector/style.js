
import styled from 'styled-components';
import '../../assets/fonts.css'

const perPageSelectorWrapper = styled.div(props => ({
    display: "flex",
    maxWidth: "100px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    boxSizing: "border-box",
    borderRadius: "4px",
    minWidth: "64px",
    ...props,
}))
const perPageSelectorDiv = styled.div(props => ({
    paddingLeft: "8px",
    paddingRight: "8px",
    flex: "1",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    cursor: "pointer",
    flexDirection: "row",
    position: 'relative',
    "& div": {
        padding: "0px 0px 0px 3px",
        justifyContent: "center",
        display: "flex", flexDirection: "column",
    }
}))



export {
    perPageSelectorWrapper as PerPageSelectorWrapper,
    perPageSelectorDiv as PerPageSelectorDiv,
}