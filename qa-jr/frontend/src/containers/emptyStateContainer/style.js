
import styled from 'styled-components';

const emptyStateWrapper = styled.div(props => ({
    height: props.height ||  "100px",
    display: props.display ||  "flex",
    justifyContent: props.justifyContent ||  "center",
    alignItems: props.alignItems ||  "center",
    flexDirection: props.flexDirection ||  "column",
    padding: props.padding ||  "20px 0 20px 0",
    ...props
}))

export {
    emptyStateWrapper as EmptyStateWrapper,

}