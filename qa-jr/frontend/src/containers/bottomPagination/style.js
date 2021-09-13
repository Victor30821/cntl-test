
import styled from 'styled-components';

const bottomPaginationWrapper = styled.div(props => ({
    margin: props.margin || "55px 25px 10px 25px",
    display: props.display || "flex",
    flexDirection: props.flexDirection || "row",
    alignItems: props.alignItems || "center",
    ...props
}))
const pageItemDescriptionDiv = styled.div(props => ({
    flex: "1",
    ...props
}))


export {
    bottomPaginationWrapper as BottomPaginationWrapper,
    pageItemDescriptionDiv as PageItemDescriptionDiv,
}