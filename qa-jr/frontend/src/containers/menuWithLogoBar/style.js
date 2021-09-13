
import styled from 'styled-components';

const containerWrapper = styled.div(props => ({
    height: 'inherit',
    display: 'flex',
    flexDirection: 'row',
}))
const scrollableContainer = styled.div(props => ({
    flex: "1",
    backgroundColor: "#F8F8FB",
    overflowY: "auto"
}))


export {
    containerWrapper as ContainerWrapper,
    scrollableContainer as ScrollableContainer,
}