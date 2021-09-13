import styled from 'styled-components'
const mapDiv = styled.div(props => ({
    position: 'relative',
    height: props.height || "500px",
    width: props.height || "500px",
    ...props,
}))

export {
    mapDiv as MapDiv,
}