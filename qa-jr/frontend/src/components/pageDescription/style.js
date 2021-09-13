
import styled from 'styled-components';
import '../../assets/fonts.css'

const pageDesctiptionDiv = styled.div(props => ({
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    paddingLeft: "24px",
    width: "100%",
    "& > div": {
        display: "flex",
    },
    ...props
}))
const pageTitleDiv = styled.div(props => ({
    flexDirection: "row", 
    alignItems: "center",
    ...props
}))

export {
    pageDesctiptionDiv as PageDesctiptionDiv,
    pageTitleDiv as PageTitleDiv,
}