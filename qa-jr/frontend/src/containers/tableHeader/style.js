
import styled from 'styled-components';

const containerWrapper = styled.div(props => ({

    display: "inline-flex",
    padding: "16px",
    alignItems: "center",
    justifyContent: "center",
    ...props
}))
const container = styled.div(props => ({
    display: "flex",
    flex: 1,
    maxHeight: "40px",
    position: "relative",
    ...props
}))


export {
    containerWrapper as ContainerWrapper,
    container as Container,
}